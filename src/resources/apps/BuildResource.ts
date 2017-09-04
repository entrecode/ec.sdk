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
    this.countProperties();
  }

  get buildID() {
    return <string>this.getProperty('buildID');
  }

  get started() {
    return new Date(this.getProperty('started'));
  }

  get finished() {
    return new Date(this.getProperty('finished'));
  }

  get successful() {
    return <boolean>this.getProperty('successful');
  }

  get buildLocation() {
    return this.getProperty('buildLocation');
  }

  get events() {
    return <Array<any>>this.getProperty('events');
  }
}
