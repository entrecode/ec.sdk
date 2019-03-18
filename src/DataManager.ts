import * as validator from 'json-schema-remote';

const { convertValidationError } = require('ec.errors')();

import Core, { environment, options } from './Core';
import DataManagerResource from './resources/datamanager/DataManagerResource';
import DataManagerList from './resources/datamanager/DataManagerList';
import DMStatsList from './resources/datamanager/DMStatsList';
import DMStatsResource from './resources/datamanager/DMStatsResource';
import TemplateList from './resources/datamanager/TemplateList';
import TemplateResource from './resources/datamanager/TemplateResource';
import { filterOptions } from './resources/ListResource';
import { locale, get, getHistory, optionsToQuery, post, superagentGet } from './helper';
import Problem from './Problem';
import HistoryEvents from './resources/publicAPI/HistoryEvents';

declare const EventSource: any;

validator.setLoggingFunction(() => {});

const environmentSymbol: any = Symbol.for('environment');
const relationsSymbol: any = Symbol.for('relations');

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
 *
 * @param {environment?} environment the environment to connect to
 */
export default class DataManager extends Core {
  constructor(envOrOptions?: environment | options) {
    super(urls, envOrOptions);

    this[relationsSymbol] = {
      dataManager: {
        relation: 'ec:datamanagers/options',
        createRelation: 'ec:datamanager/by-id',
        createTemplateModifier: '-template',
        id: 'dataManagerID',
        ResourceClass: DataManagerResource,
        ListClass: DataManagerList,
      },
      template: {
        relation: 'ec:dm-templates/options',
        createRelation: 'ec:dm-template/by-id',
        createTemplateModifier: '-template',
        id: 'templateID',
        ResourceClass: TemplateResource,
        ListClass: TemplateList,
      },
    };
  }

  /**
   * Create a new DataManager.
   *
   * @example
   * return dm.create({ title: 'my new dm' })
   * .then(dm => createRequiredModelsFor(dm));
   *
   * @param {object} datamanager object representing the datamanager
   * @returns {Promise<DataManagerResource>} the newly created DataManagerResource
   */
  createDataManager(datamanager: any): Promise<DataManagerResource> {
    return <Promise<DataManagerResource>>this.create('dataManager', datamanager);
  }

  /**
   * Create a new template.
   *
   * @example
   * return dm.createTemplate({
   *   collection: {…},
   *   dataSchema: {…},
   * })
   * .then(template => template.createDM())
   * .then(dm => show(dm));
   *
   * @param {object} template object representing the template
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
      .then((link) =>
        validator.validate(template, `${link.profile}-template`).catch((e) => {
          throw new Problem(convertValidationError(e), locale);
        }),
      )
      .then(() => this.follow('ec:dm-templates'))
      .then((request) => post(request, template))
      .then(([dm, traversal]) => new TemplateResource(dm, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link DataManagerResource} identified by dataManagerID.
   *
   * @example
   * return dm.dataManager(myDmID)
   * .then(dm => dm.del());
   *
   * @param {string} dataManagerID id of the DataManager
   * @returns {Promise<DataManagerResource>} resolves to the DataManager which should be loaded
   */
  dataManager(dataManagerID: string): Promise<DataManagerResource> {
    return <Promise<DataManagerResource>>this.resource('dataManager', dataManagerID);
  }

  /**
   * Load a {@link DataManagerList} of {@link DataManagerResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options
   * @returns {Promise<DataManagerList>} resolves to datamanager list with applied filters
   */
  dataManagerList(options?: filterOptions | any): Promise<DataManagerList> {
    return <Promise<DataManagerList>>this.resourceList('dataManager', options);
  }

  /**
   * Best file helper for files.
   *
   * @deprecated
   * @param {string} assetID - the assetID
   * @param {string?} locale - the locale
   * @returns {Promise<string>} Promise resolving the URL to the file
   */
  getFileUrl(assetID: string, locale?: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {}).then((res) => res.url);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @deprecated
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} Promise resolving the URL to the file
   */
  getImageThumbUrl(assetID: string, size?: number, locale?: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url?thumb${size ? `&size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {}).then((res) => res.url);
  }

  /**
   * Best file helper for images.
   *
   * @deprecated
   * @param {string} assetID - the assetID
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {Promise<string>} Promise resolving the URL to the file
   */
  getImageUrl(assetID: string, size?: number, locale?: string): Promise<string> {
    if (!assetID) {
      return Promise.reject(new Error('assetID must be defined'));
    }

    const url = `${urls[this[environmentSymbol]]}files/${assetID}/url${size ? `?size=${size}` : ''}`;
    return superagentGet(url, locale ? { 'Accept-Language': locale } : {}).then((res) => res.url);
  }

  /**
   * Load the HistoryEvents for this DataManager from v3 API.
   * Note: This Request only has pagination when you load a single modelID.
   *
   * @param {filterOptions | any} options The filter options
   * @returns {Promise<HistoryEvents} The filtered HistoryEvents
   */
  getEvents(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:history'))
      .then((request) => {
        request.follow('ec:entries-history');

        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res, traversal]) => new HistoryEvents(res, this[environmentSymbol], traversal));
  }

  /*
  /**
   * Creates a new History EventSource with the given filter options.
   *
   * @param {filterOptions | any} options The filter options
   * @return {Promise<EventSource>} The created EventSource.
   */
  /*
  newHistory(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:history'))
      .then((request) => {
        request.follow('ec:entry-history');

        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return getHistory(this[environmentSymbol], request);
      });
  }

  /**
   * Creates a new HistoryEventsResource with past events.
   *
   * @param {filterOptions?} options The filter options.
   * @returns {Promise<HistoryEventsResource} Event list of past events.
   */
  /*
  getPastEvents(options?: filterOptions): Promise<any> {
    return Promise.resolve()
      .then(() => this.follow('ec:history'))
      .then((request) => {
        request.follow('ec:entry-history');

        if (options) {
          request.withTemplateParameters(optionsToQuery(options));
        }

        return get(this[environmentSymbol], request);
      })
      .then(([res]) => new HistoryEvents(res, this[environmentSymbol]));
  }
  */

  /**
   * Load a single {@link DMStatsResource}.
   *
   * @example
   * return dm.stats(myDM.dataManagerID)
   * .then(stats => show(stats));
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
      .then((request) => get(this[environmentSymbol], request.withTemplateParameters({ dataManagerID })))
      .then(([res]) => new DMStatsList(res, this[environmentSymbol]).getFirstItem());
  }

  /**
   * Load the {@link DMStatsList}.
   *
   * @example
   * return dm.statsList()
   * .then(templates => show(templates.getAllItems()));
   *
   * @returns {Promise<TemplateList>} Promise resolving to DMStatsList
   */
  statsList(): Promise<DMStatsList> {
    return Promise.resolve()
      .then(() => this.follow('ec:dm-stats'))
      .then((request) => get(this[environmentSymbol], request))
      .then(([res, traversal]) => new DMStatsList(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a single {@link TemplateResource}.
   *
   * @example
   * return dm.template('thisOne')
   * .then(template => {
   *   const data = createRandomDataFromSchema(template.dataSchema);
   *   return template.creatDM(data);
   * });
   *
   * @param {string} templateID the templateID
   * @returns {Promise<TemplateResource>} Promise resolving to TemplateResource
   */
  template(templateID: string): Promise<TemplateResource> {
    return <Promise<TemplateResource>>this.resource('template', templateID);
  }

  /**
   * Load the {@link TemplateList}.
   *
   * @example
   * return dm.template({
   *   filter: {
   *     name: {
   *       search: 'clubapp',
   *     },
   *   },
   *   sort: ['-version'],
   *   size: 2,
   * })
   * .then(templates => );
   *
   * @param {filterOptions?} options filter options
   * @returns {Promise<TemplateList>} Promise resolving to TemplateList
   */
  templateList(options?: filterOptions | any): Promise<TemplateList> {
    return <Promise<TemplateList>>this.resourceList('template', options);
  }
}
