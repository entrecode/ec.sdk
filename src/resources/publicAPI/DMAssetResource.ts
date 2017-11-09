import Resource from '../Resource';
import { environment } from '../../Core';
import { get } from '../../helper';

const environmentSymbol = Symbol.for('environment');

function dateGetter(property) {
  const date = this.getProperty(property);
  if (!date) {
    return date;
  }
  return new Date(date);
}

/**
 * DMAssetResource class
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
export default class DMAssetResource extends Resource {
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
    this.countProperties();
  }

  get assetID() {
    return <string>this.getProperty('assetID');
  }

  get created() {
    return dateGetter.call(this, 'created');
  }

  get modified() {
    return dateGetter.call(this, 'modified');
  }

  get file() {
    return <any>this.getProperty('file');
  }

  get fileVariants() {
    return <Array<any>>this.getProperty('fileVariants');
  }

  get thumbnails() {
    return <Array<any>>this.getProperty('thumbnails');
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

  get caption() {
    return <string>this.getProperty('caption');
  }

  set caption(value: string) {
    this.setProperty('caption', value);
  }

  get type() {
    return <string>this.getProperty('type');
  }

  get mimetype() {
    return <string>this.getProperty('mimetype');
  }

  get creator() {
    return <string>this.getProperty('creator');
  }

  get creatorType() {
    return <string>this.getProperty('creatorType');
  }

  get isUsed() {
    return <Boolean>this.getProperty('isUsed');
  }

  get duplicates() {
    return <number>this.getProperty('duplicates');
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
    return Promise.resolve()
    .then(() => {
      const request = this.newRequest();
      if (thumb) {
        request.follow('ec:dm-asset/thumbnail');
      } else {
        request.follow('ec:dm-asset/file-variant');
      }
      const templateParams: any = {};
      if (size) {
        templateParams.size = size;
      }
      request.withTemplateParameters(templateParams);
      return get(this[environmentSymbol], request);
    })
    .then(([res]) => {
      return res.url;
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
