import * as halfred from 'halfred';
import * as validator from 'json-schema-remote';

import Resource from '../Resource';
import DataManagerResource from './DataManagerResource';
import { get, post, put } from '../../helper';
import { environment } from '../../Core';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');
const traversalSymbol = Symbol.for('traversal');
const resolvedSymbol = Symbol.for('resolved');

validator.setLoggingFunction(() => {
});

/**
 * Template resource class
 *
 * @class
 *
 * @prop {string} roleID - The id of the template
 * @prop {string} name - The name of the template
 * @prop {object} collection - Postman collection
 * @prop {object} dataSchema - JSON schema for collection data
 * @prop {string} version - version of the tempalte
 */
export default class TemplateResource extends Resource {
  templateID: string;
  name: string;
  collection: Object;
  dataSchema: Object;
  version: Object;

  /**
   * Creates a new {@link TemplateResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    this[resolvedSymbol] = 'collection' in resource;

    Object.defineProperties(this, {
      templateID: {
        enumerable: true,
        get: () => this.getProperty('templateID'),
      },
      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
      },
      collection: {
        enumerable: true,
        get: () => this.getProperty('collection'),
      },
      dataSchema: {
        enumerable: true,
        get: () => this.getProperty('dataSchema'),
      },
      version: {
        enumerable: true,
        get: () => this.getProperty('version'),
      },
    });
    this.countProperties();
  }

  resolve(): Promise<TemplateResource> {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('self');
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => {
      this[resolvedSymbol] = true;
      this[traversalSymbol] = traversal;
      this[resourceSymbol] = halfred.parse(res);
      return this;
    });
  }

  /**
   * Create new DataManager from this template.
   *
   * @param {object} body body parameters for creating the DataManager
   * @returns {Promise<DataManagerResource>} The newly created DataManager.
   */
  createDM(body: any): Promise<DataManagerResource> {
    return Promise.resolve()
    .then(() => {
      if (this[resolvedSymbol]) {
        return undefined;
      }
      return this.resolve();
    })
    .then(() => {
      validator.validate(body || {}, this.dataSchema);
    })
    .then(() => {
      const request = this.newRequest().follow('ec:datamanagers/new-from-template');
      return post(this[environmentSymbol], request, body || {});
    })
    .then(([res, traversal]) => new DataManagerResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Update existing DataManager from this template.
   *
   * @param {string} dataManagerID The DataManager to update.
   * @returns {Promise<DataManagerResource>} The updated DataManager.
   */
  updateDM(dataManagerID: string): Promise<DataManagerResource> {
    if (!dataManagerID) {
      return Promise.reject(new Error('Must provide dataManagerID for update.'));
    }

    const request = this.newRequest()
    .follow('ec:datamanager/update-from-template')
    .withTemplateParameters({ dataManagerID });
    return put(this[environmentSymbol], request, {})
    .then(([res, traversal]) => new DataManagerResource(res, this[environmentSymbol], traversal));
  }
}
