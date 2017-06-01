import querystring from 'querystring';
import traverson from 'traverson';
import traversonHal from 'traverson-hal';

import { get, optionsToQuery, post } from '../../helper';
import Resource, { environmentSymbol, resourceSymbol } from '../Resource';
import BuildList from './BuildList';
import BuildResource from './BuildResource';
import DeploymentList from './DeploymentList';
import DeploymentResource from './DeploymentResource';
import CodeSourceResource from './CodeSourceResource';
import DataSourceResource from './DataSourceResource';
import TargetList from './TargetList';
import TargetResource from './TargetResource';

traverson.registerMediaType(traversonHal.mediaType, traversonHal);

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
   * Start a new build for this platform.
   *
   * @returns {Promise<BuildResource>} The created build, probably in running state.
   */
  createBuild() {
    return post(this[environmentSymbol], this.newRequest().follow('ec:app/builds'))
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
   * Start a new deployment for this platform.
   *
   * @param {targetIDsInput} targetIDs targets to which the build should be deployed.
   * @param {buildIDInput} buildID build which should be deployed.
   * @returns {Promise<DeploymentResource>} The created deployment, probably in running state.
   */
  createDeployment(targetIDs, buildID) {
    return Promise.resolve()
    .then(() => {
      if (!buildID) {
        throw new Error('Must specify build to deploy');
      }
      if (buildID instanceof BuildResource) {
        buildID = buildID.buildID;
      }
      if (!targetIDs) {
        throw new Error('Must specify targets to deploy to');
      }
      if (targetIDs instanceof TargetList) {
        targetIDs = targetIDs.getAllItems();
      } else if (!Array.isArray(targetIDs)) {
        targetIDs = [targetIDs];
      }

      targetIDs = targetIDs.map(target => target instanceof TargetResource ? target.targetID : target);

      const request = this.newRequest()
      .follow('ec:app/deployments')
      .withTemplateParameters({
        platformID: this.platformID,
        buildID,
        targetID: targetIDs.join(','),
      });

      return post(this[environmentSymbol], request);
    })
    .then(([res, traversal]) => new DeploymentResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Start a new deployment of the latest build for this platform.
   *
   * @param {targetIDsInput} targetIDs targets to which the build should be deployed.
   * @returns {Promise<DeploymentResource>} The created deployment, probably in running state.
   */
  deployLatestBuild(targetIDs) {
    return Promise.resolve()
    .then(() => {
      const link = this.getLink('ec:app/build/latest');
      if (!link) {
        throw Error('No latest build found');
      }
      const buildID = querystring.parse(link.href.split('?')[1]).buildID;

      return this.createDeployment(targetIDs, buildID);
    });
  }

  /**
   * Get the latest {@link DeploymentResource} identified by deploymentID.
   *
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

  /**
   * Get the {@link CodeSourceResource} of this platform.
   *
   * @returns {Promise<CodeSourceResource>} resolves to the codeSource
   */
  codeSource() {
    return get(this[environmentSymbol], this.newRequest().follow('ec:app/codesource'))
    .then(([res, traversal]) => new CodeSourceResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Get the {@link DataSourceResource} of this platform.
   *
   * @returns {Promise<DataSourceResource>} resolves to the datasource
   */
  dataSource() {
    return get(this[environmentSymbol], this.newRequest().follow('ec:app/datasource'))
    .then(([res, traversal]) => new DataSourceResource(res, this[environmentSymbol], traversal));
  }

  /**
   * Get a {@link TargetList} of this platform with all assigned {@link TargetResource}s.
   *
   * @returns {Promise<TargetList>} resolves to the list of assigned targets
   */
  targets() {
    return Promise.resolve()
    .then(() => {
      const link = this.getLink('ec:app/target');
      const split = link.href.split('?');
      const qs = querystring.parse(split[1]);
      qs.targetID = this[resourceSymbol].linkArray('ec:app/target')
      .map(l => querystring.parse(l.href.split('?')[1]).targetID)
      .join(',');

      return get(this[environmentSymbol], traverson.from(`${split[0]}?${querystring.stringify(qs)}`).jsonHal());
    })
    .then(([res, traversal]) => new TargetList(res, this[environmentSymbol], traversal));
  }

  // TODO getter setter plugins
}

/**
 * @typedef {string|Array<string>|TargetResource|Array<TargetResource>|TargetList} targetIDsInput
 * @access private
 */

/**
 * @typedef {string|BuildResource} buildIDInput
 * @access private
 */
