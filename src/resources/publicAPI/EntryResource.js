import halfred from 'halfred';
import validator from 'json-schema-remote';

import { fileNegotiate, getSchema } from '../../helper';
import Resource, { resourceSymbol } from '../Resource';
import PublicAssetResource from './PublicAssetResource';

const schemaSymbol = Symbol('_schema');
const shortIDSymbol = Symbol('_shortID');

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

function getFieldType(schema, property) {
  if (!property) {
    return undefined;
  }

  const prop = schema.allOf[1].properties[property];
  if (!prop) {
    return undefined;
  }

  const result = /^([^<>]+)(?:<[^>]*>)?$/.exec(prop.title);
  if (!result) {
    return undefined;
  }

  return result[1];
}

function getShortID(resource) {
  const link = resource.link('collection').href;
  const result = new RegExp(`/api/([0-9a-f]{8})/${resource._modelTitle}`).exec(link);
  return result[1];
}

/**
 * EntryResource class representing entries. Fields will have getter and setter. Setter will
 * validate the input on a best effort basis.
 *
 * If the schema for this Entry is not known on creating it, you will have to use
 * EntryResource#creatEntry.
 *
 * So called `nested Entries` will seamlessly integrate with EntryResources. When an entry is
 * loaded with level parameter set it will return EntryResources for alle entry/entries fields. You
 * don't need to do any other work except loading it leveled. For this to work properly the parent
 * EntryResource will need to be instantiated with EntryResource#createEntry, otherwise the
 * required JSON Schemas won't be stored in the cache.
 *
 * @example
 * publicAPI.getEntry('muffins', '1234567')
 * .then((muffin) => {
 *   show(muffin.title, muffin.deliciousness);
 * });
 *
 * @prop {string} id entry id (_id defined as well)
 * @prop {Date} created created date (_created defined as well)
 * @prop {Date} modified last modified date (_modified defined as well)
 * @prop {string} creator public user which created thie entry (_creator defined as well)
 *
 * @prop {Date|string} datetime fields with type datetime
 * @prop {EntryResource|object|string} entry fields with type entry
 * @prop {Array<EntryResource|object|string>} entries fields with type entries
 * @prop {AssetResource|object|string} asset fields with type asset
 * @prop {Array<AssetResource|object|string>} assets fields with type assets
 * @prop {DMAccountResource|object|string} account fields with type account
 * @prop {RoleResource|object|string} role fields with type role
 * @prop {string|object|array|number} other field with all other types
 */
export default class EntryResource extends Resource {
  /**
   * Creates a new EntryResource
   *
   * @param {object} resource loaded resource
   * @param {environment} environment the environment of this resource
   * @param {object} schema JSON Schema for this entry
   * @param {object?} traversal traversal for continuing
   */
  constructor(resource, environment, schema, traversal) {
    super(resource, environment, traversal);

    if (!schema) {
      throw new Error('schema must be defined');
    }

    this[schemaSymbol] = schema;
    this[shortIDSymbol] = getShortID(this[resourceSymbol]);

    Object.keys(this[schemaSymbol].allOf[1].properties).forEach((key) => {
      if (!skip.includes(key) && key in resource) {
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
          property.get = () => {
            const entry = this.getProperty(key);
            if (!entry) {
              return entry;
            }
            if (typeof entry === 'object' && !(entry instanceof EntryResource)) {
              let link = entry._links.self;
              if (Array.isArray(link)) {
                link = link[0];
              }
              const entrySchema = validator.getSchema(link.profile);
              this[resourceSymbol][key] = new EntryResource(entry, environment, entrySchema);
            }
            return this.getProperty(key);
          };
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (val instanceof EntryResource) {
              value = val.toOriginal();
            } else if (typeof val === 'object' && '_id' in val) {
              value = val;
            } else {
              throw new Error('only string and object/EntryResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'entries':
          property.get = () => {
            let entries = this.getProperty(key);
            if (!entries) {
              this.setProperty(key, []);
              entries = [];
            }
            this[resourceSymbol][key] = entries.map((entry) => {
              if (typeof entry === 'object') {
                if (entry instanceof EntryResource) {
                  return entry;
                }

                let link = entry._links.self;
                if (Array.isArray(link)) {
                  link = link[0];
                }
                const entrySchema = validator.getSchema(link.profile);
                return new EntryResource(entry, environment, entrySchema);
              }
              return entry;
            });
            return this.getProperty(key);
          };
          property.set = (val) => {
            if (!Array.isArray(val)) {
              throw new Error('only array supported as input type');
            }

            const value = val.map((v) => {
              if (typeof v === 'string') {
                return v;
              }
              if (v instanceof EntryResource) {
                return v.toOriginal();
              }
              if (typeof v === 'object' && '_id' in v) {
                return v;
              }
              throw new Error('only string and object/EntryResource supported as input type');
            });
            this.setProperty(key, value);
            return val;
          };
          break;
        case 'asset':
          property.get = () => {
            const asset = this.getProperty(key);
            if (!asset) {
              return asset;
            }
            if (typeof asset === 'object' && !(asset instanceof PublicAssetResource)) {
              this[resourceSymbol][key] = new PublicAssetResource(asset, environment);
            }

            return this.getProperty(key);
          };
          property.set = (val) => {
            let value;
            if (typeof val === 'string') {
              value = val;
            } else if (val instanceof PublicAssetResource) {
              value = val.toOriginal();
            } else if (typeof val === 'object' && 'assetID' in val) {
              value = val;
            } else {
              throw new Error('only string and object/AssetResource supported as input type');
            }

            this.setProperty(key, value);
            return val;
          };
          break;
        case 'assets':
          property.get = () => {
            let assets = this.getProperty(key);
            if (!assets) {
              this.setProperty(key, []);
              assets = [];
            }
            this[resourceSymbol][key] = assets.map((asset) => {
              if (typeof asset === 'object') {
                if (asset instanceof PublicAssetResource) {
                  return asset;
                }

                return new PublicAssetResource(asset, environment);
              }
              return asset;
            });
            return this.getProperty(key);
          };
          property.set = (val) => {
            if (!Array.isArray(val)) {
              throw new Error('only array supported as input type');
            }

            const value = val.map((v) => {
              if (typeof v === 'string') {
                return v;
              }
              if (v instanceof PublicAssetResource) {
                return v.toOriginal();
              }
              if (typeof v === 'object' && 'assetID' in v) {
                return v;
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
   * Saves this {@link EntryResource}.
   *
   * @returns {Promise<EntryResource>} Promise will resolve to the saved EntryResource. Will
   *   be the same object but with refreshed data.
   */
  save() {
    return super.save(`${this[resourceSymbol].link('self').profile}?template=put`);
  }

  /**
   * Get the field type for a given property in this {@link EntryResource}
   *
   * @param {string} property field name
   * @returns {string} type of the field
   */
  getFieldType(property) {
    return getFieldType(this[schemaSymbol], property);
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

  /**
   * Best file helper for embedded assets files.
   *
   * @param {string} field the asset field name
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getFileUrl(field, locale) {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => fileNegotiate(asset, false, false, null, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }

  /**
   * Best file helper for embedded assets images.
   *
   * @param {string} field the asset field name
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageUrl(field, size, locale) {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => fileNegotiate(asset, true, false, size, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }

  /**
   * Best file helper for embedded assets image thumbnails.
   *
   * @param {string} field the asset field name
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageThumbUrl(field, size, locale) {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => fileNegotiate(asset, true, true, size, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }
}

function loadSchemaForResource(resource) {
  const res = halfred.parse(resource);
  return getSchema(res.link('self').profile)
  .then(schema =>
    Object.keys(schema.allOf[1].properties).map((property) => {
      if (!skip.includes(property) && ['entry', 'entries'].includes(getFieldType(schema, property))) {
        const field = res[property];
        if (Array.isArray(field)) {
          return field[0] && typeof field[0] === 'object' ? field : undefined;
        } else if (typeof field === 'object') {
          return field;
        }
      }
    })
    .reduce((r, p) => r.concat(p), [])
    .filter(x => !!x) // filter undefined
    .filter((x, i, a) => a.findIndex(t => t.id === x.id) === i) // filter duplicates
    .map(r => () => loadSchemaForResource(r)) // eslint-disable-line comma-dangle
    .reduce((r, p) => r.then(p), Promise.resolve())
    .then(() => schema)
  );
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
export function createEntry(resource, environment, traversal) {
  return Promise.resolve()
  .then(() => loadSchemaForResource(resource))
  .then(schema => new EntryResource(resource, environment, schema, traversal));
}
