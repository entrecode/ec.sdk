class FormData {
  constructor() {
    this.fields = {};
  }

  field(k, v) {
    this.fields[k] = v;
  }

  append(k, v) {
    this.fields[k] = v;
  }
}

module.exports = FormData;
