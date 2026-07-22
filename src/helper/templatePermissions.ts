import { environment } from '../Core';
import { superagentGet } from '../helper';

/**
 * Helper for client-side expansion of template based permissions (ONE-9308).
 *
 * The Account Server / DataManager issue permissions of the form
 * `dm:template-<templateID>:<rest>` which act like `dm:<dataManagerID>:<rest>` for every
 * DataManager that is based on `<templateID>`. To keep the permission lists small this
 * expansion is intentionally NOT done server side. Clients which match permissions on their
 * own (shiro-trie) have to expand the typically 1-3 template entries of their own list
 * locally. This module fetches the template -> dataManager mapping once per template
 * (module level cache, TTL) and expands the flat permission list.
 *
 * @module helper/templatePermissions
 */

const UUID_V4 = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

/**
 * Matches a single `dm:template-<uuidv4>:` permission prefix. Invalid `template-` values
 * (no valid uuid) are ignored on purpose.
 *
 * @access private
 */
const templatePermissionRegex = new RegExp(`^dm:template-(${UUID_V4}):`, 'i');

interface CacheEntry {
  ids: Array<string>;
  fetchedAt: number;
}

/**
 * Module level cache keyed by `<environment>+<templateID>`. Browsers do not receive AMQP
 * events, so the TTL is the only freshness source here.
 *
 * @access private
 */
const mappingCache: Map<string, CacheEntry> = new Map();

/**
 * Time to live of a cached template -> dataManager mapping in milliseconds (~5 minutes).
 */
export const TEMPLATE_MAPPING_TTL = 5 * 60 * 1000;

/**
 * DataManager base URLs per environment. Kept in sync with the `urls` map in
 * `src/DataManager.ts`.
 *
 * @access private
 */
const datamanagerURLs = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  nightly: 'https://datamanager.buffalo.entrecode.de/',
  develop: 'http://localhost:7471/',
};

/**
 * Resolves the DataManager base URL for a given environment. Also handles environments with a
 * shortID suffix (e.g. `live1234abcd`) the same way {@link Core} does.
 *
 * @access private
 *
 * @param {environment} environment the environment to resolve
 * @returns {string | undefined} the base URL or undefined for unknown environments
 */
export function datamanagerURL(environment: environment): string | undefined {
  if (datamanagerURLs[environment]) {
    return datamanagerURLs[environment];
  }
  const key = Object.keys(datamanagerURLs).find((urlKey) => environment.indexOf(urlKey) !== -1);
  return key ? datamanagerURLs[key] : undefined;
}

/**
 * Returns the distinct templateIDs referenced by `dm:template-<uuidv4>:` entries in the given
 * permission list. Invalid `template-` values are ignored.
 *
 * @param {Array<string>} permissions the flat permission list
 * @returns {Array<string>} the distinct templateIDs
 */
export function findTemplateIDs(permissions: Array<string>): Array<string> {
  const ids = new Set<string>();
  (permissions || []).forEach((permission) => {
    const match = templatePermissionRegex.exec(permission);
    if (match) {
      ids.add(match[1]);
    }
  });
  return Array.from(ids);
}

/**
 * Whether the given permission list contains at least one `dm:template-<uuidv4>:` entry.
 *
 * @param {Array<string>} permissions the flat permission list
 * @returns {boolean} true if a template permission is present
 */
export function hasTemplatePermissions(permissions: Array<string>): boolean {
  return (permissions || []).some((permission) => templatePermissionRegex.test(permission));
}

/**
 * Fetches the dataManagerIDs for a single template from the new route (fail-closed & cached).
 *
 * @access private
 *
 * @param {string} templateID the templateID to resolve
 * @param {environment} environment the environment (used for token & base URL)
 * @param {string} baseURL the DataManager base URL
 * @returns {Promise<Array<string> | undefined>} the dataManagerIDs, or undefined on error
 */
async function fetchTemplateDataManagers(
  templateID: string,
  environment: environment,
  baseURL: string,
): Promise<Array<string> | undefined> {
  const cacheKey = `${environment}+${templateID}`;
  const cached = mappingCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt <= TEMPLATE_MAPPING_TTL) {
    return cached.ids;
  }

  const url = `${baseURL}template/${templateID}/datamanagers`;
  try {
    // any valid AccessToken of the environment is sufficient for this route; superagentGet
    // automatically attaches the environment's session token.
    const body = await superagentGet(url, undefined, environment);
    const ids = body && Array.isArray(body.dataManagerIDs) ? body.dataManagerIDs : [];
    mappingCache.set(cacheKey, { ids, fetchedAt: Date.now() });
    return ids;
  } catch (err) {
    // fail-closed: route down / error -> behave as if there was no mapping (no throw).
    return undefined;
  }
}

/**
 * Resolves the template -> dataManagerIDs mapping for all `dm:template-<uuidv4>:` entries in
 * the given permission list. Uses a module level cache with a ~5 minute TTL. Never throws:
 * templates that cannot be resolved (unknown environment, route down) are simply omitted from
 * the result (fail-closed).
 *
 * @param {Array<string>} permissions the flat permission list
 * @param {environment} environment the environment (used for token & base URL)
 * @returns {Promise<Map<string, Array<string>>>} mapping of templateID -> dataManagerID[]
 */
export async function resolveTemplateMappings(
  permissions: Array<string>,
  environment: environment,
): Promise<Map<string, Array<string>>> {
  const result: Map<string, Array<string>> = new Map();
  const templateIDs = findTemplateIDs(permissions);
  if (templateIDs.length === 0) {
    return result;
  }

  const baseURL = datamanagerURL(environment);
  if (!baseURL) {
    // unknown environment -> fail-closed
    return result;
  }

  await Promise.all(
    templateIDs.map(async (templateID) => {
      const ids = await fetchTemplateDataManagers(templateID, environment, baseURL);
      if (ids) {
        result.set(templateID, ids);
      }
    }),
  );

  return result;
}

/**
 * Pure, synchronous expansion of a flat permission list. Every `dm:template-<t>:<rest>` entry
 * is replaced by the concrete `dm:<id>:<rest>` entries for each mapped dataManagerID (with
 * dedupe). Entries of unknown templates (no mapping) are kept untouched (harmless in the trie).
 *
 * @param {Array<string>} permissions the flat permission list
 * @param {Map<string, Array<string>>} mappings mapping of templateID -> dataManagerID[]
 * @returns {Array<string>} the expanded (deduped) permission list
 */
export function expandPermissions(
  permissions: Array<string>,
  mappings: Map<string, Array<string>>,
): Array<string> {
  if (!permissions) {
    return permissions;
  }

  const result = new Set<string>();
  permissions.forEach((permission) => {
    const match = templatePermissionRegex.exec(permission);
    if (!match) {
      result.add(permission);
      return;
    }

    const templateID = match[1];
    const dataManagerIDs = mappings.get(templateID);
    if (!dataManagerIDs) {
      // unknown template (not resolved) -> keep untouched
      result.add(permission);
      return;
    }

    const rest = permission.slice(match[0].length);
    dataManagerIDs.forEach((id) => {
      result.add(`dm:${id}:${rest}`);
    });
  });

  return Array.from(result);
}

/**
 * Clears the module level template mapping cache. Intended for tests.
 *
 * @access private
 */
export function clearTemplateMappingCache(): void {
  mappingCache.clear();
}
