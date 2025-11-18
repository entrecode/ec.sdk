import Resource from '../Resource';
import { environment } from '../../types';

interface FederatedOIDC {
  /** The URI to the provider's OpenID Connect configuration (/.well-known/openid-configuration) */
  uri: string;
  /** The text to display on the button */
  button: string;
  /** The client ID as configured in the provider's client registration */
  clientID: string;
  /** The client secret as configured in the provider's client registration. Optional if secret is generated on the fly (e.g. for Apple) */
  clientSecret?: string;
  /** The scope(s) to request from the provider. May be required for the provider to return a valid email address in the id token response. */
  scope?: string;
  /** The response type to use for the authorization code. Defaults to 'code' if not specified. */
  responseType?: string;
  /** The response mode to use for the authorization code. Defaults to 'query' if not specified. 'form_post' is recommended for Apple. */
  responseMode?: 'form_post' | 'fragment' | 'query';
  /** The Apple team ID. Required for Apple to generate client secret on the fly. */
  appleTeamID?: string;
  /** The Apple key ID. Required for Apple to generate client secret on the fly. */
  appleKeyID?: string;
  /** The Apple private key. Required for Apple to generate client secret on the fly. */
  appleKey?: string;
}

interface DMClientResource {
  callbackURL: string;
  clientID: string;
  tokenMethod: Array<string>;
  grantTypes: Array<string>;
  disableStrategies: Array<string>;
  hexColor: string;
  federatedOIDC?: Array<FederatedOIDC>;
}

/**
 * DMClientResource class
 *
 * @class
 *
 * @prop {string} clientID - name/id of this client.
 * @prop {string} callbackURL - url used for callback requests.
 * @prop {Array<string>} tokenMethod - list of available token methods.
 * @prop {Array<string>} grantTypes - list of available token methods.
 * @prop {array<String>} disableStrategies - Strategies disabled in this client.
 * @prop {string} hexColor - hex color for this client.
 * @prop {Array<FederatedOIDC>} federatedOIDC - list of federated OIDC providers.
 */
class DMClientResource extends Resource {
  /**
   * Creates a new {@link DMClientResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} env the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, env: environment, traversal?: any) {
    super(resource, env, traversal);
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
      tokenMethod: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('tokenMethod'),
        set: (value: Array<string>) => this.setProperty('tokenMethod', value),
      },
      grantTypes: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('grantTypes'),
        set: (value: Array<string>) => this.setProperty('grantTypes', value),
      },
      disableStrategies: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('disableStrategies'),
        set: (value: Array<string>) => this.setProperty('disableStrategies', value),
      },
      hexColor: {
        enumerable: true,
        get: () => <string>this.getProperty('hexColor'),
        set: (value: string) => this.setProperty('hexColor', value),
      },
      federatedOIDC: {
        enumerable: true,
        get: () => <Array<FederatedOIDC>>this.getProperty('federatedOIDC'),
        set: (value: Array<FederatedOIDC>) => this.setProperty('federatedOIDC', value),
      },
    });
    this.countProperties();
  }
}

export default DMClientResource;
