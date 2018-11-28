import Resource from '../Resource';
import { environment } from '../../Core';

interface BuildResource {
  buildID: string;
  buildLocation: any;
  events: Array<any>;
  finished: Date;
  started: Date;
  successful: 'success' | 'running' | 'error';
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
        enumerable: true,
        get: () => <string>this.getProperty('buildID'),
      },
      buildLocation: {
        enumerable: true,
        get: () => this.getProperty('buildLocation'),
      },
      events: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('events'),
      },
      finished: {
        enumerable: true,
        get: () => new Date(this.getProperty('finished')),
      },
      started: {
        enumerable: true,
        get: () => new Date(this.getProperty('started')),
      },
      successful: {
        enumerable: true,
        get: () => <boolean>this.getProperty('successful'),
      },
    });
    this.countProperties();
  }

  // TODO get events helper, no temp, sorted…
  // TODO add deploy functions
}

export default BuildResource;
