import { environment } from '../../Core';

const environmentSymbol = Symbol.for('environment');
const resourceSymbol = Symbol.for('resource');

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

class HistoryEvent {
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