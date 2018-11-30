import { environment } from '../../Core';
import HistoryEvent from './HistoryEvent';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');

interface HistoryEvents {
  events: Array<HistoryEvent>;
}

/**
 * HistoryEvents resource class
 *
 * https://stash.entrecode.de/projects/CMS/repos/ec.dm-history/browse/data-transform.js?at=develop#33
 *
 * @class
 *
 * @prop {Array<HistoryEvent>} events Event list for this Resource
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
    Object.defineProperty(this, 'events', {
      get: () => {
        if (this[resourceSymbol].length !== 0 && !(this[resourceSymbol][0] instanceof HistoryEvent)) {
          this[resourceSymbol] = this[resourceSymbol].map((event) => new HistoryEvent(event, this[environmentSymbol]));
        }

        return this[resourceSymbol];
      },
    });
  }
}

export default HistoryEvents;
