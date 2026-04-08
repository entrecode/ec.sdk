import * as traverson from 'traverson';

import { environment } from '../../Core';
import HistoryEvent from './HistoryEvent';
import Resource from '../Resource';
import { post } from '../../helper';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');
const entriesPostUrlSymbol: any = Symbol.for('entriesPostUrl');

interface HistoryEvents {
  count: number;
  scannedCount: number;
  items: Array<HistoryEvent>;
  lastEventNumber?: string;
  lastEventNumbers?: Record<string, unknown>;
  nextRequestBody?: Record<string, unknown>;
}

/**
 * HistoryEvents resource class
 *
 * https://github.com/entrecode/ec.dm-history/blob/develop/data-transform.js#L35
 *
 * @class
 *
 * @prop {number} count Event count in this list
 * @prop {number} scannedCount Count of scanned objects
 * @prop {Array<HistoryEvent>} items array of HistoryEvent objects
 * @prop {string} [lastEventNumber] cursor for single-model pagination (POST /entries)
 * @prop {object} [lastEventNumbers] cursors per model for multi-model pagination
 * @prop {object} [nextRequestBody] next POST body from API (use for {@link HistoryEvents#next})
 */
class HistoryEvents extends Resource {
  /**
   * Creates a new {@link HistoryEvents}.
   *
   * @access protected
   *
   * @param {object} resource resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   * @param {?object} traversal traversal from which traverson can continue.
   * @param {string} [entriesPostUrl] resolved POST URL for /entries (pagination).
   */
  constructor(resource: any, environment: environment, traversal?: any, entriesPostUrl?: string) {
    super(resource, environment, traversal);

    this[entriesPostUrlSymbol] = entriesPostUrl || '';

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
      lastEventNumber: {
        enumerable: true,
        get: () => this.getProperty('lastEventNumber'),
      },
      lastEventNumbers: {
        enumerable: true,
        get: () => this.getProperty('lastEventNumbers'),
      },
      nextRequestBody: {
        enumerable: true,
        get: () => this.getProperty('nextRequestBody'),
      },
    });
  }

  /**
   * Load the next page via POST /entries using `nextRequestBody` from the API.
   *
   * @returns {Promise<HistoryEvents>} Next page of HistoryEvents
   */
  next(): Promise<HistoryEvents> {
    const body = this.getProperty('nextRequestBody') as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      throw new Error('No next page: nextRequestBody is missing on this HistoryEvents resource');
    }
    const url = this[entriesPostUrlSymbol] as string;
    if (!url) {
      throw new Error('entries POST URL not available for pagination');
    }
    const request = traverson.from(url).jsonHal().newRequest();
    return post(this[environmentSymbol], request, body).then(([res, traversal]: [any, any]) => {
      return new HistoryEvents(res, this[environmentSymbol], traversal, url);
    });
  }

  /**
   * Whether another page exists (`nextRequestBody` or `_links.next`).
   *
   * @returns {boolean} True if more pages may exist.
   */
  hasNextLink(): boolean {
    const nrb = this.getProperty('nextRequestBody');
    if (nrb !== undefined && nrb !== null && typeof nrb === 'object') {
      return true;
    }
    return this.hasLink('next');
  }
}

export default HistoryEvents;
