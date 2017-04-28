const nock = require('nock');

module.exports = {
  reset() {
    nock.disableNetConnect();

    nock('https://entrecode.de/schema')
    .get('/datamanager').replyWithFile(200, `${__dirname}/schema/dm.json`)
    .get('/datetime').replyWithFile(200, `${__dirname}/schema/datetime.json`)
    .get('/uuidV4').replyWithFile(200, `${__dirname}/schema/uuidV4.json`)
    .get('/locale').replyWithFile(200, `${__dirname}/schema/locale.json`)
    .get('/hexcolor').replyWithFile(200, `${__dirname}/schema/hexcolor.json`)
    .get('/hal').replyWithFile(200, `${__dirname}/schema/hal.json`);

    nock('https://accounts.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/accounts-root.json`);

    nock('https://datamanager.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/dm-list.json`);
  },
};
