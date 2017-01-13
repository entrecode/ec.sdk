'use strict';

export default class Problem extends Error {
  constructor(error) {
    super(error.title);
    Object.assign(this, error);
  }

  toPrettyString(){
    return `${this.title} - ${this.detail}`; // TODO beautify
  }
}

// Error Code list
// Code to pretty string representation
// nested errors in embedded?
