import Resource, { environmentSymbol, resourceSymbol } from '../Resource';
import DMStatsResource from './DMStatsResource';

const nameSymbol = Symbol('_name');
const listClassSymbol = Symbol('_listClass');
const itemClassSymbol = Symbol('_itemClass');

/**
 * DMStats list class
 *
 * @class
 */
export default class DMStatsList extends Resource {
  /**
   * Creates a new {@link DMStatsList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   */
  constructor(resource, environment, traversal) {
    super(resource, environment, traversal);
    this[nameSymbol] = 'dataManagers';
    this[listClassSymbol] = DMStatsList;
    this[itemClassSymbol] = DMStatsResource;
  }

  /**
   * Get all list items {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} into this {@link ListResource}.
   *
   * @returns {Array<Resource|ResourceClass>} an array of all list items.
   */
  getAllItems() {
    const array = this[resourceSymbol][this[nameSymbol]] || [];
    return array.map(resource => new this[itemClassSymbol](resource, this[environmentSymbol]));
  }

  /**
   * Get the n'th {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @param {number} n index of the item
   * @returns {Resource|ResourceClass} the requested item.
   */
  getItem(n) {
    if (n === undefined) { // undefined check
      throw new Error('Index must be defined.');
    }
    const array = this[resourceSymbol][this[nameSymbol]] || [];
    if (!array || array.length === 0) {
      throw new Error('Cannot get n\'th item of empty list.');
    }
    return new this[itemClassSymbol](array[n], this[environmentSymbol]);
  }

  /**
   * Get the first {@link https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2
   * embedded} item from the list
   *
   * @returns {Resource|ResourceClass} the first item.
   */
  getFirstItem() {
    return this.getItem(0);
  }
}
