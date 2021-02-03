import { environment } from '../../Core';

const environmentSymbol: any = Symbol.for('environment');
const resourceSymbol: any = Symbol.for('resource');

interface HistoryEvent {
  modelID: string;
  shortID: string;
  timestamp: Date;
  'timestamp#entryID#randomNumber': string;
  data: any;
  oldEntryData: any;
  user: {
    accountID: string;
    userType: string; // TODO enum?
  };
  entryID: string;
  type: string; // TODO enum?
}

/**
 * HistoryEvent resource class
 *
 * https://github.com/entrecode/ec.dm-history/blob/develop/data-transform.js#L35
 *
 * @class
 *
 * @prop {string} modelID the model this event belongs to
 * @prop {string} shortID data manager short id
 * @prop {Date} timestamp time this event happened
 * @prop {string} 'timestamp#entryID#randomNumber' the unique key from dynamodb
 * @prop {object} data data describing the event
 * @prop {object} oldEntryData old data describing the event
 * @prop {object} user the user responsible for this event
 * @prop {string} entryID the entry this event belongs to
 * @prop {string} type type defining what happened
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
      },
    });
    ['modelID', 'shortID', 'timestamp#entryID#randomNumber', 'data', 'oldEntryData', 'user', 'entryID', 'type'].forEach(
      (prop) => {
        Object.defineProperty(this, prop, { enumerable: true, get: () => this[resourceSymbol][prop] });
      },
    );
  }
}

export default HistoryEvent;
