import AppList from './resources/apps/AppList';
import AppResource from './resources/apps/AppResource';
import AppStatsList from './resources/apps/AppStatsList';
import AppStatsResource from './resources/apps/AppStatsResource';
import Core, { environment, options } from './Core';
import TypesResource from './resources/apps/TypesResource';
import { filterOptions } from './resources/ListResource';
import { get } from './helper';

const environmentSymbol = Symbol.for('environment');
const relationsSymbol = Symbol.for('relations');


const urls = {
  live: 'https://appserver.entrecode.de/',
  stage: 'https://appserver.cachena.entrecode.de/',
  nightly: 'https://appserver.buffalo.entrecode.de/',
  develop: 'http://localhost:7470/',
};

/**
 * This API connector can be used for Appserver APIs. It contains APIs for Apps, Platforms,
 * Plugins, Builds and Deployments.
 *
 * @class
 *
 * @param {environment?} environment the environment to connect to
 */
export default class Apps extends Core {
  constructor(envOrOptions?: environment | options) {
    super(urls, envOrOptions);

    this[relationsSymbol] = {
      app: {
        relation: 'ec:apps/options',
        createRelation: 'ec:app/by-id',
        createTemplateModifier: '-template',
        id: 'appID',
        ResourceClass: AppResource,
        ListClass: AppList,
      },
      stats: {
        relation: 'ec:app-stats',
        createRelation: false,
        createTemplateModifier: '',
        id: 'appID',
        ResourceClass: AppStatsResource,
        ListClass: AppStatsList,
      },
    };
  }

  /**
   * Get a single {@link AppResource} identified by appID.
   *
   * @example
   * return apps.app(deleteThisID)
   * .then(app => app.del());
   *
   * @param {string} appID id of the app
   * @returns {Promise<AppResource>} resolves to the app which should be loaded
   */
  app(appID: string): Promise<AppResource> {
    return <Promise<AppResource>>this.resource('app', appID);
  }

  /**
   * Load a {@link AppList} of {@link AppResource} filtered by the values specified
   * by the options parameter.
   *
   * @example
   * return apps.appList()
   * .then(list => list.map((app) => {
   *   app.name = 'haha all your apps are named the same';
   *   return app.save();
   * }));
   *
   * @param {filterOptions?} options the filter options
   * @returns {Promise<AppList>} resolves to app list with applied filters
   */
  appList(options?: filterOptions | any): Promise<AppList> {
    return <Promise<AppList>>this.resourceList('app', options);
  }

  /**
   * Create a new App
   *
   * @example
   * return apps.create({
   *   title: 'my new app',
   *   hexColor: '#ffffff',
   * })
   * .then(app => show(app));
   *
   * @param {object} app object representing the app
   * @returns {Promise<AppResource>} the newly created AppResource
   */
  createApp(app: any): Promise<AppResource> {
    return <Promise<AppResource>>this.create('app', app);
  }

  /**
   * Load a single {@link AppStatsResource}.
   *
   * @example
   * return dm.stats(app.appID)
   * .then(stats => show(stats));
   *
   * @param {string} appID the appID
   * @returns {Promise<AppStatsResource>} Promise resolving to AppStatsResource
   */
  stats(appID: string): Promise<AppStatsResource> {
    return <Promise<AppStatsResource>>this.resource('stats', appID);
  }

  /**
   * Load the {@link AppStatsList}.
   *
   * @example
   * return apps.statsList()
   * .then(stats => show(stats.getAllItems()));
   *
   * @returns {Promise<AppStatsList>} Promise resolving to AppStatsList
   */
  statsList(): Promise<AppStatsList> {
    return <Promise<AppStatsList>>this.resourceList('stats');
  }

  /**
   * Load the {@link TypesResource}. This resource contains information about all available plugin
   * types.
   *
   * @returns {Promise<TypesResource>} Promise resolving to TypesResource
   */
  types(): Promise<TypesResource> {
    return Promise.resolve()
      .then(() => this.follow('ec:apps/types'))
      .then(request => get(this[environmentSymbol], request))
      .then(([res, traversal]) => new TypesResource(res, this[environmentSymbol], traversal));
  }
}
