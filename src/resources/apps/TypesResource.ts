import Resource from '../Resource';
import { environment } from '../../types';

interface TypesResource {
  codeSourceTypes: Array<string>;
  dataSourceTypes: Array<string>;
  platformTypes: Array<string>;
  targetTypes: Array<string>;
}

/**
 * TypesResource class
 *
 * @class
 *
 */
class TypesResource extends Resource {
  /**
   * Creates a new {@link AppResource}.
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
      codeSourceTypes: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('codeSourceTypes'),
      },
      dataSourceTypes: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('dataSourceTypes'),
      },
      platformTypes: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('platformTypes'),
      },
      targetTypes: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('targetTypes'),
      },
    });
    this.countProperties();
  }

  /**
   * Get an Array of available types for code sources
   *
   * @returns {Array<string>} Array of available code source types
   */
  getAvailableCodeSources(): Array<string> {
    return this.getAvailableTypes('codeSource');
  }

  /**
   * Get an Array of available types for data sources
   *
   * @returns {Array<string>} Array of available data source types
   */
  getAvailableDataSources(): Array<string> {
    return this.getAvailableTypes('dataSource');
  }

  /**
   * Get an Array of available types for platforms
   *
   * @returns {Array<string>} Array of available platform types
   */
  getAvailablePlatforms(): Array<string> {
    return this.getAvailableTypes('platform');
  }

  /**
   * Get an Array of available types for targets
   *
   * @returns {Array<string>} Array of available target types
   */
  getAvailableTargets(): Array<string> {
    return this.getAvailableTypes('target');
  }

  /**
   * Get an Array of available plugins for a given plugin name
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @returns {Array<string>} Array of available plugin types
   */
  getAvailableTypes(pluginName: string): Array<string> {
    if (!this[`${pluginName}Types`]) {
      return [];
    }
    return this[`${pluginName}Types`].map((p) => p.type);
  }

  /**
   * Get a code source plugin by type.
   *
   * @param {string} type The type of the code source
   * @returns {object|undefined} code source if found, undefined otherwise
   */
  getCodeSource(type: string): any {
    return this.getPlugin('codeSource', type);
  }

  /**
   * Get a code source schema by type.
   *
   * @param {string} type The type of the code source
   * @returns {object|undefined} code source schema if found, undefined otherwise
   */
  getCodeSourceSchema(type: string): any {
    return this.getPluginSchema('codeSource', type);
  }

  /**
   * Get a data source plugin by type.
   *
   * @param {string} type The type of the data source
   * @returns {object|undefined} data source if found, undefined otherwise
   */
  getDataSource(type: string): any {
    return this.getPlugin('dataSource', type);
  }

  /**
   * Get a data source schema by type.
   *
   * @param {string} type The type of the data source
   * @returns {object|undefined} data source schema if found, undefined otherwise
   */
  getDataSourceSchema(type: string): any {
    return this.getPluginSchema('dataSource', type);
  }

  /**
   * Get a platform plugin by type.
   *
   * @param {string} type The type of the platform
   * @returns {object|undefined} platform if found, undefined otherwise
   */
  getPlatform(type: string): any {
    return this.getPlugin('platform', type);
  }

  /**
   * Get a platform schema by type.
   *
   * @param {string} type The type of the platform
   * @returns {object|undefined} platform schema if found, undefined otherwise
   */
  getPlatformSchema(type: string): any {
    return this.getPluginSchema('platform', type);
  }

  /**
   * Get a plugin by plugin name and type.
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @param {string} type The type of the plugin
   * @returns {object|undefined} plugin if found, undefined otherwise
   */
  getPlugin(pluginName: string, type: string): any {
    if (!this[`${pluginName}Types`]) {
      return undefined;
    }
    return this[`${pluginName}Types`].find((p) => p.type === type);
  }

  /**
   * Get a plugin schema by plugin name and type.
   *
   * @param {string} pluginName Plugin name (platform, codeSource, dataSource, target)
   * @param {string} type The type of the plugin
   * @returns {object|undefined} plugin schema if found, undefined otherwise
   */
  getPluginSchema(pluginName: string, type: string): any {
    const plugin = this.getPlugin(pluginName, type);
    if (!plugin) {
      return undefined;
    }
    return plugin.configSchema;
  }

  /**
   * Get a target plugin by type.
   *
   * @param {string} type The type of the target
   * @returns {object|undefined} target if found, undefined otherwise
   */
  getTarget(type: string): any {
    return this.getPlugin('target', type);
  }

  /**
   * Get a target schema by type.
   *
   * @param {string} type The type of the target
   * @returns {object|undefined} target schema if found, undefined otherwise
   */
  getTargetSchema(type: string): any {
    return this.getPluginSchema('target', type);
  }
}

export default TypesResource;
