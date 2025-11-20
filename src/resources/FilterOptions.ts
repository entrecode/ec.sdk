export type Filter = {
  exact?: string;
  not?: string;
  null?: boolean;
  notNull: boolean;
  notAny?: Array<string>;
  search?: string;
  from?: any;
  to?: any;
  any?: Array<string>;
  all?: Array<string>;
};

export type FilterType = Array<string> | number | string | Filter | object | boolean | undefined;

/**
 * List filter options with pagination, sorting, and {@link filter}. This can be used to apply all
 * sorts of filter to a list request.
 *
 * @example
 * accounts.accountList({ size: 25 }); // will result in a list with 25 entries
 * accounts.accountList({
 *   sort: ['email', '-created'], // sorted by email asc and created desc
 *   page: 3, // page 3 of a list with 10 entries
 *   property: 'exactlyThis', // filter exactly exactlyThis for property property
 * });
 * // for filter see below
 *
 * @typedef {Object} filterOptions
 * @property {number} size
 * @property {number} page
 * @property {Array<string} sort
 * @property {number} _levels
 * @property {Array<string>} _fields
 */
export type FilterOptions = {
  size?: number;
  page?: number;
  sort?: Array<string>;
  _levels?: number;
  _fields?: Array<string>;
  _search?: string;

  [key: string]: FilterType;
};
