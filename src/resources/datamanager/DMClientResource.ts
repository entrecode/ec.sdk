import Resource from '../Resource';
import { environment } from '../../Core';

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
export default class DMClientResource extends Resource {
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
    this.countProperties();
  }

  get callbackURL() {
    return <string>this.getProperty('callbackURL')
  };

  set callbackURL(value: string) {
    this.setProperty('callbackURL', value);
  }

  get clientID() {
    return <string>this.getProperty('clientID')
  };

  get disableStrategies() {
    return <Array<string>>this.getProperty('disableStrategies')
  };

  set disableStrategies(value: Array<string>) {
    this.setProperty('disableStrategies', value);
  }

  get hexColor() {
    return <string>this.getProperty('hexColor')
  };

  set hexColor(value: string) {
    this.setProperty('hexColor', value);
  }
}
