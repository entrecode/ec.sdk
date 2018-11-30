import * as querystring from 'querystring';

import EntryResource, { createEntry } from './EntryResource';
import Resource from '../Resource';
import { superagentGet } from '../../helper';
import { environment } from '../../Core';

const environmentSymbol: any = Symbol.for('environment');

interface LiteEntryResource {
  _entryTitle: string;
  _id: string;
  _modelTitle: string;
  id: string;
}

/**
 * LiteEntryResources are what the name suggests. They are lite entries. They only provide some
 * basic functionality useful for showing unresolved (read: not loaded nested) entries.
 *
 * @prop {String} _entryTitle - The entry title of this LiteEntryResource
 * @prop {String} environment - The entries environment
 * @prop {object} traversal - traversal from which to continue
 */
class LiteEntryResource extends Resource {
  constructor(liteResource: any, environment: environment, traversal?: any) {
    if (!('_links' in liteResource)) {
      const qs = querystring.parse(liteResource.href.substr(liteResource.href.indexOf('?') + 1));
      liteResource = {
        id: qs.id || qs._id,
        _id: qs.id || qs._id,
        _links: {
          self: {
            profile: liteResource.profile,
            href: liteResource.href,
          },
        },
        _modelTitle: liteResource.name,
        _entryTitle: liteResource.title,
      };
    }
    super(liteResource, environment, traversal);
    ['_entryTitle', '_id', '_modelTitle', 'id'].forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => <string>this.getProperty(key),
      });
    });
  }

  /**
   * Get the title of this {@link LiteEntryResource}'s model.
   *
   * @returns {string} title of the entry's model
   */
  getModelTitle(): string {
    return this.getProperty('_modelTitle');
  }

  /**
   * Get the title from this {@link EntryResource}. Note: field argument only works with proper
   * {@link EntryResource}s and is only in this method signature to provide consistency.
   *
   * @prop {string?} field - Will throw if provided. Only for consistency.
   * @returns {string} title The title of the entry.
   */
  getTitle(field: string): string | Array<string> | undefined {
    if (field) {
      throw new Error('getTitle with field argument not supported by LiteEntryResource');
    }
    return this.getProperty('_entryTitle');
  }

  /**
   * In order to resolve this {@link LiteEntryResource} to a proper {@link EntryResource} call this
   * function. A promise is returned which resolves to the {@link EntryResource}.
   *
   * @returns {Promise<EntryResource>} Promise resolving to {@link EntryResource}.
   */
  resolve(): Promise<EntryResource> {
    // TODO switch to traverson loading (traverson.from(self))
    return superagentGet(this.getLink('self').href, { Accept: 'application/json' }, this[environmentSymbol]).then(
      (resource) => createEntry(resource, this[environmentSymbol]),
    );
  }

  /**
   * Saves this {@link EntryResource}. Does not work on {@linkt LiteEntryResource}s. Those must be
   * resolved first.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<EntryResource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false, overwriteSchemaUrl: string): Promise<EntryResource> {
    if (!(this instanceof EntryResource)) {
      throw new Error('LiteEntryResource cannot be saved');
    }
    return <Promise<EntryResource>>super.save(safePut, overwriteSchemaUrl);
  }
}

export default LiteEntryResource;
