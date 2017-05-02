const nock = require('nock');

module.exports = {
  reset() {
    nock.disableNetConnect();

    nock('https://entrecode.de/schema')
    .get('/client').replyWithFile(200, `${__dirname}/schema/client.json`)
    .get('/datamanager').replyWithFile(200, `${__dirname}/schema/dm.json`)
    .get('/datamanager-template').replyWithFile(200, `${__dirname}/schema/dm-template.json`)
    .get('/dm-template-template').replyWithFile(200, `${__dirname}/schema/dm-template-template.json`)
    .get('/dm-role-template').replyWithFile(200, `${__dirname}/schema/dm-role-template.json`)
    .get('/datetime').replyWithFile(200, `${__dirname}/schema/datetime.json`)
    .get('/uuidV4').replyWithFile(200, `${__dirname}/schema/uuidV4.json`)
    .get('/locale').replyWithFile(200, `${__dirname}/schema/locale.json`)
    .get('/hexcolor').replyWithFile(200, `${__dirname}/schema/hexcolor.json`)
    .get('/hal').replyWithFile(200, `${__dirname}/schema/hal.json`);

    nock('http://json-schema.org')
    .get('/draft-04/schema').replyWithFile(200, `${__dirname}/schema/schema.json`);
    nock('https://schema.getpostman.com')
    .get('/json/collection/v1.0.0/').replyWithFile(200, `${__dirname}/schema/postman-collection.json`);

    nock('https://accounts.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/accounts-root.json`);

    nock('https://datamanager.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/dm-list.json`);
  },
};
