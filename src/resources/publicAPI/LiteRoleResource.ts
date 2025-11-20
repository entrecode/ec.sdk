import * as querystring from 'querystring';
import * as traverson from 'traverson';

import Resource from '../Resource';
import { get } from '../../helper';
import { environment } from '../../types';
import DMAccountResource from '../datamanager/DMAccountResource';
import RoleResource from '../datamanager/RoleResource';

const environmentSymbol: any = Symbol.for('environment');

interface LiteRoleResource {
  roleID: string;
  name: string;
}

/**
 * LiteEntryResources are what the name suggests. They are lite entries. They only provide some
 * basic functionality useful for showing unresolved (read: not loaded nested) entries.
 *
 * @prop {String} accountID - The id of this dm account
 * @prop {String} email - The email of this dm account, undefined if anonymous
 */
class LiteRoleResource extends Resource {
  constructor(liteResource: any, environment: environment, traversal?: any) {
    if (!('_links' in liteResource)) {
      const qs = querystring.parse(liteResource.href.substr(liteResource.href.indexOf('?') + 1));
      liteResource = {
        roleID: qs.roleID,
        _links: {
          self: {
            profile: liteResource.profile,
            href: liteResource.href,
          },
        },
        name: liteResource.name || liteResource.title,
        dataManagerID: qs.dataManagerID,
      };
    }
    super(liteResource, environment, traversal);
    ['roleID', 'name'].forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => <string>this.getProperty(key),
      });
    });
    this.countProperties();
  }

  /**
   * In order to resolve this {@link LiteRoleResource} to a proper {@link RoleResource} call this
   * function. A promise is returned which resolves to the {@link RoleResource}.
   *
   * @returns {Promise<RoleResource>} Promise resolving to {@link RoleResource}.
   */
  resolve(): Promise<RoleResource> {
    const request = traverson.from(this.getLink('self').href).jsonHal();
    return get(this[environmentSymbol], request).then(
      ([res, traversal]) => new RoleResource(res, this[environmentSymbol], traversal),
    );
  }

  /**
   * Saves this {@link RoleResource}. Does not work on {@link LiteRoleResource}s. Those must be
   * resolved first.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<RoleResource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false, overwriteSchemaUrl: string): Promise<RoleResource> {
    if (!(this instanceof RoleResource)) {
      throw new Error('LiteRoleResource cannot be saved');
    }
    return <Promise<RoleResource>>super.save(safePut, overwriteSchemaUrl);
  }
}

export default LiteRoleResource;
