import Resource from '../Resource';
import { environment } from '../../Core';

/**
 * BuildResource class
 *
 * @class
 *
 * @prop {string} buildID - the id
 */
export default class BuildResource extends Resource {
  buildID: string;
  started: Date;
  finished: Date;
  successful: string;
  buildLocation: any;
  events: Array<any>;

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
        get: () => this.getProperty('buildID'),
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
      buildLocation: {
        enumerable: true,
        get: () => this.getProperty('buildLocation'),
      },
      events: {
        enumerable: true,
        get: () => this.getProperty('events'),
      },
    });
    this.countProperties();
  }
}
