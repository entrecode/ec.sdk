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
  deploymentID: string;
  buildID: string;
  platformID: string;
  targetIDs: Array<string>;
  started: Date;
  finished: Date;
  successful: string;
  events: Array<any>;
  results: Array<any>;

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
      deploymentID: {
        enumerable: true,
        get: () => this.getProperty('deploymentID'),
      },
      buildID: {
        enumerable: true,
        get: () => this.getProperty('buildID'),
      },
      platformID: {
        enumerable: true,
        get: () => this.getProperty('platformID'),
      },
      targetIDs: {
        enumerable: true,
        get: () => this.getProperty('targetIDs'),
      },
      started: {
        enumerable: true,
        get: () => new Date(this.getProperty('started')),
      },
      finished: {
        enumerable: true,
        get: () => new Date(this.getProperty('finished')),
      },
      successful: {
        enumerable: true,
        get: () => this.getProperty('successful'),
      },
      events: {
        enumerable: true,
        get: () => this.getProperty('events'),
      },
      results: {
        enumerable: true,
        get: () => this.getProperty('results'),
      },
    });
    this.countProperties();
  }
}
