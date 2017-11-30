import Resource from '../Resource';
import { fileNegotiate } from '../../helper';
import { environment } from '../../Core';

interface AssetResource {
  assetID: string,
  created: Date,
  files: Array<any>,
  tags: Array<string>,
  title: string,
  type: string,
}

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
class AssetResource extends Resource {
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
        get: () => <string>this.getProperty('assetID'),
      },
      created: {
        enumerable: true,
        get: () => new Date(this.getProperty('created')),
      },
      files: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('files'),
      },
      tags: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('tags'),
        set: (value: Array<string>) => this.setProperty('tags', value),
      },
      title: {
        enumerable: true,
        get: () => <string>this.getProperty('title'),
        set: (value: string) => this.setProperty('title', value),
      },
      type: {
        enumerable: true,
        get: () => <string>this.getProperty('type'),
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
   * Best file helper for image thumbnails.
   *
   * @param {number?} size - the minimum size of the image
   * @param {string?} locale - the locale
   * @returns {string} URL to the file
   */
  getImageThumbUrl(size: number, locale: string): string {
    return fileNegotiate(this, true, true, size, locale);
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
   * Returns the original file from files array. This is useful if you want to show the original
   * image for an asset.
   *
   * @returns {any} The original file object
   */
  getOriginalFile(): any {
    if (this.type !== 'image') {
      return this.files[0];
    }

    const files = this.files.filter(f => !!f.resolution);
    if (files.length === 0) {
      return this.files[0];
    }

    files.sort((l, r) => { // sort by size descending
      const leftMax = Math.max(l.resolution.height, l.resolution.width);
      const rightMax = Math.max(r.resolution.height, r.resolution.width);
      if (leftMax < rightMax) {
        return 1;
      } else if (leftMax > rightMax) {
        return -1;
      } else {
        return 0;
      }
    });

    return files[0];
  }
}

export default AssetResource;
