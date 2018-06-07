import { environment } from '../../Core';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');

interface HistoryEvent {
  eventNumber: number;
  eventId: string;
  eventType: string; // TODO enum?
  timestamp: Date;
  entryID: string;
  modelID: string;
  modelTitle: string;
  dataManagerID: string;
  shortID: string;
  user: {
    accountID: string,
    userType: string, // TODO enum?
  };
  data: Array<any>;
}

/**
 * HistoryEvent resource class
 * 
 * https://stash.entrecode.de/projects/CMS/repos/ec.dm-history/browse/data-transform.js?at=develop#33
 *
 * @class
 *
 * @prop {number} eventNumber number of the event
 * @prop {string} eventId id of the event
 * @prop {string} eventType type defining what happened
 * @prop {Date} timestamp time this event happened
 * @prop {string} entryID the entry this event belongs to
 * @prop {string} modelID the model this event belongs to
 * @prop {string} modelTitle model name this event belongs to
 * @prop {string} dataManagerID data manager this event belongs to
 * @prop {string} shortID data manager short id
 * @prop {object} user the user responsible for this event
 * @prop {object} data data describing the event
 */
class HistoryEvent {
  /**
   * Creates a new {@link HistoryEvent}.
   *
   * @access protected
   *
   * @param {object} res resource loaded from the API.
   * @param {string} environment the environment this resource is associated to.
   */
  constructor(res: any, environment: environment) {
    this[resourceSymbol] = JSON.parse(JSON.stringify(res));
    this[environmentSymbol] = environment;
    Object.defineProperty(this, 'timestamp', {
      enumerable: true,
      get: () => {
        if (this[resourceSymbol].timestamp && typeof this[resourceSymbol].timestamp === 'string') {
          this[resourceSymbol].timestamp = new Date(this[resourceSymbol].timestamp);
        }
        return this[resourceSymbol].timestamp;
      }
    });
    ['eventNumber', 'eventId', 'eventType', 'entryID', 'modelID', 'modelTitle', 'dataManagerID', 'shortID', 'user', 'data']
      .forEach((prop) => {
        Object.defineProperty(this, prop, { enumerable: true, get: () => this[resourceSymbol][prop] })
      });
  }
}

export default HistoryEvent;