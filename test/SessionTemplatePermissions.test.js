/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const resolver = require('./mocks/resolver');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../lib/helper');
const templatePermissions = require('../lib/helper/templatePermissions');
const Session = require('../lib/Session').default;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const TEMPLATE_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const DM_ID = '5510a8f9-67ce-4d4d-b5a1-a9fe6b7d8d72';

describe('Session template permissions (ONE-9308)', () => {
  afterEach(() => {
    templatePermissions.clearTemplateMappingCache();
  });

  it('should transparently expand template permissions in checkPermission', () => {
    const session = new Session();
    const get = sinon.stub(helper, 'get');
    get.returns(resolver('account-template-permissions.json'));
    const follow = sinon.stub(session, 'follow');
    follow.returns(Promise.resolve(session.newRequest()));
    const superagentGet = sinon.stub(helper, 'superagentGet');
    superagentGet.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: [DM_ID] });

    const restore = () => {
      get.restore();
      follow.restore();
      superagentGet.restore();
    };

    return session
      .checkPermission(`dm:${DM_ID}:model:someModel:entry:read`)
      .then((ok) => {
        ok.should.be.true;
        superagentGet.should.have.been.calledOnce;
      })
      .then(restore, (err) => {
        restore();
        throw err;
      });
  });

  it('should keep using the me cache (single route call across checks)', () => {
    const session = new Session();
    const get = sinon.stub(helper, 'get');
    get.returns(resolver('account-template-permissions.json'));
    const follow = sinon.stub(session, 'follow');
    follow.returns(Promise.resolve(session.newRequest()));
    const superagentGet = sinon.stub(helper, 'superagentGet');
    superagentGet.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: [DM_ID] });

    const restore = () => {
      get.restore();
      follow.restore();
      superagentGet.restore();
    };

    return session
      .checkPermission(`dm:${DM_ID}:model:someModel:entry:read`)
      .then(() => session.checkPermission(`dm:${DM_ID}:model:someModel:entry:read`))
      .then((ok) => {
        ok.should.be.true;
        get.should.have.callCount(1);
        superagentGet.should.have.callCount(1);
      })
      .then(restore, (err) => {
        restore();
        throw err;
      });
  });

  it('should not trigger a route call for accounts without template grants', () => {
    const session = new Session();
    const get = sinon.stub(helper, 'get');
    get.returns(resolver('account-single.json'));
    const follow = sinon.stub(session, 'follow');
    follow.returns(Promise.resolve(session.newRequest()));
    const superagentGet = sinon.stub(helper, 'superagentGet');

    const restore = () => {
      get.restore();
      follow.restore();
      superagentGet.restore();
    };

    return session
      .checkPermission('dm-stats')
      .then((ok) => {
        ok.should.be.true;
        superagentGet.should.not.have.been.called;
      })
      .then(restore, (err) => {
        restore();
        throw err;
      });
  });

  it('should fail-closed when the template route is down (no throw)', () => {
    const session = new Session();
    const get = sinon.stub(helper, 'get');
    get.returns(resolver('account-template-permissions.json'));
    const follow = sinon.stub(session, 'follow');
    follow.returns(Promise.resolve(session.newRequest()));
    const superagentGet = sinon.stub(helper, 'superagentGet');
    superagentGet.rejects(new Error('route down'));

    const restore = () => {
      get.restore();
      follow.restore();
      superagentGet.restore();
    };

    return session
      .checkPermission(`dm:${DM_ID}:model:someModel:entry:read`)
      .then((ok) => {
        ok.should.be.false;
      })
      .then(restore, (err) => {
        restore();
        throw err;
      });
  });
});
