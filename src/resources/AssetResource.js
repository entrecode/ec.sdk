import Resource from './Resource';

/**
 * AssetResource class
 *
 * @class
 *
 * @prop {string}        tokenID - The id of this asset
 * @prop {string}        title   - The title of this asset
 * @prop {array<string>} tags    - array of tags
 * @prop {Date}          created - Timestamp when this asset was created
 * @prop {string}        type    - type of this asset, like image
 * @prop {array<object>} files   - all files associated with this asset
 */
export default class AssetResource extends Resource {
  /**
   * Creates a new {@link AssetResource}.
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
      assetID: {
        enumerable: true,
        get: () => this.getProperty('assetID'),
      },

      title: {
        enumerable: true,
        get: () => this.getProperty('title'),
        set: (value) => {
          this.setProperty('title', value);
          return value;
        },
      },
      tags: {
        enumerable: true,
        get: () => this.getProperty('tags'),
        set: (value) => {
          this.setProperty('tags', value);
          return value;
        },
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      type: {
        enumerable: true,
        get: () => this.getProperty('type'),
      },
      files: {
        enumerable: true,
        get: () => this.getProperty('files'),
      },
    });
  }

  // TODO get best file
}
