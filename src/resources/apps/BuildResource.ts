import Resource from '../Resource';
import { environment } from '../../Core';

interface BuildResource {
  buildID: string,
  buildLocation: any,
  events: Array<any>,
  finished: Date,
  started: Date,
  successful: boolean,
}

/**
 * BuildResource class
 *
 * @class
 *
 * @prop {string} buildID - the id
 */
class BuildResource extends Resource {
  /**
   * Creates a new {@link BuildResource}.
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
        get: () => <string>this.getProperty('buildID'),
      },
      buildLocation: {
        get: () => this.getProperty('buildLocation'),
      },
      events: {
        get: () => <Array<any>>this.getProperty('events'),
      },
      finished: {
        get: () => new Date(this.getProperty('finished')),
      },
      started: {
        get: () => new Date(this.getProperty('started')),
      },
      successful: {
        get: () => <boolean>this.getProperty('successful'),
      },
    });
    this.countProperties();
  }

  // TODO get events helper, no temp, sorted…
}

export default BuildResource;
