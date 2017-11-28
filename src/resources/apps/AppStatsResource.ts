import Resource from '../Resource';
import { environment } from '../../Core';

interface AppStatsResource {
  appID: string,
  monthlyBuilds: Array<any>,
  monthlyDeployments: Array<any>,
  title: string,
  totalBuildSize: number,
  totalBuilds: number,
  totalDeployments: number,
  usedCodeSources: Array<string>,
  usedDataSources: Array<string>,
  usedPlatforms: Array<string>,
  usedTargets: Array<string>,
}

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
class AppStatsResource extends Resource {
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
        get: () => <string>this.getProperty('appID'),
      },
      monthlyBuilds: {
        get: () => this.getProperty('monthlyBuilds'),
      },
      monthlyDeployments: {
        get: () => this.getProperty('monthlyDeployments'),
      },
      title: {
        get: () => <string>this.getProperty('title'),
      },
      totalBuildSize: {
        get: () => <number>this.getProperty('totalBuildSize'),
      },
      totalBuilds: {
        get: () => <number>this.getProperty('totalBuilds'),
      },
      totalDeployments: {
        get: () => <number>this.getProperty('totalDeployments'),
      },
      usedCodeSources: {
        get: () => <Array<string>>this.getProperty('usedCodeSources'),
      },
      usedDataSources: {
        get: () => <Array<string>>this.getProperty('usedDataSources'),
      },
      usedPlatforms: {
        get: () => <Array<string>>this.getProperty('usedPlatforms'),
      },
      usedTargets: {
        get: () => <Array<string>>this.getProperty('usedTargets'),
      },
    });
    this.countProperties();
  }
}

export default AppStatsResource;
