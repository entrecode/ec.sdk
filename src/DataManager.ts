import * as validator from 'json-schema-remote';

import Core, { environment } from './Core';
import DataManagerResource from './resources/datamanager/DataManagerResource';
import DataManagerList from './resources/datamanager/DataManagerList';
import DMStatsList from './resources/datamanager/DMStatsList';
import DMStatsResource from './resources/datamanager/DMStatsResource';
import TemplateList from './resources/datamanager/TemplateList';
import TemplateResource from './resources/datamanager/TemplateResource';
import { filterOptions } from './resources/ListResource';
import { get, optionsToQuery, post, superagentGet } from './helper';

validator.setLoggingFunction(() => {
});

const environmentSymbol = Symbol.for('environment');

const urls = {
  live: 'https://datamanager.entrecode.de/',
  stage: 'https://datamanager.cachena.entrecode.de/',
  nightly: 'https://datamanager.buffalo.entrecode.de/',
  develop: 'http://localhost:7471/',
};

/**
 * API connector for {@link https://doc.entrecode.de/en/latest/data_manager/ DataManager API}. It
 * contains APIs for DataManagers, Models, Fields, Hooks, and Policies.
 *
 * @class
 */
export default class DataManager extends Core {
  /**
   * Creates a new instance of {@link DataManager} API connector.
   *
   * @param {environment?} environment the environment to connect to.
   */
  constructor(environment?: environment) {
    super(urls, environment);
  }

  /**
   * Create a new DataManager.
   *
   * @param {object} datamanager object representing the datamanager.
   * @returns {Promise<DataManagerResource>} the newly created DataManagerResource
   */
  create(datamanager: any): Promise<DataManagerResource> {
    return Promise.resolve()
    .then(() => {
      if (!datamanager) {
        throw new Error('Cannot create resource with undefined object.');
      }
      return this.link('ec:datamanager/by-id');
    })
    .then(link => validator.validate(datamanager, `${link.profile}-template`))
    .then(() => post(this[environmentSymbol], this.newRequest(), datamanager))
    .then(([dm, traversal]) => new DataManagerResource(dm, this[environmentSymbol], traversal));
  }

  /**
   * Load a {@link DataManagerList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<DataManagerList>} resolves to datamanager list with applied filters.
   */
  dataManagerList(options?: filterOptions | any): Promise<DataManagerList> {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'dataManagerID' in options
        && (typeof options.dataManagerID === 'string' || (!('any' in options.dataManagerID) && !('all' in options.dataManagerID)))
      ) {
        throw new Error('Providing only an dataManagerID in DataManagerList filter will result in single resource response. Please use DataManager#get');
      }

      return this.follow('ec:datamanagers/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:datamanagers/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DataManagerList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link DataManagerResource} identified by dataManagerID.
   *
   * @param {string} dataManagerID id of the DataManager.
   * @returns {Promise<DataManagerResource>} resolves to the DataManager which should be loaded.
   */
  dataManager(dataManagerID: string): Promise<DataManagerResource> {
    return Promise.resolve()
    .then(() => {
      if (!dataManagerID) {
        throw new Error('dataManagerID must be defined');
      }
      return this.follow('ec:datamanager/by-id');
    })
    .then((request) => {
      request.withTemplateParameters({ dataManagerID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DataManagerResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load the {@link TemplateList}.
   *
   * @example
   * return dm.templateList()
   * .then(templates => {
   *   return template.getAllItems().filter(template => template.templateID === 'thisOne');
   * })
   * .then(templateArray => {
   *   return show(templateArray[0]);
   * });
   *
   * // This would actually be better:
   * return dm.template({
   *   filter: {
   *     roleID: 'thisOne',
   *   },
   * })
   * .then(templates => {
   *   return show(templates.getFirstItem());
   * });
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<TemplateList>} Promise resolving to TemplateList
   */
  templateList(options?: filterOptions | any): Promise<TemplateList> {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'templateID' in options
        && (typeof options.templateID === 'string' || (!('any' in options.tempalteID) && !('all' in options.templateID)))
      ) {
        throw new Error('Cannot filter templateList only by templateID. Use DataManagerResource#template() instead');
      }

      return this.follow('ec:dm-templates/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:dm-templates/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TemplateList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link TemplateResource}.
   *
   * @example
   * return dm.template('thisOne')
   * .then(template => {
   *   return show(template);
   * });
   *
   * @param {string} templateID the templateID
   * @returns {Promise<TemplateResource>} Promise resolving to TemplateResource
   */
  template(templateID: string): Promise<TemplateResource> {
    return Promise.resolve()
    .then(() => {
      if (!templateID) {
        throw new Error('templateID must be defined');
      }
      return this.follow('ec:dm-templates/options');
    })
    .then(request => get(this[environmentSymbol], request.withTemplateParameters({ templateID })))
    .then(([res, traversal]) => new TemplateResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Create a new template.
   *
   * @param {object} template object representing the template.
   * @returns {Promise<TemplateResource>} the newly created TemplateResource
   */
  createTemplate(template: any): Promise<TemplateResource> {
    return Promise.resolve()
    .then(() => {
      if (!template) {
        throw new Error('Cannot create resource with undefined object.');
      }
      return this.link('ec:dm-template/by-id');
    })
    .then(link => validator.validate(template, `${link.profile}-template`))
    .then(() => this.follow('ec:dm-templates'))
    .then(request => post(request, template))
    .then(([dm, traversal]) => new TemplateResource(dm, this[environmentSymbol], traversal));
  }

  /**
   * Load the {@link DMStatsList}.
   *
   * @example
   * return dm.statsList()
   * .then(templates => {
   *   return show(templates.getAllItems());
   * });
   *
   *
   * @returns {Promise<TemplateList>} Promise resolving to DMStatsList
   */
  statsList(): Promise<DMStatsList> {
    return Promise.resolve()
    .then(() => this.follow('ec:dm-stats'))
    .then(request => get(this[environmentSymbol], request))
    .then(([res, traversal]) => new DMStatsList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link DMStatsResource}.
   *
   * @example
   * return dm.stats('id')
   * .then(stats => {
   *   return show(stats);
   * });
   *
   * @param {string} dataManagerID the dataManagerID
   * @returns {Promise<DMStatsResource>} Promise resolving to DMStatsResource
   */
  stats(dataManagerID: string): Promise<DMStatsResource> {
    return Promise.resolve()
    .then(() => {
      if (!dataManagerID) {
        throw new Error('dataManagerID must be defined');
      }
      return this.follow('ec:dm-stats');
    })
    .then(request => get(this[environmentSymbol], request.withTemplateParameters({ dataManagerID })))
    .then(([res]) => new DMStatsList(res, this[environmentSymbol]).getFirstItem());
  }

  /**
   * Best file helper for files.
   *
   * @param {string} assetID - the assetID
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getFileUrl(assetID: string, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }

  /**
   * Best file helper for images.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getImageUrl(assetID: string, size: number, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url${size ? `?size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} URL to the file
   */
  getImageThumbUrl(assetID: string, size: number, locale: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url?thumb${size ? `&size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {})
    .then((res) => res.url);
  }
}
