import Resource from '../Resource';
import { fileNegotiate } from '../../helper';
import { environment } from '../ListResource';

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
  assetID: string;
  title: string;
  tags: Array<string>;
  created: Date;
  type: string;
  files: Array<any>;

  /**
   * Creates a new {@link AssetResource}.
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
    this.countProperties();
  }

  /**
   * Best file helper for files.
   *
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getFileUrl(locale: string): string {
    return fileNegotiate(this, false, false, null, locale);
  }

  /**
   * Best file helper for images.
   *
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageUrl(size: number, locale: string): string {
    return fileNegotiate(this, true, false, size, locale);
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageThumbUrl(size: number, locale: string): string {
    return fileNegotiate(this, true, true, size, locale);
  }
}
