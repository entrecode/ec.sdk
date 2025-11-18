/**
 * You can define which API should be used with the environment parameter. Internally this is also
 * used as key to store tokens into cookies (for browsers).
 *
 * Valid value is one of `live`, `stage`, `nightly`, or `develop`.
 *
 * @example
 * // will connect to production https://editor.entrecode.de
 * const session = new Session('live');
 * // will connect to cachena https://editor.cachena.entrecode.de
 * const accounts = new Accounts('stage');
 * // will connect to buffalo https://editor.buffalo.entrecode.de
 * const dataManager = new DataManager('nightly');
 * // will connect to your local instances, well maybe
 * const accounts = new Accounts('develop');
 *
 * @typedef { 'live' | 'stage' | 'nightly' | 'develop'} environment
 */
export type environment = 'live' | 'stage' | 'nightly' | 'develop';

/**
 * In node context it is advised to configure token handling more specifically. Normally ec.sdk will share
 * a given token with other API Connectors (see {@link Core}), in most cases this is not desired in node
 * scripts. By providing an options object instead of an {@link environment} string when creating the API
 * Conenctor you can overwrite the handling.
 *
 * @example
 * // will not share any token with other API connectors (token name is appended with a generated shortID)
 * new PublicAPI('beefbeef', { noCookie: true });
 *
 * // will share token with all `userA` PublicAPI Connectors for 'beefbeef'
 * new PublicAPI('beefbeef', { cookieModifier: 'userA' });
 *
 * // will share token with all `userA` API Connectors, even DataManager and so on
 * new PublicAPI('beefbeef', { cookieModifier: 'userA', ecUser: true });
 * // same
 * new PublicAPI('beefbeef', { cookieModifier: 'userA' }, true);
 *
 * // will share token with all PublicAPI Connectors for 'beefbeef'
 * new PublicAPI('beefbeef')
 *
 * // will share token with all API connectors
 * new PublicAPI('beefbeef', { ecUser: true });
 * // same
 * new PublicAPI('beefbeef', 'live', true);
 *
 * @typedef {Object} options
 * @property {environment} environment The environment for the API Connector
 * @property {boolean} noCookie True if you want to token-handling disabled (will overwrite Tokenstore name with random string)
 * @property {string} cookieModifier Define a string for sharing multiple tokens.
 * @property {boolean} ecUser True if the user is a ecUser. PublicAPI API Connectors will share across all shortIDs.
 */
export type options = { environment?: environment; noCookie?: boolean; cookieModifier?: string; ecUser?: boolean };
