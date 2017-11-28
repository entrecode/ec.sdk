import Resource from '../Resource';
import { environment } from '../../Core';

interface DeploymentResource {
  buildID: string,
  deploymentID: string,
  events: Array<any>,
  finished: Date,
  platformID: string,
  results: Array<any>,
  started: Date,
  successful: boolean,
  targetIDs: Array<string>,
}

/**
 * DeploymentResource class
 *
 * @class
 *
 * @prop {string} deploymentID - the id
 */
class DeploymentResource extends Resource {
  /**
   * Creates a new {@link DeploymentResource}.
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
      buildID: {
        get: () => this.getProperty('buildID'),
      },
      deploymentID: {
        get: () => <string>this.getProperty('deploymentID'),
      },
      events: {
        get: () => <Array<string>>this.getProperty('events'),
      },
      finished: {
        get: () => new Date(this.getProperty('finished')),
      },
      platformID: {
        get: () => <string>this.getProperty('platformID'),
      },
      results: {
        get: () => <Array<any>>this.getProperty('results'),
      },
      started: {
        get: () => new Date(this.getProperty('started')),
      },
      successful: {
        get: () => <boolean>this.getProperty('successful'),
      },
      targetIDs: {
        get: () => <Array<string>>this.getProperty('targetIDs'),
      },
    });
    this.countProperties();
  }

  // TODO get events helper, no temp, sorted…
}

export default DeploymentResource;
