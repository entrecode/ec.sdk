import Resource from '../Resource';
import { environment } from '../../Core';
import { get } from '../../helper';

const environmentSymbol: any = Symbol.for('environment');

interface DMAssetResource {
  assetID: string;
  caption: string;
  created: Date;
  creator: string;
  creatorType: string;
  duplicates: number;
  file: any;
  fileVariants: Array<any>;
  isUsed: boolean;
  mimetype: string;
  modified: Date;
  tags: Array<string>;
  thumbnails: Array<any>;
  title: string;
  type: string;
  assetGroupID: string;
}

/**
 * DMAssetResource class
 *
 * @class
 *
 * @prop {string} assetID - The id of this asset
 * @prop {string} title - The title of this asset
 * @prop {string} type - The type of this asset
 * @prop {string} assetGroupID - The assetGroupID this asset belongs to
 * @prop {string} caption - The caption of this asset
 * @prop {Date} created - The creation Date
 * @prop {Date} modified - Date on which the asset got modified
 * @prop {string} creator - The user who created this asset
 * @prop {string} creatorType - The type of user the creator is of
 * @prop {number} duplicates - The total number of duplicate assets
 * @prop {object} file - Object describing the original file of this asset
 * @prop {Array<object>} fileVariants - Array of all other file variants (not thumbs)
 * @prop {Array<object>} thumbnails - Array of all thumbnails
 * @prop {Boolean} isUsed - Whether or not this asses is used in any entry
 * @prop {string} mimetype - Mimetype of the assets file
 * @prop {Array<string>} tags - Array of tags
 */
class DMAssetResource extends Resource {
  /**
   * Creates a new {@link DMAssetResource}.
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
      caption: {
        enumerable: true,
        get: () => <string>this.getProperty('caption'),
        set: (value: string) => {
          this.setProperty('caption', value);
        },
      },
      created: {
        enumerable: true,
        get: () => {
          const date = this.getProperty('created');
          if (!date) {
            return date;
          }
          return new Date(date);
        },
      },
      creator: {
        enumerable: true,
        get: () => <string>this.getProperty('creator'),
      },
      creatorType: {
        enumerable: true,
        get: () => <string>this.getProperty('creatorType'),
      },
      duplicates: {
        enumerable: true,
        get: () => <number>this.getProperty('duplicates'),
      },
      file: {
        enumerable: true,
        get: () => <any>this.getProperty('file'),
      },
      fileVariants: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('fileVariants'),
      },
      isUsed: {
        enumerable: true,
        get: () => <Boolean>this.getProperty('isUsed'),
      },
      mimetype: {
        enumerable: true,
        get: () => <string>this.getProperty('mimetype'),
      },
      modified: {
        enumerable: true,
        get: () => {
          const date = this.getProperty('modified');
          if (!date) {
            return date;
          }
          return new Date(date);
        },
      },
      tags: {
        enumerable: true,
        get: () => <Array<string>>this.getProperty('tags'),
        set: (value: Array<string>) => this.setProperty('tags', value),
      },
      thumbnails: {
        enumerable: true,
        get: () => <Array<any>>this.getProperty('thumbnails'),
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
      assetGroupID: {
        enumerable: false,
        get: () => {
          const result = /\/a\/[a-f0-9]{8}\/(\w+)\//.exec(this.getLink('self').href);
          if (result) {
            return <string>result[1];
          }
        },
      },
    });
    this.countProperties();
  }

  /**
   * Best file helper for files.
   *
   * @returns {string} URL to the file
   */
  getFileUrl(): string {
    return this.getLink('ec:dm-asset/file').href;
  }

  /**
   * Generic file helper for images and thumbnails.
   *
   * @param {number} size - the minimum size of the image
   * @param {boolean} thumb - true when image should be a thumbnail
   * @returns {Promise<string>} the url string of the requested image
   */
  getFileVariant(size?: number, thumb: boolean = false): Promise<string> {
    return Promise.resolve().then(async () => {
      if (!size && !thumb) {
        return this.file.url;
      }

      if (!thumb && !this.file.resolution) {
        return this.file.url;
      }

      if (!thumb && this.file.resolution) {
        const biggestDimension = Math.max(this.file.resolution.width, this.file.resolution.height);
        if (!size || biggestDimension <= size) {
          return this.file.url;
        }
      }

      let file;
      if (thumb) {
        file = this.thumbnails.find((t) => t.dimension === size);
      } else {
        file = this.fileVariants.find((v) => Math.max(v.resolution.width, v.resolution.height) === size);
      }
      if (file) {
        return file.url;
      }

      let request;
      if (thumb) {
        request = await this.follow('ec:dm-asset/thumbnail');
      } else {
        request = await this.follow('ec:dm-asset/file-variant');
      }
      const templateParams: any = {};
      if (size) {
        templateParams.size = size;
      }
      request.withTemplateParameters(templateParams);
      return get(this[environmentSymbol], request).then(([res]) => {
        return res.url;
      });
    });
  }

  /**
   * Best file helper for image thumbnails.
   *
   * @param {number?} size - the minimum size of the image
   * @returns {Promise<string>} URL to the file
   */
  getImageThumbUrl(size?: number): Promise<string> {
    return this.getFileVariant(size, true);
  }

  /**
   * Best file helper for images.
   *
   * @param {number?} size - the minimum size of the image
   * @returns {Promise<string>} URL to the file
   */
  getImageUrl(size?: number): Promise<string> {
    return this.getFileVariant(size);
  }

  /**
   * Returns the original file from files array. This is useful if you want to show the original
   * image for an asset.
   *
   * @returns {any} The original file object
   */
  getOriginalFile(): any {
    return this.file;
  }
}

export default DMAssetResource;
