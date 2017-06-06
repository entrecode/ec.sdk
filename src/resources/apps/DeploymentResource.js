import Resource from '../Resource';

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
  constructor(resource, environment, traversal) {
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
  }
}
