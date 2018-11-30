import * as querystring from 'querystring';
import * as traverson from 'traverson';

import Resource from '../Resource';
import { get } from '../../helper';
import { environment } from '../../Core';
import DMAccountResource from '../datamanager/DMAccountResource';

const environmentSymbol: any = Symbol.for('environment');

interface LiteDMAccountResource {
  title: string;
  accountID: string;
  email: string;
}

/**
 * LiteEntryResources are what the name suggests. They are lite entries. They only provide some
 * basic functionality useful for showing unresolved (read: not loaded nested) entries.
 *
 * @prop {String} accountID - The id of this dm account
 * @prop {String} email - The email of this dm account, undefined if anonymous
 */
class LiteDMAccountResource extends Resource {
  constructor(liteResource: any, environment: environment, traversal?: any) {
    if (!('_links' in liteResource)) {
      const qs = querystring.parse(liteResource.href.substr(liteResource.href.indexOf('?') + 1));
      liteResource = {
        accountID: qs.accountID,
        _links: {
          self: {
            profile: liteResource.profile,
            href: liteResource.href,
          },
        },
        email: liteResource.title || liteResource.name,
        dataManagerID: qs.dataManagerID,
      };
    }
    super(liteResource, environment, traversal);
    ['accountID', 'email'].forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => <string>this.getProperty(key),
      });
    });
    Object.defineProperty(this, 'title', {
      enumerable: false,
      get: () => this.email || this.accountID,
    });
    this.countProperties();
  }

  private get dataManagerID() {
    return this.getProperty('dataManagerID');
  }

  /**
   * In order to resolve this {@link LiteDMAccountResource} to a proper {@link DMAccountResource} call this
   * function. A promise is returned which resolves to the {@link DMAccountResource}.
   *
   * @returns {Promise<DMAccountResource>} Promise resolving to {@link DMAccountResource}.
   */
  resolve(): Promise<DMAccountResource> {
    const request = traverson.from(this.getLink('self').href).jsonHal();
    return get(this[environmentSymbol], request).then(
      ([res, traversal]) => new DMAccountResource(res, this[environmentSymbol], traversal),
    );
  }

  /**
   * Saves this {@link DMAccountResource}. Does not work on {@linkt LiteDMAccountResource}s. Those must be
   * resolved first.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<EntryResource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false, overwriteSchemaUrl: string): Promise<DMAccountResource> {
    if (!(this instanceof DMAccountResource)) {
      throw new Error('LiteDMAccountResource cannot be saved');
    }
    return <Promise<DMAccountResource>>super.save(safePut, overwriteSchemaUrl);
  }
}

export default LiteDMAccountResource;
