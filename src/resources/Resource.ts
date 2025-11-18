import 'es6-symbol/implement';
import * as HalAdapter from 'traverson-hal';
import * as halfred from 'halfred';
import * as traverson from 'traverson';
import * as validator from 'json-schema-remote';
import * as equal from 'deep-equal';
import { convertValidationError } from 'ec.errors';

import type ListResource from './ListResource';
import { FilterOptions } from './FilterOptions';
// eslint-disable-next-line import/no-cycle
import { del, get, optionsToQuery, post, put, locale } from '../helper';
import Problem from '../Problem';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');
const traversalSymbol: any = Symbol.for('traversal');
const resourcePropertiesSymbol: any = Symbol.for('resourceProperties');
const relationsSymbol: any = Symbol.for('relations');
const originalSymbol: any = Symbol.for('original');

traverson.registerMediaType(HalAdapter.mediaType, HalAdapter);
validator.setLoggingFunction(() => {});

interface Resource {
  [key: string]: any;
}

/**
 * Generic resource class. Represents {@link https://tools.ietf.org/html/draft-kelly-json-hal-08
 * HAL resources}.
 *
 * @class
 * @access protected
 *
 * @prop {boolean}  isDirty   - Whether or not this Resource was modified
 */
class Resource {
  /**
   * Creates a new {@link Resource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment = 'live', traversal, name?: string, schema?: any) {
    this[environmentSymbol] = environment;
    let r;
    if (resource instanceof halfred['Resource']) {
      r = resource.original();
    } else {
      r = resource;
    }
    this[originalSymbol] = JSON.parse(JSON.stringify(r));
    this[resourceSymbol] = halfred.parse(JSON.parse(JSON.stringify(r)));

    if (typeof this[environmentSymbol] !== 'string') {
      throw new Error('environment must be a string');
    }

    if (traversal) {
      this[traversalSymbol] = traversal;
    } else {
      this[traversalSymbol] = traverson.from(this.getLink('self').href).jsonHal();
    }

    Object.defineProperties(this, {
      isDirty: {
        enumerable: false,
        get: () => {
          const original = this[originalSymbol];
          const current = this.toOriginal();
          delete original._links;
          delete current._links;
          delete original._embedded;
          delete current._embedded;
          return !equal(current, original);
        },
      },
    });

    this[relationsSymbol] = {};
    this.countProperties();
  }

  /**
   * Returns a collection of available relations in this Resource.
   *
   * @return {object} Collection of available relations
   */
  getAvailableRelations(): any {
    const out = {};
    Object.keys(this[relationsSymbol]).forEach((rel) => {
      out[rel] = {
        id: this[relationsSymbol][rel].id,
        createable: !!this[relationsSymbol][rel].createRelation,
      };
    });
    return out;
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} of this
   * resource.
   *
   * @returns {object} object which has an array for each link.
   */
  allLinks(): { [key: string]: Array<any> } {
    return this[resourceSymbol].allLinks();
  }

  countProperties(): void {
    this[resourcePropertiesSymbol] = Object.keys(this);
  }

  /**
   * Create a new Resource. Note: Not all relations will support this.
   *
   * @example
   * return accounts.create('client', {
   *   clientID: 'myClient',
   *   callbackURL: 'https://example.com/login',
   *   config: {
   *     tokenMethod: 'query',
   *   },
   * })
   * .then(client => show(client));
   *
   * @param {string} relation The shortened relation name
   * @param {object} resource object representing the resource
   * @returns {Promise<Resource>} the newly created Resource
   */
  create(relation: string, resource: any, returnList: boolean = false): Promise<Resource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }
        if (!this[relationsSymbol][relation].createRelation) {
          throw new Error('Resource has no createRelation');
        }
        if (!resource) {
          throw new Error('Cannot create resource with undefined object.');
        }
        if (this[relationsSymbol][relation].createTransform) {
          resource = this[relationsSymbol][relation].createTransform(resource);
        }
        return this.getLink(this[relationsSymbol][relation].createRelation);
      })
      .then((link) =>
        validator
          .validate(resource, `${link.profile}${this[relationsSymbol][relation].createTemplateModifier}`)
          .catch((e) => {
            throw new Problem(convertValidationError(e), locale);
          }),
      )
      .then(() => this.newRequest().follow(this[relationsSymbol][relation].relation))
      .then((request) => {
        if (this[relationsSymbol][relation].additionalTemplateParam) {
          request.withTemplateParameters(
            optionsToQuery({
              [this[relationsSymbol][relation].additionalTemplateParam]:
                this[this[relationsSymbol][relation].additionalTemplateParam],
            }),
          );
        }
        return post(this[environmentSymbol], request, resource);
      })
      .then(([c, traversal]) => {
        let ResourceConstructor;
        if (returnList || this[relationsSymbol][relation].returnList) {
          ResourceConstructor = this[relationsSymbol][relation].ListClass;
        } else {
          ResourceConstructor = this[relationsSymbol][relation].ResourceClass;
        }
        return <Resource>new ResourceConstructor(c, this[environmentSymbol], traversal);
      });
  }

  /**
   * Deletes this {@link Resource}.
   *
   * @returns {Promise<undefined>} Promise will resolve on success and reject otherwise.
   */
  del(): Promise<void> {
    return del(this[environmentSymbol], this.newRequest().follow('self'));
  }

  /**
   * alias for Resource#del()
   */
  delete(): Promise<void> {
    return this.del();
  }

  /**
   * Loads the given {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} and
   * returns a {@link Resource} with the loaded result.
   *
   * @param {string} link the link name.
   * @param {ResourceClass} ResourceClass override the default resource class ({@link Resource}).
   * @param {string?} name the name of the embedded resources
   * @param {object?} schema schema for {@link EntryResource}s
   * @returns {Promise<Resource|ResourceClass>} the resource identified by the link.
   */
  followLink(link: string, ResourceClass = Resource, name?: string, schema?: any): Promise<Resource> {
    return get(this[environmentSymbol], this.newRequest().follow(link)).then(([res, traversal]) => {
      return new ResourceClass(res, this[environmentSymbol], traversal, name, schema);
    });
  }

  /**
   * Returns an object with selected properties of the {@link Resource}. Will return all properties
   * when properties array is empty or undefined.
   *
   * @param {array<string>} properties array of properties to select.
   * @returns {object} object containing selected properties.
   */
  getAll(properties: Array<string>): any {
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return Object.assign({}, this[resourceSymbol]);
    }
    const out = {};
    properties.forEach((property) => {
      out[property] = this.getProperty(property);
    });
    return out;
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 link} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {object|null} the link with the given name or null.
   */
  getLink(link: string): any {
    return this[resourceSymbol].link(link);
  }

  /**
   * Get all {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5 links} with
   * the given name.
   *
   * @param {string} link the link name.
   * @returns {Array<object>|null} the link with the given name or null.
   */
  getLinks(link: string): Array<any> {
    return this[resourceSymbol].linkArray(link);
  }

  /**
   * Will return a single selected property identified by property.
   *
   * @param {string} property the selected property name.
   * @returns {*} the property which was selected.
   */
  getProperty(property: string): any {
    if (!property) {
      throw new Error('Property name cannot be undefined');
    }

    return this[resourceSymbol][property];
  }

  /**
   * Checks if this {@link Resource} has at least one {@link
   * https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5
   * link}  with the given name.
   *
   * @param {string} link the link name.
   * @returns {boolean} whether or not a link with the given name was found.
   */
  hasLink(link) {
    return this[resourceSymbol].link(link) !== null;
  }

  /**
   * Returns a traverson request builder following the provided link.
   *
   * @param {string} link The link to follow
   * @param {object?} templateParams Optional template params for start url
   * @returns {Promise<any>} Promise resolving to traverson request builder
   */
  async follow(link: string, templateParams?: any) {
    let req;
    if (typeof this[traversalSymbol].continue !== 'function' && this.hasLink(link)) {
      req = traverson.from(this.getLink(link).href).jsonHal();
    } else {
      req = this.newRequest().follow(link);
    }
    if (templateParams) {
      req.withTemplateParameters(templateParams);
    }
    return req;
  }

  /**
   * Creates a new {@link
   * https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder
   * traverson request builder}
   *  which can be used for a new request to the API.
   *
   * @access private
   *
   * @returns {Object} traverson request builder instance.
   */
  newRequest(): any {
    if (typeof this[traversalSymbol].continue === 'function') {
      return this[traversalSymbol].continue().newRequest();
    }
    return this[traversalSymbol].newRequest();
  }

  /**
   * @private
   *
   * @typedef {function} ResourceClass
   * @constructor
   */

  /**
   * Reset this {@link Resource} to its initial state. {@link Resource#isDirty} will be false
   * afterwards.
   *
   * @returns {undefined}
   */
  reset(): void {
    this[resourceSymbol] = halfred.parse(this[originalSymbol]);
  }

  /**
   * Reloads this {@link Resource}. Can be used when this resource was loaded from any {@link
   * ListResource} from _embedded.
   *
   * @returns {Promise<Resource>} this resource
   */
  resolve(): Promise<Resource> {
    return get(this[environmentSymbol], this.newRequest().follow('self')).then(([res, traversal]) => {
      this[resourceSymbol] = halfred.parse(res);
      this[originalSymbol] = JSON.parse(JSON.stringify(res));
      this[traversalSymbol] = traversal;
      return this;
    });
  }

  /**
   * Get a list of all avaliable filter options for a given relation.
   *
   * @param {string} relation The shortened relation name
   * @returns {Promise<Array<string>>} resolves to an array of avaliable filter options (query string notation).
   */
  getFilterOptions(relation: string): Promise<any> {
    return Promise.resolve().then(() => {
      if (!relation) {
        throw new Error('relation must be defined');
      }
      if (!this[relationsSymbol][relation]) {
        throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
      }
      let link = this.getLink(this[relationsSymbol][relation].relation);
      const matchResults = link.href.match(/{[^}]*}/g);
      if (matchResults) {
        return matchResults
          .map((result) => {
            const res = /^{[?&]([^}]+)}$/.exec(result);
            if (res) {
              return res[1].split(',');
            }
            return [];
          })
          .reduce((a, b) => a.concat(b), []);
      }
    });
  }

  /**
   * Get a single {@link Resource} identified by resourceID.
   *
   * @example
   * return accounts.resource('account', me.accountID)
   * .then(account => show(account.email));
   *
   * @param {string} relation The shortened relation name
   * @param {string} resourceID id of the Resource
   * @returns {Promise<Resource>} resolves to the Resource which should be loaded
   */
  resource(relation: string, resourceID, additionalTemplateParams: any = {}): Promise<Resource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }
        if (!resourceID) {
          throw new Error('resourceID must be defined');
        }

        return this.newRequest().follow(this[relationsSymbol][relation].relation);
      })
      .then((request) => {
        if (
          this[relationsSymbol][relation].additionalTemplateParam &&
          !(this[relationsSymbol][relation].additionalTemplateParam in additionalTemplateParams)
        ) {
          additionalTemplateParams[this[relationsSymbol][relation].additionalTemplateParam] =
            this[this[relationsSymbol][relation].additionalTemplateParam];
        }
        const params = Object.assign({}, additionalTemplateParams, {
          [this[relationsSymbol][relation].id]: resourceID,
        });
        request.withTemplateParameters(params);
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => {
        if (this[relationsSymbol][relation].resourceFunction) {
          return this[relationsSymbol][relation].resourceFunction(res, this[environmentSymbol], traversal);
        }

        if (this[relationsSymbol][relation].singleIsList) {
          return new this[relationsSymbol][relation].ListClass(res, this[environmentSymbol], traversal).getFirstItem();
        }

        return new this[relationsSymbol][relation].ResourceClass(res, this[environmentSymbol], traversal);
      });
  }

  /**
   * Load a {@link ListResource} of {@link Resource}s filtered by the values specified by the
   * options parameter.
   *
   * @example
   * return accounts.resourceList('account', {
   *   filter: {
   *     created: {
   *       from: new Date(new Date.getTime() - 600000).toISOString()),
   *     },
   *   },
   * })
   * .then(list => show(list))
   *
   * @param {string} relation The shortened relation name
   * @param {filterOptions?} options the filter options
   * @param {object} additionalTemplateParams additional template parameters to apply
   * @returns {Promise<ListResource>} resolves to resource list with applied filters
   */
  resourceList(
    relation: string,
    options: FilterOptions | any = {},
    additionalTemplateParams: any = {},
  ): Promise<ListResource> {
    return Promise.resolve()
      .then(() => {
        if (!relation) {
          throw new Error('relation must be defined');
        }
        if (!this[relationsSymbol][relation]) {
          throw new Error(`unknown relation, use one of ${Object.keys(this[relationsSymbol]).join(', ')}`);
        }

        const id = this[relationsSymbol][relation].id;
        if (
          options &&
          Object.keys(options).length === 1 &&
          id in options &&
          (typeof options[id] === 'string' || 'exact' in options[id])
        ) {
          throw new Error('Providing only an id in ResourceList filter will result in single resource response.');
        }

        if (options && '_levels' in options) {
          throw new Error('_levels on list resources not supported');
        }

        if (!options) {
          options = {};
        }

        if (!this[relationsSymbol][relation].doNotSendList) {
          options._list = true;
        }

        return this.newRequest().follow(this[relationsSymbol][relation].relation);
      })
      .then((request) => {
        if (
          this[relationsSymbol][relation].additionalTemplateParam &&
          !(this[relationsSymbol][relation].additionalTemplateParam in additionalTemplateParams)
        ) {
          additionalTemplateParams[this[relationsSymbol][relation].additionalTemplateParam] =
            this[this[relationsSymbol][relation].additionalTemplateParam];
        }
        const params = Object.assign({}, additionalTemplateParams, options);
        request.withTemplateParameters(
          optionsToQuery(params, this.getLink(this[relationsSymbol][relation].relation).href),
        );
        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => {
        if (this[relationsSymbol][relation].listFunction) {
          return this[relationsSymbol][relation].listFunction(res, this[environmentSymbol], traversal);
        }

        return new this[relationsSymbol][relation].ListClass(res, this[environmentSymbol], traversal);
      });
  }

  /**
   * Saves this {@link Resource}.
   *
   * @param {boolean} safePut true when safe put functionality is required.
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<Resource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(safePut: boolean = false, overwriteSchemaUrl?: string): Promise<Resource> {
    return Promise.resolve()
      .then(() => {
        return this.validate(overwriteSchemaUrl);
      })
      .then(() => {
        const out = this.toOriginal({ saving: true });
        const request = this.newRequest().follow('self');

        if (safePut) {
          if (!('_modified' in out)) {
            throw new Error('safe put without _modified date');
          }

          const date = new Date(out._modified);
          request.addRequestOptions({
            headers: {
              'If-Unmodified-Since': date.toUTCString(),
            },
          });
        } else if (!safePut && request.requestOptions?.headers?.['If-Unmodified-Since']) {
          delete request.requestOptions.headers['If-Unmodified-Since'];
        }

        return put(this[environmentSymbol], request, out);
      })
      .then(([res, traversal]) => {
        if (res) {
          this[resourceSymbol] = halfred.parse(res);
          this[originalSymbol] = JSON.parse(JSON.stringify(res));
        }

        if (traversal) {
          this[traversalSymbol] = traversal;
        }

        return this;
      });
  }

  /**
   * Will assign all properties in resource to this {@link Resource}.
   *
   * @param {object} resource object with properties to assign.
   * @returns {Resource} this Resource for chainability
   */
  setAll(resource: any): any {
    if (!resource) {
      throw new Error('Resource cannot be undefined.');
    }

    Object.assign(this[resourceSymbol], resource);
    return this;
  }

  /**
   * Set a new value to the property identified by property.
   *
   * @param {string} property the property to change.
   * @param {any} value the value to assign.
   * @returns {Resource} this Resource for chainability
   */
  setProperty(property: string, value: any): any {
    this[resourceSymbol][property] = value;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toOriginal(_options?: { saving: boolean }): any {
    const out = {};

    Object.keys(this[originalSymbol]).forEach((key) => {
      if (this[resourceSymbol][key] !== undefined) {
        out[key] = this[resourceSymbol][key];
      }
    });

    return out;
  }

  /**
   * Validates this {@link Resource} against its schema (found in _links.self.profile)
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   * `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<boolean>} Promise will resolve true when Resource is valid, rejects
   *   otherwise.
   */
  validate(overwriteSchemaUrl?: string): Promise<boolean> {
    return Promise.resolve()
      .then(() => {
        const keys = Object.keys(this);
        if (this[resourcePropertiesSymbol].length !== keys.length) {
          throw new Error(
            `Additional properties found: ${keys
              .filter((k) => !this[resourcePropertiesSymbol].includes(k))
              .join(', ')}`,
          );
        }

        return validator.validate(this.toOriginal(), overwriteSchemaUrl || this.getLink('self').profile).catch((e) => {
          throw new Problem(convertValidationError(e), locale);
        });
      })
      .then(() => true);
  }
}

export default Resource;
