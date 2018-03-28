import * as validator from 'json-schema-remote';
import Resource from '../Resource';
import PlatformList from './PlatformList';
import PlatformResource from './PlatformResource';
import CodeSourceList from './CodeSourceList';
import CodeSourceResource from './CodeSourceResource';
import DataSourceList from './DataSourceList';
import DataSourceResource from './DataSourceResource';
import TargetList from './TargetList';
import TargetResource from './TargetResource';
import { filterOptions } from '../ListResource';
import { environment } from '../../Core';

const relationsSymbol = Symbol.for('relations');

validator.setLoggingFunction(() => {
});

interface AppResource {
  appID: string,
  created: Date,
  hexColor: string,
  shortID: string,
  title: string,
}

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
class AppResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    this[relationsSymbol] = {
      codeSource: {
        relation: 'ec:app/codesources/options',
        createRelation: 'ec:app/codesource/by-id',
        createTemplateModifier: '-template',
        id: 'codeSourceID',
        ResourceClass: CodeSourceResource,
        ListClass: CodeSourceList,
      },
      dataSource: {
        relation: 'ec:app/datasources/options',
        createRelation: 'ec:app/datasource/by-id',
        createTemplateModifier: '-template',
        id: 'dataSourceID',
        ResourceClass: DataSourceResource,
        ListClass: DataSourceList,
      },
      platform: {
        relation: 'ec:app/platforms/options',
        createRelation: 'ec:app/platform/by-id',
        createTemplateModifier: '-template',
        id: 'platformID',
        ResourceClass: PlatformResource,
        ListClass: PlatformList,
      },
      target: {
        relation: 'ec:app/targets/options',
        createRelation: 'ec:app/target/by-id',
        createTemplateModifier: '-template',
        id: 'targetID',
        ResourceClass: TargetResource,
        ListClass: TargetList,
      },
    };

    Object.defineProperties(this, {
      appID: {
        enumerable: true,
        get: () => <string>this.getProperty('appID'),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      hexColor: {
        enumerable: true,
        get: () => <string>this.getProperty('hexColor'),
        set: (value: string) => this.setProperty('hexColor', value),
      },
      shortID: {
        enumerable: true,
        get: () => <string>this.getProperty('shortID'),
      },
      title: {
        enumerable: true,
        get: () => <string>this.getProperty('title'),
        set: (value: string) => this.setProperty('title', value),
      },
    });
    this.countProperties();
  }

  /**
   * Get a single {@link CodeSourceResource} identified by codeSourceID.
   *
   * @param {string} codeSourceID id of the app.
   * @returns {Promise<CodeSourceResource>} resolves to the codeSource which should be loaded.
   */
  codeSource(codeSourceID: string): Promise<CodeSourceResource> {
    return <Promise<CodeSourceResource>>this.resource('codeSource', codeSourceID);
  }

  /**
   * Load a {@link CodeSourceList} of {@link CodeSourceResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<CodeSourceList>} resolves to app list with applied filters.
   */
  codeSourceList(options?: filterOptions | any): Promise<CodeSourceList> {
    return <Promise<CodeSourceList>>this.resourceList('codeSource', options);
  }

  /**
   * Create a new codeSource.
   *
   * @param {object} codeSource object representing the codeSource.
   * @returns {Promise<CodeSourceResource>} the newly created CodeSourceResource
   */
  createCodeSource(codeSource: any): Promise<CodeSourceResource> {
    return <Promise<CodeSourceResource>>this.create('codeSource', codeSource);
  }

  /**
   * Create a new dataSource.
   *
   * @param {object} dataSource object representing the dataSource.
   * @returns {Promise<DataSourceResource>} the newly created DataSourceResource
   */
  createDataSource(dataSource: Promise<DataSourceResource>) {
    return <Promise<CodeSourceResource>>this.create('dataSource', dataSource);
  }

  /**
   * Creates a new platform for this app. You will have to have a {@link CodeSourceResource},
   * {@link DataSourceResource}, and one or more {@link TargetResource}. In the `ec.API` this is
   * performed as a POST request containing the plugins as links in HALs `_links` object - This is
   * also an option here. But for convenience you can put the Resources into the object directly.
   * See the example below for details.
   *
   * @example
   * const platform = {
   *   title: 'MyAwesomePlatform',
   *   platformType: 'website',
   *   config: {
   *     // …
   *   },
   *   codeSource = codeSourceResource,
   *   dataSource = dataSourceResource,
   *   target = [targetResource1, targetResource2],
   * };
   *
   * // this would be ok as well
   * const otherPlatform = {
   *   title: 'MyAwesomePlatform',
   *   platformType: 'website',
   *   config: {
   *     // …
   *   },
   *   _links: {
   *     "ec:app/codesource": {
   *        href: "…",
   *     },
   *     "ec:app/datasource": {
   *        href: "…",
   *     },
   *     "ec:app/target": {
   *        href: "…",
   *     },
   *   }
   * }
   *
   * app.createPlatform(platform)
   * .then(platform => doSomethingWith(platform));
   *
   * @param {object} platform platform to create
   * @returns {Promise<PlatformResource>}
   */
  createPlatform(platform: any): Promise<PlatformResource> {
    return Promise.resolve()
      .then(() => {
        if (!platform) {
          throw new Error('Cannot create resource with undefined object.');
        }

        const out: any = Object.assign({}, platform);

        if (!('_links' in out)) {
          out._links = {};
        }

        if (out.codeSource) {
          out._links['ec:app/codesource'] = out.codeSource.getLink('self');
          delete out.codeSource;
        }

        if (out.dataSource) {
          out._links['ec:app/datasource'] = out.dataSource.getLink('self');
          delete out.dataSource;
        }

        if (out.target) {
          if (!Array.isArray(out.target)) {
            out.target = [out.target];
          }

          out._links['ec:app/target'] = out.target.map(target => target.getLink('self'));
          delete out.target;
        }

        return <Promise<PlatformResource>>this.create('platform', out);
      });
  }

  /**
   * Create a new target.
   *
   * @param {object} target object representing the target.
   * @returns {Promise<TargetResource>} the newly created TargetResource
   */
  createTarget(target: string): Promise<TargetResource> {
    return <Promise<TargetResource>>this.create('target', target);
  }

  /**
   * Get a single {@link CodeSourceResource} identified by dataSourceID.
   *
   * @param {string} dataSourceID id of the app.
   * @returns {Promise<CodeSourceResource>} resolves to the dataSource which should be loaded.
   */
  dataSource(dataSourceID: string): Promise<DataSourceResource> {
    return <Promise<DataSourceResource>>this.resource('dataSource', dataSourceID);
  }

  /**
   * Load a {@link DataSourceList} of {@link CodeSourceResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<CodeSourceList>} resolves to app list with applied filters.
   */
  dataSourceList(options?: filterOptions | any): Promise<CodeSourceList> {
    return <Promise<DataSourceList>>this.resourceList('dataSource', options);
  }

  /**
   * Get a single {@link PlatformResource} identified by platformID.
   *
   * @param {string} platformID id of the app.
   * @returns {Promise<PlatformResource>} resolves to the platform which should be loaded.
   */
  platform(platformID: string): Promise<PlatformResource> {
    return <Promise<PlatformResource>>this.resource('platform', platformID);
  }

  /**
   * Load a {@link PlatformList} of {@link PlatformResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<PlatformList>} resolves to app list with applied filters.
   */
  platformList(options?: filterOptions | any): Promise<PlatformList> {
    return <Promise<PlatformList>>this.resourceList('platform', options);
  }

  /**
   * Get a single {@link TargetResource} identified by targetID.
   *
   * @param {string} targetID id of the app.
   * @returns {Promise<TargetResource>} resolves to the target which should be loaded.
   */
  target(targetID: string): Promise<TargetResource> {
    return <Promise<TargetResource>>this.resource('target', targetID);
  }

  /**
   * Load a {@link TargetList} of {@link TargetResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<TargetList>} resolves to app list with applied filters.
   */
  targetList(options?: filterOptions | any): Promise<TargetList> {
    return <Promise<TargetList>>this.resourceList('target', options);
  }
}

export default AppResource;
