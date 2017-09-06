import Resource from '../Resource';
import { environment } from '../../Core';

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
    this.countProperties();
  }

  get appID() {
    return <string>this.getProperty('appID')
  }

  get monthlyBuilds() {
    return this.getProperty('monthlyBuilds')
  }

  get monthlyDeployments() {
    return this.getProperty('monthlyDeployments')
  }

  get title() {
    return <string>this.getProperty('title')
  }

  get totalBuildSize() {
    return <number>this.getProperty('totalBuildSize')
  }

  get totalBuilds() {
    return <number>this.getProperty('totalBuilds')
  }

  get totalDeployments() {
    return <number>this.getProperty('totalDeployments')
  }

  get usedCodeSources() {
    return <Array<string>>this.getProperty('usedCodeSources')
  }

  get usedDataSources() {
    return <Array<string>>this.getProperty('usedDataSources')
  }

  get usedPlatforms() {
    return <Array<string>>this.getProperty('usedPlatforms')
  }

  get usedTargets() {
    return <Array<string>>this.getProperty('usedTargets')
  }
}
