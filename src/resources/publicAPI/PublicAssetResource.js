import Resource, { environmentSymbol, resourceSymbol } from '../Resource';
import { fileNegotiate, superagentGet } from '../../helper';
import halfred from 'halfred';

const resolvedSymbol = Symbol('resolved');

/**
 * PublicAssetResource class. PublicAssetResources can be obtained via two methods. Either by
 * loading a Asset resource directly or by accessing it via an Entry which was not loaded with
 * levels (nested). The latter one does not contain the tags property since it was created with the
 * embedded version of this asset.
 *
 * @class
 *
 * @prop {string}        tokenID - The id of this asset
 * @prop {string}        title   - The title of this asset
 * @prop {array<string>} tags    - array of tags
 * @prop {Date}          created - Timestamp when this asset was created
 * @prop {string}        type    - type of this asset, like image
 * @prop {array<object>} files   - all files associated with this asset
 *
 * @prop {boolean} isResolved - whether or not this asset is resolved
 */
export default class PublicAssetResource extends Resource {
  /**
   * Creates a new {@link PublicAssetResource}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);

    this[resolvedSymbol] = 'tags' in this[resourceSymbol];

    Object.defineProperties(this, {
      isResolved: {
        enumerable: false,
        get: () => this[resolvedSymbol],
      },
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
    if (this.isResolved) {
      Object.defineProperty(this, 'tags', {
        enumerable: true,
        get: () => this.getProperty('tags'),
        set: (value) => {
          this.setProperty('tags', value);
          return value;
        },
      });
    }
    this.countProperties();
  }

  /**
   * Saves this {@link PublicAssetResource}. Only works on resolved PublicAssetResource.
   *
   * @param {string?} overwriteSchemaUrl Other schema url to overwrite the one in
   *   `_link.self.profile`. Mainly for internal use.
   * @returns {Promise<PublicAssetResource>} Promise will resolve to the saved Resource. Will
   *   be the same object but with refreshed data.
   */
  save(overwriteSchemaUrl) {
    if (!this.isResolved) {
      throw new Error('Cannot save not resolved PublicAssetResource');
    }
    super.save();
  }

  /**
   * In order to resolve this {@link PublicAssetResource} call this
   * function. A promise is returned which resolves to the {@link PublicAssetResource}.
   *
   * @returns {Promise<PublicAssetResource>} Promise resolving to {@link PublicAssetResource}.
   */
  resolve() {
    if (this.isResolved) {
      return Promise.resolve(this);
    }
    return superagentGet(this.getLink('self').href, { Accept: 'application/json' }, this[environmentSymbol])
    .then(resource => {
      this[resourceSymbol] = halfred.parse(resource);
      this[resolvedSymbol] = true;

      Object.defineProperty(this, 'tags', {
        enumerable: true,
        get: () => this.getProperty('tags'),
        set: (value) => {
          this.setProperty('tags', value);
          return value;
        },
      });
      this.countProperties();

      return this;
    });
  }

  /**
   * Best file helper for files.
   *
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getFileUrl(locale) {
    return fileNegotiate(this, false, false, null, locale);
  }

  /**
   * Best file helper for images.
   *
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageUrl(size, locale) {
    return fileNegotiate(this, true, false, size, locale);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageThumbUrl(size, locale) {
    return fileNegotiate(this, true, true, size, locale);
  }
}
