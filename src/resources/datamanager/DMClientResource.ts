import Resource from '../Resource';
import { environment } from '../../Core';

interface DMClientResource {
  callbackURL: string,
  clientID: string,
  disableStrategies: Array<string>,
  hexColor: string,
}

/**
 * DMClientResource class
 *
 * @class
 *
 * @prop {string} clientID - name/id of this client.
 * @prop {string} callbackURL - url used for callback requests
 * @prop {{tokenMethod: (query|cookie|body),disableStrategies:
 *   Array<'facebook'|'google'|'password'>}} config - Configuration for this client.
 * @prop {string}        hexColor          - Strategies disabled in this client.
 * @prop {array<String>} disableStrategies - Strategies disabled in this client.
 */
class DMClientResource extends Resource {
  /**
   * Creates a new {@link DMClientResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    Object.defineProperties(this, {
      callbackURL: {
        enumerable: true,
        get: () => <string>this.getProperty('callbackURL'),
        set: (value: string) => this.setProperty('callbackURL', value),
      },
      clientID: {
        enumerable: true,
        get: () => <string>this.getProperty('clientID'),
      },
      disableStrategies: {
        enumerable: true,
        get: () => <Array<string>> this.getProperty('disableStrategies'),
        set: (value: Array<string>) => this.setProperty('disableStrategies', value)
      },
      hexColor: {
        enumerable: true,
        get: () => <string>this.getProperty('hexColor'),
        set: (value: string) => this.setProperty('hexColor', value),
      },
    });
    this.countProperties();
  }
}

export default DMClientResource;
