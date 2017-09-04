import Resource from '../Resource';
import { fileNegotiate } from '../../helper';
import { environment } from '../../Core';

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
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal);
    this.countProperties();
  }

  get assetID() {
    return <string>this.getProperty('assetID');
  }

  get created() {
    return new Date(this.getProperty('created'));
  }

  get files() {
    return <Array<any>>this.getProperty('files');
  }

  get tags() {
    return <Array<string>>this.getProperty('tags');
  }

  set tags(value: Array<string>) {
    this.setProperty('tags', value);
  }

  get title() {
    return <string>this.getProperty('title');
  }

  set title(value: string) {
    this.setProperty('title', value);
  }

  get type() {
    return <string>this.getProperty('type');
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
}
