import Resource from '../Resource';
import { environment } from '../ListResource';

/**
 * AppStatsResource class
 *
 * @class
 *
 * @prop {array<object>} appID - the appID
 * @prop {string} title - title
 * @prop {string} totalBuilds - # of total builds
 * @prop {string} totalBuildSize - total build size in Byte
 * @prop {object} monthlyBuilds - # of monthly builds
 * @prop {string} totalDeployments - # of total deployments
 * @prop {object} monthlyDeployments - # of monthly builds
 * @prop {Array<string>} usedCodeSources - code sources used by this app
 * @prop {Array<string>} usedDataSource - data sources used by this app
 * @prop {Array<string>} usedTargets - targets used by this app
 * @prop {Array<string>} usedPlatforms - platforms used by this app
 */
export default class AppStatsResource extends Resource {
  appID: string;
  title: string;
  totalBuilds: string;
  totalBuildSize: string;
  monthlyBuilds: any;
  totalDeployments: string;
  monthlyDeployments: any;
  usedCodeSources: Array<string>;
  usedDataSources: Array<string>;
  usedTargets: Array<string>;
  usedPlatforms: Array<string>;

  /**
   * Creates a new {@link AppStatsResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      appID: {
        enumerable: true,
        get: () => this.getProperty('appID'),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
      },
      totalBuilds: {
        enumerable: true,
        get: () => this.getProperty('totalBuilds'),
      },
      totalBuildSize: {
        enumerable: true,
        get: () => this.getProperty('totalBuildSize'),
      },
      monthlyBuilds: {
        enumerable: true,
        get: () => this.getProperty('monthlyBuilds'),
      },
      totalDeployments: {
        enumerable: true,
        get: () => this.getProperty('totalDeployments'),
      },
      monthlyDeployments: {
        enumerable: true,
        get: () => this.getProperty('monthlyDeployments'),
      },
      usedCodeSources: {
        enumerable: true,
        get: () => this.getProperty('usedCodeSources'),
      },
      usedDataSources: {
        enumerable: true,
        get: () => this.getProperty('usedDataSources'),
      },
      usedTargets: {
        enumerable: true,
        get: () => this.getProperty('usedTargets'),
      },
      usedPlatforms: {
        enumerable: true,
        get: () => this.getProperty('usedPlatforms'),
      },
    });
    this.countProperties();
  }
}
