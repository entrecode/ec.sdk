import ListResource, { environment } from '../ListResource';
import AppStatsResource from './AppStatsResource';

/**
 * AppStats list class
 *
 * @class
 */
export default class AppStatsList extends ListResource {
  /**
   * Creates a new {@link AppStatsList}.
   *
   * @param {object} resource resource loaded from the API.
   * @param {environment} environment the environment this resource is associated to.
   * @param {object?} traversal traversal from which traverson can continue.
   */
  constructor(resource: any, environment: environment, traversal?: any) {
    super(resource, environment, traversal, 'ec:app-stat', undefined, AppStatsList, AppStatsResource);
  }
}
