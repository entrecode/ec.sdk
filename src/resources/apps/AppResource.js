import { get, optionsToQuery } from '../../helper';
import Resource, { environmentSymbol } from '../Resource';
import PlatformList from './PlatformList';
import PlatformResource from './PlatformResource';
import CodeSourceList from './CodeSourceList';
import CodeSourceResource from './CodeSourceResource';
import DataSourceList from './DataSourceList';
import DataSourceResource from './DataSourceResource';
import TargetList from './TargetList';
import TargetResource from './TargetResource';

/**
 * AppResource class
 *
 * @class
 *
 * @prop {string} appID - ID
 * @prop {string} shortID - shortened ID
 * @prop {date} created - created date
 * @prop {string} title - title
 * @prop {string} hexColor - color for frontend usage
 */
export default class AppResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      appID: {
        enumerable: true,
        get: () => this.getProperty('appID'),
      },
      shortID: {
        enumerable: true,
        get: () => this.getProperty('shortID'),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
      hexColor: {
        enumerable: true,
        get: () => this.getProperty('hexColor'),
        set: (value) => {
          this.setProperty('hexColor', value);
          return value;
        },
      },
    });
  }

  /**
   * Load a {@link PlatformList} of {@link PlatformResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<PlatformList>} resolves to app list with applied filters.
   */
  platformList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'platformID' in options
        && (typeof options.platformID === 'string' || (!('any' in options.platformID) && !('all' in options.platformID)))
      ) {
        throw new Error('Cannot filter platformList only by platformID. Use AppResource#platform instead');
      }

      return this.newRequest().follow('ec:app/platforms/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:app/platforms/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PlatformList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link PlatformResource} identified by platformID.
   *
   * @param {string} platformID id of the app.
   * @returns {Promise<PlatformResource>} resolves to the platform which should be loaded.
   */
  platform(platformID) {
    return Promise.resolve()
    .then(() => {
      if (!platformID) {
        throw new Error('platformID must be defined');
      }
      return this.newRequest().follow('ec:app/platforms/options');
    })
    .then((request) => {
      request.withTemplateParameters({ platformID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new PlatformResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a {@link CodeSourceList} of {@link CodeSourceResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<CodeSourceList>} resolves to app list with applied filters.
   */
  codeSourceList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'codeSourceID' in options
        && (typeof options.codeSourceID === 'string' || (!('any' in options.codeSourceID) && !('all' in options.codeSourceID)))
      ) {
        throw new Error('Cannot filter codeSourceList only by codeSourceID. Use AppResource#codeSource instead');
      }

      return this.newRequest().follow('ec:app/codesources/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:app/codesources/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new CodeSourceList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link CodeSourceResource} identified by codeSourceID.
   *
   * @param {string} codeSourceID id of the app.
   * @returns {Promise<CodeSourceResource>} resolves to the codeSource which should be loaded.
   */
  codeSource(codeSourceID) {
    return Promise.resolve()
    .then(() => {
      if (!codeSourceID) {
        throw new Error('codeSourceID must be defined');
      }
      return this.newRequest().follow('ec:app/codesources/options');
    })
    .then((request) => {
      request.withTemplateParameters({ codeSourceID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new CodeSourceResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a {@link DataSourceList} of {@link CodeSourceResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<CodeSourceList>} resolves to app list with applied filters.
   */
  dataSourceList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'dataSourceID' in options
        && (typeof options.dataSourceID === 'string' || (!('any' in options.dataSourceID) && !('all' in options.dataSourceID)))
      ) {
        throw new Error('Cannot filter dataSourceList only by dataSourceID. Use AppResource#dataSource instead');
      }

      return this.newRequest().follow('ec:app/datasources/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:app/datasources/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DataSourceList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link CodeSourceResource} identified by dataSourceID.
   *
   * @param {string} dataSourceID id of the app.
   * @returns {Promise<CodeSourceResource>} resolves to the dataSource which should be loaded.
   */
  dataSource(dataSourceID) {
    return Promise.resolve()
    .then(() => {
      if (!dataSourceID) {
        throw new Error('dataSourceID must be defined');
      }
      return this.newRequest().follow('ec:app/datasources/options');
    })
    .then((request) => {
      request.withTemplateParameters({ dataSourceID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DataSourceResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a {@link TargetList} of {@link TargetResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<TargetList>} resolves to app list with applied filters.
   */
  targetList(options) {
    return Promise.resolve()
    .then(() => {
      if (
        options && Object.keys(options).length === 1 && 'targetID' in options
        && (typeof options.targetID === 'string' || (!('any' in options.targetID) && !('all' in options.targetID)))
      ) {
        throw new Error('Cannot filter targetList only by targetID. Use AppResource#target instead');
      }

      return this.newRequest().follow('ec:app/targets/options');
    })
    .then((request) => {
      request.withTemplateParameters(optionsToQuery(options, this.getLink('ec:app/targets/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TargetList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link TargetResource} identified by targetID.
   *
   * @param {string} targetID id of the app.
   * @returns {Promise<TargetResource>} resolves to the target which should be loaded.
   */
  target(targetID) {
    return Promise.resolve()
    .then(() => {
      if (!targetID) {
        throw new Error('targetID must be defined');
      }
      return this.newRequest().follow('ec:app/targets/options');
    })
    .then((request) => {
      request.withTemplateParameters({ targetID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new TargetResource(res, this[environmentSymbol], traversal));
  }
}
