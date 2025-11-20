import Resource from '../Resource';
import { environment } from '../../types';

export type clientConfig = {
  tokenMethod: 'query' | 'cookie' | 'body';
  disableStrategies: Array<'facebook' | 'google' | 'password'>;
};

export type clientType = 'Public Client' | 'Private Client' | 'API Client' | 'Legacy Client' | 'Unknown Client';
export type clientGrantType = 'authorization_code' | 'refresh_token' | 'client_credentials';
export type clientTokenEndpointAuthMethod = 'client_secret_basic' | 'none';

interface ClientResource {
  clientID: string;
  created: Date;
  modified: Date;
  clientName: string;
  clientType: clientType | null;
  grantTypes: Array<clientGrantType>;
  tokenEndpointAuthMethod: clientTokenEndpointAuthMethod;
  clientSecret: string | null;
  redirectURIs: Array<string>;
  postLogoutRedirectURIs: Array<string>;
  authUIOrigin: string | null;
  logoURI: string | null;
  /**
   * @deprecated callbackURL is only for legacy clients
   */
  callbackURL: string;
  /**
   * @deprecated config is currently only used for legacy clients
   */
  config: clientConfig;
}

/**
 * ClientResource class
 *
 * @class
 *
 * @prop {string} clientID      - The id of the client
 * @prop {Date}   created       - The {@link Date} on which this client was created, is set on creation
 * @prop {Date}   modified      - The {@link Date} on which this client was last modified, is set on updates
 * @prop {string} clientName    - The name of the client (human readable)
 * @prop {('Public Client' | 'Private Client' | 'API Client' | 'Legacy Client' | 'Unknown Client')} clientType    - The type of the client, computed depending on settings
 * @prop {Array<('authorization_code' | 'refresh_token' | 'client_credentials')>} grantTypes - The grant types of the client
 * @prop {('client_secret_basic' | 'none')} tokenEndpointAuthMethod - The token endpoint authentication method of the client
 * @prop {string} clientSecret  - The client secret - set only if grantTypes contains 'client_credentials'
 * @prop {Array<string>} redirectURIs - The redirect URIs of the client
 * @prop {Array<string>} postLogoutRedirectURIs - The post logout redirect URIs of the client
 * @prop {string} authUIOrigin  - The auth UI origin of the client
 * @prop {string} logoURI       - The logo URI of the client
 * @prop {string} callbackURL   - The legacy client callback URL
 * @prop {clientConfig} config  - The legacy client config
 */
class ClientResource extends Resource {
  /**
   * Creates a new {@link ClientResource}.
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
      clientID: {
        enumerable: true,
        get: () => <string>this.getProperty('clientID'),
      },
      created: {
        enumerable: true,
        get: () => <Date>this.getProperty('created'),
      },
      modified: {
        enumerable: true,
        get: () => <Date>this.getProperty('modified'),
      },
      clientName: {
        enumerable: true,
        get: () => <string>this.getProperty('clientName'),
        set: (value: string) => this.setProperty('clientName', value),
      },
      clientType: {
        enumerable: true,
        get: () => <clientType>this.getProperty('clientType'),
      },
      grantTypes: {
        enumerable: true,
        get: () => <Array<clientGrantType>>this.getProperty('grantTypes'),
        set: (value: Array<clientGrantType>) => this.setProperty('grantTypes', value),
      },
      tokenEndpointAuthMethod: {
        enumerable: true,
        get: () => <clientTokenEndpointAuthMethod>this.getProperty('tokenEndpointAuthMethod'),
        set: (value: clientTokenEndpointAuthMethod) => this.setProperty('tokenEndpointAuthMethod', value),
      },
      clientSecret: {
        enumerable: true,
        get: () => <string>this.getProperty('clientSecret'),
        set: (value: string) => this.setProperty('clientSecret', value),
      },
      redirectURIs: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('redirectURIs'),
        set: (value: Array<string>) => this.setProperty('redirectURIs', value),
      },
      postLogoutRedirectURIs: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('postLogoutRedirectURIs'),
        set: (value: Array<string>) => this.setProperty('postLogoutRedirectURIs', value),
      },
      authUIOrigin: {
        enumerable: true,
        get: () => <string>this.getProperty('authUIOrigin'),
        set: (value: string) => this.setProperty('authUIOrigin', value),
      },
      logoURI: {
        enumerable: true,
        get: () => <string>this.getProperty('logoURI'),
        set: (value: string) => this.setProperty('logoURI', value),
      },
      callbackURL: {
        enumerable: true,
        get: () => <string>this.getProperty('callbackURL'),
        set: (value: string) => this.setProperty('callbackURL', value),
      },
      config: {
        enumerable: true,
        get: () => <clientConfig>this.getProperty('config'),
        set: (value: clientConfig) => this.setProperty('config', value),
      },
    });
    this.countProperties();
  }
}

export default ClientResource;

/**
 * Configuration of a legacy client
 *
 * @typedef {Object} clientConfig
 * @property {string} tokenMethod Enum('query'|'cookie'|'body')
 * @property {Array<string>} disableStrategies Array<Enum('facebook'|'google'|'password')>
 */
