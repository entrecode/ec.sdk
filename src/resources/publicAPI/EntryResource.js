import halfred from 'halfred';

import { getSchema } from '../../helper';
import Resource from '../Resource';

const schemaSymbol = Symbol('_schema');

const datetimeRegex = /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?(?:Z|[+-][01]\d:[0-5]\d)$/;

const skip = [
  'id',
  'created',
  'modified',
  'creator',
  'private',
  '_links',
  '_embedded',
  '_entryTitle',
  '_modelTitle',
  '_modelTitleField',
];
const underscore = [
  '_id',
  '_created',
  '_modified',
  '_creator',
];

/**
 * EntryResource class representing entries. Fields will have getter and setter.
 *
 * @example
 * publicAPI.getEntry('muffins', '1234567')
 * .then((muffin) => {
 *   show(muffin.title, muffin.deliciousness);
 * });
 *
 * @param {string} id entry id (_id defined as well)
 * @param {Date} created created date (_created defined as well)
 * @param {Date} modified last modified date (_modified defined as well)
 * @param {string} creator public user which created thie entry (_creator defined as well)
 *
 * @param {Date|string} datetime-fields fields with type datetime
 * @param {EntryResource|object|string} entry-fields fields with type entry
 * @param {Array<EntryResource|object|string>} entries-fields fields with type entries
 * @param {AssetResource|object|string} asset-fields fields with type asset
 * @param {Array<AssetResource|object|string>} assets-fields fields with type assets
 * @param {DMAccountResource|object|string} account-fields fields with type account
 * @param {RoleResource|object|string} role-fields fields with type role
 * @param {string|object|array|number} other-fields field with all other types
 */
export default class EntryResource extends Resource {
  /**
   * Creates a new EntryResource
   * @param {object} resource loaded resource
   * @param {environment} environment the environment of this resource
   * @param {object|undefined} traversal traversal for continuing
   * @param {object} schema JSON Schema for this entry
   */
  constructor(resource, environment, traversal, schema) {
    super(resource, environment, traversal);

    if (!schema) {
      throw new Error('schema must be defined');
    }

    this[schemaSymbol] = schema;

    Object.keys(this[schemaSymbol].allOf[1].properties).forEach((key) => {
      if (!skip.includes(key)) {
        const type = this.getFieldType(key);
        const property = {
          enumerable: true,
        };

        switch (type) {
        case 'datetime':
          property.get = () => new Date(this.getProperty(key));
          property.set = (val) => {
            let v;
            if (val instanceof Date) {
              v = val.toISOString();
            } else if (typeof val === 'string' && datetimeRegex.test(val)) {
              v = val;
            } else {
              throw new Error('input must be a Date or date string');
            }

            this.setProperty(key, v);
            return val;
          };
          break;
        case 'entry':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (typeof val === 'object' && '_id' in val) {
              value = val._id;
            } else {
              throw new Error('only string and object/EntryResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'entries':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            if (!Array.isArray(val)) {
              throw new Error('only array supported as input type');
            }

            const value = val.map((v) => {
              if (typeof v === 'string') {
                return v;
              }
              if (typeof v === 'object' && '_id' in v) {
                return v._id;
              }
              throw new Error('only string and object/EntryResource supported as input type');
            });

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'asset':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (typeof val === 'object' && 'assetID' in val) {
              value = val.assetID;
            } else {
              throw new Error('only string and object/AssetResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'assets':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            if (!Array.isArray(val)) {
              throw new Error('only array supported as input type');
            }

            const value = val.map((v) => {
              if (typeof v === 'string') {
                return v;
              }
              if (typeof v === 'object' && 'assetID' in v) {
                return v.assetID;
              }
              throw new Error('only string and object/AssetResource supported as input type');
            });

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'account':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (typeof val === 'object' && 'accountID' in val) {
              value = val.accountID;
            } else {
              throw new Error('only string and object/DMAccountResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'role':
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (typeof val === 'object' && 'roleID' in val) {
              value = val.roleID;
            } else {
              throw new Error('only string and object/RoleResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        default:
          property.get = () => this.getProperty(key);
          property.set = (val) => {
            this.setProperty(key, val);
            return val;
          };
          break;
        }

        Object.defineProperty(this, key, property);
        if (underscore.includes(key)) {
          Object.defineProperty(this, key.slice(1), property);
        }
      }
    });
  }

  /**
   * Get the field type for a given property in this {@link EntryResource}
   *
   * @param {string} property field name
   * @returns {string} type of the field
   */
  getFieldType(property) {
    if (!property) {
      return undefined;
    }

    const prop = this[schemaSymbol].allOf[1].properties[property];
    if (!prop) {
      return undefined;
    }

    const result = /^([^<>]+)(?:<[^>]*>)?$/.exec(prop.title);
    if (!result) {
      return undefined;
    }

    return result[1];
  }

  /**
   * Get the title of this {@link EntryResource}.
   *
   * @returns {string} title of this entry
   */
  getTitle() {
    return this.getProperty('_entryTitle');
  }

  /**
   * Get the title of this {@link EntryResource}'s model.
   *
   * @returns {string} title of the entry's model
   */
  getModelTitle() {
    return this.getProperty('_modelTitle');
  }

  /**
   * Get the title field of this {@link EntryResource}'s model.
   *
   * @returns {string} title field of this entry's model
   */
  getModelTitleField() {
    return this.getProperty('_modelTitleField');
  }

  // TODO file stuff (file, image, thumb, original)
}

/**
 * Asynchronously create a new {@link EntryResource}. This can be used when the schema is not known
 * before creating the EntryResource.
 *
 * @param {object} resource loaded resource
 * @param {environment} environment the environment of this resource
 * @param {object?} traversal traversal for continuing
 * @returns {Promise<EntryResource>} {@link Promise} resolving to the newly created {@link
 *   EntryResource}
 */
export function create(resource, environment, traversal) {
  return Promise.resolve()
  .then(() => {
    const res = halfred.parse(resource);
    return getSchema(res.link('self').profile);
  })
  .then(schema => new EntryResource(resource, environment, traversal, schema));
}
