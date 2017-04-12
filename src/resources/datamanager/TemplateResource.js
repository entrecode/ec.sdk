import Resource from '../Resource';

/**
 * Template resource class
 *
 * @class
 *
 * @prop {string} roleID - The id of the template
 * @prop {string} name - The name of the template
 * @prop {object} collection - Postman collection
 * @prop {object} dataSchema - JSON schema for collection data
 * @prop {string} version - version of the tempalte
 */
export default class TemplateResource extends Resource {
  /**
   * Creates a new {@link TemplateResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    Object.defineProperties(this, {
      templateID: {
        enumerable: true,
        get: () => this.getProperty('templateID'),
      },
      name: {
        enumerable: true,
        get: () => this.getProperty('name'),
      },
      collection: {
        enumerable: true,
        get: () => this.getProperty('collection'),
      },
      dataSchema: {
        enumerable: true,
        get: () => this.getProperty('dataSchema'),
      },
      version: {
        enumerable: true,
        get: () => this.getProperty('version'),
      },
    });
  }
}
