export interface filterOptions {
  size?: number,
  page?: number,
  sort?: Array<string>,
  _levels?: string,
  _fields?: Array<string>,
  [key: string]: filterType
}

interface filter {
  exact?: string,
  search?: string,
  from?: any,
  to?: any,
  any?: Array<string>,
  all?: Array<string>
}

type filterType = Array<string> | number | string | filter;

export type assetInput = string | any;

export interface assetOptions {
  fileName?: string | Array<string>,
  title?: string,
  tags?: Array<string>
}

export type environment = 'live' | 'stage' | 'nightly' | 'develop';
