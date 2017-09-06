import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * DeploymentResource class
 *
 * @class
 *
 * @prop {string} deploymentID - the id
 */
export default class DeploymentResource extends Resource {
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
    this.countProperties();
  }

  get buildID() {
    return this.getProperty('buildID');
  }

  get deploymentID() {
    return <string>this.getProperty('deploymentID');
  }

  get events() {
    return <Array<string>>this.getProperty('events');
  }

  get finished() {
    return new Date(this.getProperty('finished'));
  }

  get platformID() {
    return <string>this.getProperty('platformID');
  }

  get results() {
    return <Array<any>>this.getProperty('results');
  }

  get started() {
    return new Date(this.getProperty('started'));
  }

  get successful() {
    return <boolean>this.getProperty('successful');
  }

  get targetIDs() {
    return <Array<string>>this.getProperty('targetIDs');
  }
}
