import { get, optionsToQuery } from '../../helper';
import Resource, { environmentSymbol } from '../Resource';
import BuildList from './BuildList';
import BuildResource from './BuildResource';
import DeploymentList from './DeploymentList';
import DeploymentResource from './DeploymentResource';

/**
 * PlatformResource class
 *
 * @class
 *
 * @prop {string} platformID - the id
 * @prop {string} title - title
 * @prop {any} config - additional config, see schema for format
 * @prop {string} platformType - platform type
 */
export default class PlatformResource extends Resource {
  /**
   * Creates a new {@link PlatformResource}.
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
      platformID: {
        enumerable: true,
        get: () => this.getProperty('platformID'),
      },
      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
      config: {
        enumerable: true,
        get: () => this.getProperty('config'),
        set: (value) => {
          this.setProperty('config', value);
          return value;
        },
      },
      platformType: {
        enumerable: true,
        get: () => this.getProperty('platformType'),
        set: (value) => {
          this.setProperty('platformType', value);
          return value;
        },
      },
    });
  }

  /**
   * Load a {@link BuildList} of {@link BuildResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<BuildList>} resolves to app list with applied filters.
   */
  buildList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};

      if (options) {
        Object.assign(o, options);
      }

      o.platformID = this.platformID;

      if (
        Object.keys(o).length === 2 && 'platformID' in o && 'buildID' in o
        && (typeof o.platformID === 'string' || (!('any' in o.platformID) && !('all' in o.platformID)))
        && (typeof o.buildID === 'string' || (!('any' in o.buildID) && !('all' in o.buildID)))
      ) {
        throw new Error('Cannot filter buildList only by buildID and platformID. Use PlatformResource#build() instead');
      }

      const request = this.newRequest()
      .follow('ec:app/builds/options')
      .withTemplateParameters(optionsToQuery(o, this.getLink('ec:app/builds/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new BuildList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link BuildResource} identified by buildID.
   *
   * @param {string} buildID id of the build.
   * @returns {Promise<BuildResource>} resolves to the build which should be loaded.
   */
  build(buildID) {
    return Promise.resolve()
    .then(() => {
      if (!buildID) {
        throw new Error('buildID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:app/builds/options')
      .withTemplateParameters({ buildID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new BuildResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Get the latest {@link BuildResource} identified by buildID.
   *
   * @param {string} buildID id of the build.
   * @returns {Promise<BuildResource>} resolves to the build which should be loaded.
   */
  latestBuild() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:app/build/latest');
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new BuildResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Load a {@link DeploymentList} of {@link DeploymentResource} filtered by the values specified
   * by the options parameter.
   *
   * @param {filterOptions?} options the filter options.
   * @returns {Promise<DeploymentList>} resolves to app list with applied filters.
   */
  deploymentList(options) {
    return Promise.resolve()
    .then(() => {
      const o = {};

      if (options) {
        Object.assign(o, options);
      }

      o.platformID = this.platformID;

      if (
        Object.keys(o).length === 2 && 'platformID' in o && 'deploymentID' in o
        && (typeof o.platformID === 'string' || (!('any' in o.platformID) && !('all' in o.platformID)))
        && (typeof o.deploymentID === 'string' || (!('any' in o.deploymentID) && !('all' in o.deploymentID)))
      ) {
        throw new Error('Cannot filter deploymentList only by deploymentID and platformID. Use PlatformResource#deployment() instead');
      }

      const request = this.newRequest()
      .follow('ec:app/deployments/options')
      .withTemplateParameters(optionsToQuery(o, this.getLink('ec:app/deployments/options').href));
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeploymentList(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a single {@link DeploymentResource} identified by deploymentID.
   *
   * @param {string} deploymentID id of the deployment.
   * @returns {Promise<DeploymentResource>} resolves to the deployment which should be loaded.
   */
  deployment(deploymentID) {
    return Promise.resolve()
    .then(() => {
      if (!deploymentID) {
        throw new Error('deploymentID must be defined');
      }
      const request = this.newRequest()
      .follow('ec:app/deployments/options')
      .withTemplateParameters({ deploymentID });
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeploymentResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Get the latest {@link DeploymentResource} identified by deploymentID.
   *
   * @param {string} deploymentID id of the deployment.
   * @returns {Promise<DeploymentResource>} resolves to the deployment which should be loaded.
   */
  latestDeployment() {
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest()
      .follow('ec:app/deployment/latest');
      return get(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeploymentResource(res, this[environmentSymbol], traversal));
  }
}
