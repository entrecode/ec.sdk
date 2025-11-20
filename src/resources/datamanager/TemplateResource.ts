import * as halfred from 'halfred';
import * as validator from 'json-schema-remote';
import { convertValidationError } from 'ec.errors';
import Resource from '../Resource';
import DataManagerResource from './DataManagerResource';
import { get, post, put, locale } from '../../helper';
import { environment } from '../../types';
import Problem from '../../Problem';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');
const traversalSymbol: any = Symbol.for('traversal');
const resolvedSymbol: any = Symbol.for('resolved');

validator.setLoggingFunction(() => {});

interface TemplateResource {
  collection: any;
  dataSchema: any;
  name: string;
  templateID: string;
  version: string;
}

/**
 * Template resource class
 *
 * @class
 *
 * @prop {string} templateID - The id of the template
 * @prop {string} name - The name of the template
 * @prop {object} collection - Postman collection
 * @prop {object} dataSchema - JSON schema for collection data
 * @prop {string} version - version of the template
 */
class TemplateResource extends Resource {
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
      collection: {
        get: () => <any>this.getProperty('collection'),
      },
      dataSchema: {
        get: () => <any>this.getProperty('dataSchema'),
      },
      name: {
        get: () => <string>this.getProperty('name'),
      },
      templateID: {
        get: () => <string>this.getProperty('templateID'),
      },
      version: {
        get: () => <string>this.getProperty('version'),
      },
    });
    this.countProperties();
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
          return this;
        }
        return this.resolve();
      })
      .then(() =>
        validator.validate(body || {}, this.dataSchema).catch((e) => {
          throw new Problem(convertValidationError(e), locale);
        }),
      )
      .then(() => {
        const request = this.newRequest().follow('ec:datamanagers/new-from-template');
        return post(this[environmentSymbol], request, body || {});
      })
      .then(([res, traversal]) => new DataManagerResource(res, this[environmentSymbol], traversal));
  }

  resolve(): Promise<TemplateResource> {
    return Promise.resolve()
      .then(() => {
        const request = this.newRequest();
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
    return put(this[environmentSymbol], request, {}).then(
      ([res, traversal]) => new DataManagerResource(res, this[environmentSymbol], traversal),
    );
  }
}

export default TemplateResource;
