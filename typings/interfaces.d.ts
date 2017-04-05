export interface filterOptions {
  size?: number,
  page?: number,
  sort?: Array<string>,
  filter?: any
}

export type assetInput = string | object;

export interface assetOpitons {
  fileName?: string,
  title?: string,
  tags?: Array<string>
}
