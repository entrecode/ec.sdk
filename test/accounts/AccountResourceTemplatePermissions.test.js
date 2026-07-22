/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../../lib/helper');
const templatePermissions = require('../../lib/helper/templatePermissions');
const AccountResource = require('../../lib/resources/accounts/AccountResource').default;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const TEMPLATE_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const DM_ID = '5510a8f9-67ce-4d4d-b5a1-a9fe6b7d8d72';

function readMock(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../mocks/${name}`, 'utf-8', (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(res));
    });
  });
}

describe('AccountResource template permissions (ONE-9308)', () => {
  let templateJson;
  let plainJson;

  before(() =>
    Promise.all([readMock('account-template-permissions.json'), readMock('account-single.json')]).then(
      ([template, plain]) => {
        templateJson = template;
        plainJson = plain;
      },
    ),
  );

  afterEach(() => {
    templatePermissions.clearTemplateMappingCache();
  });

  it('should not match a concrete dm permission before resolveTemplatePermissions', () => {
    const resource = new AccountResource(templateJson, 'live');
    resource.checkPermission(`dm:${DM_ID}:model:someModel:entry:read`).should.be.false;
  });

  it('should match a concrete dm permission after resolveTemplatePermissions (only-template grant)', () => {
    const resource = new AccountResource(templateJson, 'live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: [DM_ID] });

    return resource
      .resolveTemplatePermissions()
      .then(() => {
        resource.checkPermission(`dm:${DM_ID}:model:someModel:entry:read`).should.be.true;
        stub.should.have.been.calledOnce;
      })
      .then(() => stub.restore(), (err) => {
        stub.restore();
        throw err;
      });
  });

  it('should expose concrete dataManagerIDs via queryPermissions after resolve', () => {
    const resource = new AccountResource(templateJson, 'live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: [DM_ID] });

    return resource
      .resolveTemplatePermissions()
      .then(() => {
        resource.queryPermissions('dm:?').should.include(DM_ID);
      })
      .then(() => stub.restore(), (err) => {
        stub.restore();
        throw err;
      });
  });

  it('should memoize the expanded list (single route call across resolves)', () => {
    const resource = new AccountResource(templateJson, 'live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: [DM_ID] });

    return resource
      .resolveTemplatePermissions()
      .then(() => resource.resolveTemplatePermissions())
      .then(() => {
        stub.should.have.been.calledOnce;
      })
      .then(() => stub.restore(), (err) => {
        stub.restore();
        throw err;
      });
  });

  it('should not trigger a route call for accounts without template grants', () => {
    const resource = new AccountResource(plainJson, 'live');
    const stub = sinon.stub(helper, 'superagentGet');

    return resource
      .resolveTemplatePermissions()
      .then(() => {
        stub.should.not.have.been.called;
        resource.checkPermission('dm-stats').should.be.true;
      })
      .then(() => stub.restore(), (err) => {
        stub.restore();
        throw err;
      });
  });

  it('should fail-closed when the route is down (no throw, concrete check false)', () => {
    const resource = new AccountResource(templateJson, 'live');
    const stub = sinon.stub(helper, 'superagentGet');
    stub.rejects(new Error('route down'));

    return resource
      .resolveTemplatePermissions()
      .then(() => {
        resource.checkPermission(`dm:${DM_ID}:model:someModel:entry:read`).should.be.false;
      })
      .then(() => stub.restore(), (err) => {
        stub.restore();
        throw err;
      });
  });
});
