const nock = require('nock');

module.exports = {
  reset() {
    nock.disableNetConnect();

    nock('https://entrecode.de/schema')
    .get('/app-template').replyWithFile(200, `${__dirname}/schema/app-template.json`, { 'Content-Type': 'application/json' })
    .get('/client').replyWithFile(200, `${__dirname}/schema/client.json`, { 'Content-Type': 'application/json' })
    .get('/datamanager').replyWithFile(200, `${__dirname}/schema/dm.json`, { 'Content-Type': 'application/json' })
    .get('/datamanager-template').replyWithFile(200, `${__dirname}/schema/dm-template.json`, { 'Content-Type': 'application/json' })
    .get('/model').replyWithFile(200, `${__dirname}/schema/model.json`, { 'Content-Type': 'application/json' })
    .get('/model-template').replyWithFile(200, `${__dirname}/schema/model-template.json`, { 'Content-Type': 'application/json' })
    .get('/dm-template-template').replyWithFile(200, `${__dirname}/schema/dm-template-template.json`, { 'Content-Type': 'application/json' })
    .get('/dm-role-template').replyWithFile(200, `${__dirname}/schema/dm-role-template.json`, { 'Content-Type': 'application/json' })
    .get('/dm-client').replyWithFile(200, `${__dirname}/schema/dm-client.json`, { 'Content-Type': 'application/json' })
    .get('/group-template').replyWithFile(200, `${__dirname}/schema/group-template.json`, { 'Content-Type': 'application/json' })
    .get('/datetime').replyWithFile(200, `${__dirname}/schema/datetime.json`, { 'Content-Type': 'application/json' })
    .get('/uuidV4').replyWithFile(200, `${__dirname}/schema/uuidV4.json`, { 'Content-Type': 'application/json' })
    .get('/locale').replyWithFile(200, `${__dirname}/schema/locale.json`, { 'Content-Type': 'application/json' })
    .get('/hexcolor').replyWithFile(200, `${__dirname}/schema/hexcolor.json`, { 'Content-Type': 'application/json' })
    .get('/codesource-template').replyWithFile(200, `${__dirname}/schema/codesource-template.json`, { 'Content-Type': 'application/json' })
    .get('/datasource-template').replyWithFile(200, `${__dirname}/schema/datasource-template.json`, { 'Content-Type': 'application/json' })
    .get('/target-template').replyWithFile(200, `${__dirname}/schema/target-template.json`, { 'Content-Type': 'application/json' })
    .get('/platform-template').replyWithFile(200, `${__dirname}/schema/platform-template.json`, { 'Content-Type': 'application/json' })
    .get('/dm-assetgroup-template-post').replyWithFile(200, `${__dirname}/schema/assetgroup-post.json`, { 'Content-Type': 'application/json' })
    .get('/dm-assetgroup').replyWithFile(200, `${__dirname}/schema/assetgroup.json`, { 'Content-Type': 'application/json' })
    .get('/hal').replyWithFile(200, `${__dirname}/schema/hal.json`, { 'Content-Type': 'application/json' });

    nock('http://json-schema.org')
    .get('/draft-04/schema').replyWithFile(200, `${__dirname}/schema/schema.json`, { 'Content-Type': 'application/json' })
    .get('/geo').replyWithFile(200, `${__dirname}/schema/geo.json`, { 'Content-Type': 'application/json' });

    nock('https://schema.getpostman.com')
    .get('/json/collection/v1.0.0/').replyWithFile(200, `${__dirname}/schema/postman-collection.json`, { 'Content-Type': 'application/json' });

    nock('https://accounts.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/accounts-root.json`, { 'Content-Type': 'application/json' });

    nock('https://appserver.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/app-list.json`, { 'Content-Type': 'application/json' });

    nock('https://datamanager.entrecode.de')
    .get('/').replyWithFile(200, `${__dirname}/dm-list.json`, { 'Content-Type': 'application/json' })
    .get('/api/beefbeef').replyWithFile(200, `${__dirname}/public-dm-root.json`, { 'Content-Type': 'application/json' })
    .get('/api/schema/beefbeef/contains_entries').replyWithFile(200, `${__dirname}/schema/dm-model2.json`, { 'Content-Type': 'application/json' })
    .get('/api/schema/beefbeef/allFields').replyWithFile(200, `${__dirname}/schema/dm-model.json`, { 'Content-Type': 'application/json' })
    .get('/api/schema/beefbeef/allFields?template=put').replyWithFile(200, `${__dirname}/schema/dm-model-put.json`, { 'Content-Type': 'application/json' })
    .get('/api/schema/beefbeef/allFields?template=post').replyWithFile(200, `${__dirname}/schema/dm-model-post.json`, { 'Content-Type': 'application/json' });
  },
};
