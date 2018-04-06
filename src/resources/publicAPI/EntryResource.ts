import * as halfred from 'halfred';
import * as validator from 'json-schema-remote';

import LiteEntryResource from './LiteEntryResource';
import PublicAssetResource from './PublicAssetResource';
import { fileNegotiate, getSchema, optionsToQuery, getHistory } from '../../helper';
import { environment } from '../../Core';
import DMAssetResource from './DMAssetResource';
import { filterOptions } from '../ListResource';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');

validator.setLoggingFunction(() => {
});

const resourcePropertiesSymbol = Symbol.for('resourceProperties');
const schemaSymbol = Symbol('_schema');
const shortIDSymbol = Symbol('_shortID');

const datetimeRegex = /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?(?:Z|[+-][01]\d:[0-5]\d)$/;

const skip = [
  'id',
  '_id',
  '_entryTitle',
  '_modelTitle',
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

function loadSchemaForResource(resource: any): any {
  const res = halfred.parse(resource);
  return getSchema(res.link('self').profile)
    .then(schema =>
      Object.keys(schema.allOf[1].properties).map((property) => {
        if (['entry', 'entries'].indexOf(getFieldType(schema, property)) !== -1
        ) {
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

function negotiater(asset, image, thumb, size, locale) {
  if (!/^[a-zA-Z0-9\-_]{22}$/.test(asset.assetID)) {
    return fileNegotiate(asset, image, thumb, size, locale);
  }

  if (!image || (!size && !thumb)) {
    return asset.file.url;
  }

  let file;
  if (thumb) {
    file = asset.thumbnails.find(t => t.dimension === size);
    if (!file) {
      file = asset.thumbnails[0];
    }
  } else {
    file = asset.fileVariants.find(v => Math.max(v.resolution.width, v.resolution.height) === size);
  }
  if (file) {
    return file.url;
  }

  return undefined;
}

interface EntryResource {
  _created: Date;
  _creator: string;
  _embedded: any;
  _links: any;
  _modelTitle: string;
  _modelTitleField: string;
  _modified: Date;
  created: Date;
  modified: Date;

  [key: string]: any;
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
 * publicAPI.entry('muffins', '1234567')
 * .then((muffin) => {
 *   show(muffin.title, muffin.deliciousness);
 * });
 *
 * @prop {string} id entry id (_id defined as well)
 * @prop {Date} created created date (_created defined as well)
 * @prop {Date} modified last modified date (_modified defined as well)
 * @prop {string} creator public user which created thie entry (_creator defined as well)
 * @prop {string} _entryTitle the title of this entry
 *
 * @prop {Date|string} datetime fields with type datetime
 * @prop {EntryResource|LiteEntryResource} entry fields with type entry
 * @prop {Array<EntryResource|LiteEntryResource>} entries fields with type entries
 * @prop {AssetResource} asset fields with type asset
 * @prop {Array<AssetResource>} assets fields with type assets
 * @prop {DMAccountResource|object|string} account fields with type account
 * @prop {RoleResource|object|string} role fields with type role
 * @prop {string|object|array|number} other field with all other types
 */
class EntryResource extends LiteEntryResource {
  /**
   * Creates a new EntryResource
   *
   * @param {object} resource loaded resource
   * @param {environment} environment the environment of this resource
   * @param {object} schema JSON Schema for this entry
   * @param {object?} traversal traversal for continuing
   */
  constructor(resource: any, environment: environment, schema: any, traversal?: any) {
    super(resource, environment, traversal);

    if (!schema) {
      throw new Error('schema must be defined');
    }

    this[schemaSymbol] = schema;
    this[shortIDSymbol] = getShortID(this[resourceSymbol]);
    Object.keys(this[schemaSymbol].allOf[1].properties).forEach((key) => {
      if (skip.indexOf(key) === -1) {
        const type = this.getFieldType(key);
        const property: any = {
          enumerable: true,
        };

        switch (type) {
          case 'datetime':
            property.get = () => {
              const val = this.getProperty(key);
              if (val === undefined || val === null) {
                return val;
              }
              return new Date(val);
            };
            property.set = (val) => {
              let v;
              if (val instanceof Date) {
                v = val.toISOString();
              } else if (val === null || (typeof val === 'string' && datetimeRegex.test(val))) {
                v = val;
              } else {
                throw new Error('input must be a Date, date string or null');
              }

              this.setProperty(key, v);
            };
            break;
          case 'entry':
            property.get = () => {
              const entry = this.getProperty(key);
              if (!entry) {
                return entry;
              }
              if (typeof entry === 'object'
                && !(entry instanceof EntryResource)
                && !(entry instanceof LiteEntryResource)) {
                // if it is an object but not one of the Resource types it was loaded nested
                // so convert to EntryResource
                let link = entry._links.self;
                if (Array.isArray(link)) {
                  link = link[0];
                }
                const entrySchema = validator.getSchema(link.profile);
                this[resourceSymbol][key] = new EntryResource(entry, environment, entrySchema);
              } else if (typeof entry === 'object' && (
                entry instanceof LiteEntryResource || entry instanceof EntryResource
              )) {
                // if it is an object and of type LiteEntryResource its one of the resource types
                // so just return it
                return entry;
              } else {
                // if it is none of the above we convert it to LiteEntryResouce
                const liteResource = this.getLink(`${this[shortIDSymbol]}:${this.getModelTitle()}/${key}`);
                if (liteResource) {
                  this[resourceSymbol][key] = new LiteEntryResource(liteResource, this[environmentSymbol]);
                }
              }

              return this.getProperty(key);
            };
            property.set = (val) => {
              let value;
              if (val === null || typeof val === 'string') {
                value = val;
              } else if (val instanceof EntryResource) {
                value = val.toOriginal();
              } else if (typeof val === 'object' && '_id' in val) {
                // this handles generic objects and LiteEntryResources
                value = val;
              } else {
                throw new Error('input must be a String, object/[Lite]EntryResource or null');
              }

              this.setProperty(key, value);
            };
            break;
          case 'entries':
            property.get = () => {
              const entries = this.getProperty(key) || [];
              this[resourceSymbol][key] = entries.map((entry) => {
                if (typeof entry === 'object') {
                  if (entry instanceof EntryResource
                    || entry instanceof LiteEntryResource) {
                    return entry;
                  }

                  let link = entry._links.self;
                  if (Array.isArray(link)) {
                    link = link[0];
                  }
                  const entrySchema = validator.getSchema(link.profile);
                  return new EntryResource(entry, environment, entrySchema);
                } else {
                  const links = this.getLinks(`${this[shortIDSymbol]}:${this.getModelTitle()}/${key}`);
                  if (links) {
                    const link = links.find((link: any) => link.href.indexOf(entry) !== -1);
                    if (link) {
                      return new LiteEntryResource(link, this[environmentSymbol]);
                    }
                  }
                  return entry;
                }
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
                  // this handles generic objects and LiteEntryResources

                  return v;
                }
                throw new Error('only string and object/[Lite]EntryResource supported as input type');
              });
              this.setProperty(key, value);
            };
            break;
          case 'asset':
            property.get = () => {
              const asset = this.getProperty(key);
              if (!asset) {
                return asset;
              }
              if (typeof asset === 'object' && !(asset instanceof PublicAssetResource || asset instanceof DMAssetResource)) {
                if (/^[a-zA-Z0-9\-_]{22}$/.test(asset.assetID)) {
                  this[resourceSymbol][key] = new DMAssetResource(asset, environment);
                } else {
                  this[resourceSymbol][key] = new PublicAssetResource(asset, environment);
                }
                this[resourceSymbol][key] = new PublicAssetResource(asset, environment);
              } else if (typeof asset !== 'object') {
                const embedded = this[resourceSymbol].embeddedResource(`${this[shortIDSymbol]}:${this.getModelTitle()}/${key}/asset`);
                if (embedded) {
                  if (/^[a-zA-Z0-9\-_]{22}$/.test(embedded.assetID)) {
                    this[resourceSymbol][key] = new DMAssetResource(embedded, environment);
                  } else {
                    this[resourceSymbol][key] = new PublicAssetResource(embedded, environment);
                  }
                }
              }

              return this.getProperty(key);
            };
            property.set = (val) => {
              let value;
              if (val === null || typeof val === 'string') {
                value = val;
              } else if (val instanceof PublicAssetResource || val instanceof DMAssetResource) {
                value = val.toOriginal();
              } else if (typeof val === 'object' && 'assetID' in val) {
                value = val;
              } else {
                throw new Error('only string, object/AssetResource/DMAssetResource, and null supported as input type');
              }

              this.setProperty(key, value);
            };
            break;
          case 'assets':
            property.get = () => {
              const assets = this.getProperty(key) || [];
              this[resourceSymbol][key] = assets.map((asset) => {
                if (typeof asset === 'object') {
                  if (asset instanceof PublicAssetResource || asset instanceof DMAssetResource) {
                    return asset;
                  }

                  if (/^[a-zA-Z0-9\-_]{22}$/.test(asset.assetID)) {
                    return new DMAssetResource(asset, environment);
                  }

                  return new PublicAssetResource(asset, environment);
                } else {
                  const embeds = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${key}/asset`);
                  if (embeds) {
                    const embed = embeds.find(embed => embed.assetID === asset);
                    if (embed) {
                      if (/^[a-zA-Z0-9\-_]{22}$/.test(embed.assetID)) {
                        return new DMAssetResource(embed, environment);
                      }
                      return new PublicAssetResource(embed, environment);
                    }
                  }
                  return asset;
                }
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
                if (v instanceof PublicAssetResource || v instanceof DMAssetResource) {
                  return v.toOriginal();
                }
                if (typeof v === 'object' && 'assetID' in v) {
                  return v;
                }
                throw new Error('only string and object/AssetResource/DMAssetResource supported as input type');
              });

              this.setProperty(key, value);
            };
            break;
          case 'account':
            property.get = () => this.getProperty(key);
            property.set = (val) => {
              let value;
              if (val === null || typeof val === 'string') {
                value = val;
              } else if (typeof val === 'object' && 'accountID' in val) {
                value = val.accountID;
              } else {
                throw new Error('only string, object/DMAccountResource, and null supported as input type');
              }

              this.setProperty(key, value);
            };
            break;
          case 'role':
            property.get = () => this.getProperty(key);
            property.set = (val) => {
              let value;
              if (val === null || typeof val === 'string') {
                value = val;
              } else if (typeof val === 'object' && 'roleID' in val) {
                value = val.roleID;
              } else {
                throw new Error('only string, object/RoleResource, and null supported as input type');
              }

              this.setProperty(key, value);
            };
            break;
          default:
            property.get = () => this.getProperty(key);
            property.set = (val) => {
              this.setProperty(key, val);
            };
            break;
        }

        Object.defineProperty(this, key, property);
      }
    });
    this.countProperties();
  }

  /**
   * Get the field type for a given property in this {@link EntryResource}
   *
   * @param {string} field field name
   * @returns {string} type of the field
   */
  getFieldType(field: string): string {
    return getFieldType(this[schemaSymbol], field);
  }

  /**
   * Best file helper for embedded assets files. For AssetsNeue it will only negotiate with already rendered file variants.
   *
   * @param {string} field the asset field name
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getFileUrl(field: string, locale: string): string | Array<string> {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => negotiater(asset, false, false, null, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }

  /**
   * Best file helper for embedded assets image thumbnails. For AssetsNeue it will only negotiate with already rendered file variants.
   *
   * @param {string} field the asset field name
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageThumbUrl(field: string, size: number, locale: string): string | Array<string> {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => negotiater(asset, true, true, size, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }

  /**
   * Best file helper for embedded assets images. For AssetsNeue it will only negotiate with already rendered file variants.
   *
   * @param {string} field the asset field name
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageUrl(field: string, size: number, locale: string): string | Array<string> {
    const assets = this[resourceSymbol].embeddedArray(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}/asset`);
    const isAssets = this.getFieldType(field) === 'assets';

    if (!assets) {
      if (isAssets) {
        return [];
      }
      return undefined;
    }

    const results = assets.map(asset => negotiater(asset, true, false, size, locale));

    if (!isAssets) {
      return results[0];
    }
    return results;
  }

  /**
   * Get the number of levels this entry was loaded with.
   *
   * @returns {number} Number of levels (1-5)
   */
  getLevelCount(): number {
    let link = this.getLink('self').href;

    if (link.indexOf('_levels') === -1) {
      return 1;
    }

    return Number.parseInt(link.substr(link.indexOf('_levels') + '_levels'.length + 1))
  }

  /**
   * Get the title of this {@link EntryResource}'s model.
   *
   * @returns {string} title of the entry's model
   */
  getModelTitle(): string {
    return <string>this.getProperty('_modelTitle');
  }

  /**
   * Get the title field of this {@link EntryResource}'s model.
   *
   * @returns {string} title field of this entry's model
   */
  getModelTitleField() {
    return <string>this.getProperty('_modelTitleField');
  }

  /**
   * Get the title from this {@link EntryResource}. Either the entryTitle when no field value is
   * provided. When one is provided the title of the nested element is returned.
   *
   * @prop {string?} field - The field name from which the title should be loaded. Undefined for
   *   the entry title.
   * @returns {string} title The title of either the element or the entry.
   */
  getTitle(field: string): string | Array<string> {
    if (!field) {
      return <string>this.getProperty('_entryTitle');
    }

    const links = this.getLinks(`${this[shortIDSymbol]}:${this.getModelTitle()}/${field}`);

    if (!links) {
      return undefined;
    }

    if (['entries', 'assets'].indexOf(this.getFieldType(field)) !== -1) {
      return links.map(l => l.title);
    }

    return links[0].title;
  }

  /**
   * Creates a new History EventSource with the given filter options.
   *
   * @param {filterOptions | any} options The filter options
   * @return {Promise<EventSource>} The created EventSource.
   */
  newHistory(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.newRequest().follow('ec:model/dm-entryHistory'))
      .then(request => {
        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return getHistory(this[environmentSymbol], request)
      });
  }

  /**
   * Saves this {@link EntryResource}.
   *
   * @returns {Promise<EntryResource>} Promise will resolve to the saved EntryResource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false): Promise<EntryResource> {
    return <Promise<EntryResource>>super.save(safePut, `${this.getLink('self').profile}?template=put`);
  }

  /**
   * Validates a field of this {@link EntryResource} against its schema.
   *
   * @returns {Promise<boolean>} Promise will resolve true when Resource is valid, rejects
   *   otherwise.
   */
  validateField(field: string): Promise<boolean> {
    return Promise.resolve()
      .then(() => {
        const schema = this[schemaSymbol].allOf[1].properties[field];
        return validator.validate(this[field], schema);
      });
  }

  toOriginal(): any {
    const out = {};

    const keys = Object.keys(this);
    if (this[resourcePropertiesSymbol].length !== keys.length) {
      throw new Error(`Additional properties found: ${keys.filter(k => !this[resourcePropertiesSymbol].includes(k)).join(', ')}`);
    }
    Object.keys(this[resourceSymbol].original()).forEach((key) => {
      const type = this.getFieldType(key);
      const val = this[resourceSymbol][key];
      switch (type) {
        case 'entry':
          if (val instanceof EntryResource) {
            out[key] = val.toOriginal();
          } else if (val instanceof LiteEntryResource) {
            out[key] = val._id;
          } else {
            out[key] = val;
          }
          break;
        case 'entries':
          out[key] = val.map((v) => {
            if (v instanceof EntryResource) {
              return v.toOriginal();
            } else if (v instanceof LiteEntryResource) {
              return v._id;
            } else {
              return v;
            }
          });
          break;
        case 'asset':
          const original = this[resourceSymbol].original();
          if (typeof val === 'string') {
            out[key] = val;
          } else if (!original[key] || typeof original[key] === 'string') {
            out[key] = val.assetID;
          } else {
            out[key] = val;
          }
          break;
        case 'assets':
          out[key] = val.map((v, i) => {
            const original = this[resourceSymbol].original();
            if (typeof v === 'string') {
              return v;
            } else if (!original[key][i] || typeof original[key][i] === 'string') {
              return v.assetID;
            } else {
              return v;
            }
          });
          break;
        default:
          out[key] = val;
          break;
      }
    });
    return out;
  }
}

export default EntryResource;

/**
 * Asynchronously create a new {@link EntryResource}. This can be used when the schema is not known
 * before creating the EntryResource.
 *
 * @private
 *
 * @param {object} resource loaded resource
 * @param {environment} environment the environment of this resource
 * @param {object?} traversal traversal for continuing
 * @returns {Promise<EntryResource>} {@link Promise} resolving to the newly created {@link
  *   EntryResource}
 */
export function createEntry(resource: any, environment: environment, traversal?: any): Promise<EntryResource> {
  return Promise.resolve()
    .then(() => loadSchemaForResource(resource))
    .then(schema => new EntryResource(resource, environment, schema, traversal));
}
