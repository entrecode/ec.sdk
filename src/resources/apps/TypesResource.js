import Resource from '../Resource';

/**
 * TypesResource class
 *
 * @class
 *
 */
export default class TypesResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
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
      platformTypes: {
        enumerable: true,
        get: () => this.getProperty('platformTypes'),
      },
      codeSourceTypes: {
        enumerable: true,
        get: () => this.getProperty('codeSourceTypes'),
      },
      dataSourceTypes: {
        enumerable: true,
        get: () => this.getProperty('dataSourceTypes'),
      },
      targetTypes: {
        enumerable: true,
        get: () => this.getProperty('targetTypes'),
      },
    });
    this.countProperties();
  }

  /**
   * Get a plugin by plugin name and type.
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @param {string} type The type of the plugin
   * @returns {object|undefined} plugin if found, undefined otherwise
   */
  getPlugin(pluginName, type) {
    if (!this[`${pluginName}Types`]) {
      return undefined;
    }
    return this[`${pluginName}Types`].find(p => p.type === type);
  }

  /**
   * Get a platform plugin by type.
   *
   * @param {string} type The type of the platform
   * @returns {object|undefined} platform if found, undefined otherwise
   */
  getPlatform(type) {
    return this.getPlugin('platform', type);
  }

  /**
   * Get a code source plugin by type.
   *
   * @param {string} type The type of the code source
   * @returns {object|undefined} code source if found, undefined otherwise
   */
  getCodeSource(type) {
    return this.getPlugin('codeSource', type);
  }

  /**
   * Get a data source plugin by type.
   *
   * @param {string} type The type of the data source
   * @returns {object|undefined} data source if found, undefined otherwise
   */
  getDataSource(type) {
    return this.getPlugin('dataSource', type);
  }

  /**
   * Get a target plugin by type.
   *
   * @param {string} type The type of the target
   * @returns {object|undefined} target if found, undefined otherwise
   */
  getTarget(type) {
    return this.getPlugin('target', type);
  }

  /**
   * Get a plugin schema by plugin name and type.
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @param {string} type The type of the plugin
   * @returns {object|undefined} plugin schema if found, undefined otherwise
   */
  getPluginSchema(pluginName, type) {
    const plugin = this.getPlugin(pluginName, type);
    if (!plugin) {
      return undefined;
    }
    return plugin.configSchema;
  }

  /**
   * Get a platform schema by type.
   *
   * @param {string} type The type of the platform
   * @returns {object|undefined} platform schema if found, undefined otherwise
   */
  getPlatformSchema(type) {
    return this.getPluginSchema('platform', type);
  }

  /**
   * Get a code source schema by type.
   *
   * @param {string} type The type of the code source
   * @returns {object|undefined} code source schema if found, undefined otherwise
   */
  getCodeSourceSchema(type) {
    return this.getPluginSchema('codeSource', type);
  }

  /**
   * Get a data source schema by type.
   *
   * @param {string} type The type of the data source
   * @returns {object|undefined} data source schema if found, undefined otherwise
   */
  getDataSourceSchema(type) {
    return this.getPluginSchema('dataSource', type);
  }

  /**
   * Get a target schema by type.
   *
   * @param {string} type The type of the target
   * @returns {object|undefined} target schema if found, undefined otherwise
   */
  getTargetSchema(type) {
    return this.getPluginSchema('target', type);
  }

  /**
   * Get an Array of available plugins for a given plugin name
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @returns {Array<string>} Array of available plugin types
   */
  getAvailableTypes(pluginName) {
    if (!this[`${pluginName}Types`]) {
      return [];
    }
    return this[`${pluginName}Types`].map(p => p.type);
  }

  /**
   * Get an Array of available types for platforms
   *
   * @returns {Array<string>} Array of available platform types
   */
  getAvailablePlatforms() {
    return this.getAvailableTypes('platform');
  }

  /**
   * Get an Array of available types for code sources
   *
   * @returns {Array<string>} Array of available code source types
   */
  getAvailableCodeSources() {
    return this.getAvailableTypes('codeSource');
  }

  /**
   * Get an Array of available types for data sources
   *
   * @returns {Array<string>} Array of available data source types
   */
  getAvailableDataSource() {
    return this.getAvailableTypes('dataSource');
  }

  /**
   * Get an Array of available types for targets
   *
   * @returns {Array<string>} Array of available target types
   */
  getAvailableTargets() {
    return this.getAvailableTypes('target');
  }
}
