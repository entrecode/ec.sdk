class FormData {
  constructor() {
    this.fields = {};
  }

  set(k, v) {
    this.fields[k] = v;
  }

  append(k, v) {
    this.fields[k] = v;
  }
}

module.exports = FormData;
