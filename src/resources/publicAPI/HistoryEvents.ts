import { environment } from '../../Core';
import HistoryEvent from './HistoryEvent';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');

interface HistoryEvents {
  count: number;
  scannedCount: number;
  items: Array<HistoryEvent>;
}

/**
 * HistoryEvents resource class
 *
 * https://stash.entrecode.de/projects/CMS/repos/ec.dm-history/browse/data-transform.js?at=develop#33
 *
 * @class
 *
 * @prop {number} count Event count in this list
 * @prop {number} scannedCount Count of scanned objects
 * @prop {Array<HistoryEvent>} items array of HistoryEvent objects
 */
class HistoryEvents {
  /**
   * Creates a new {@link HistoryEvents}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   */
  constructor(resource: any, environment: environment) {
    this[environmentSymbol] = environment;
    this[resourceSymbol] = JSON.parse(JSON.stringify(resource));
    Object.defineProperties(this, {
      count: {
        enumerable: true,
        get: () => this[resourceSymbol].count,
      },
      scannedCount: {
        enumerable: true,
        get: () => this[resourceSymbol].scannedCount,
      },
      items: {
        enumerable: true,
        get: () => {
          if (this[resourceSymbol].items.length !== 0 && !(this[resourceSymbol].items[0] instanceof HistoryEvent)) {
            this[resourceSymbol].items = this[resourceSymbol].items.map(
              (event) => new HistoryEvent(event, this[environmentSymbol]),
            );
          }

          return this[resourceSymbol].items;
        },
      },
    });
  }

  /**
   * Load the next page.
   * 
   * @returns {Promise<HistoryEvents>} Next page of HistoryEvents
   */
  next(): Promise<HistoryEvents> {
    throw new Error('not implemented yet');
  }
}

export default HistoryEvents;
