'use strict';

export default class Problem extends Error {
  constructor(error) {
    super(error.title);
    Object.assign(this, error);
  }
}
