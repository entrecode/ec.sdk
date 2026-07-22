/* eslint no-unused-expressions: 'off' */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const helper = require('../../lib/helper');
const templatePermissions = require('../../lib/helper/templatePermissions');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const TEMPLATE_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const OTHER_TEMPLATE_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

describe('helper/templatePermissions', () => {
  afterEach(() => {
    templatePermissions.clearTemplateMappingCache();
  });

  describe('findTemplateIDs', () => {
    it('should detect a valid dm:template-<uuid>: entry', () => {
      templatePermissions
        .findTemplateIDs([`dm:template-${TEMPLATE_ID}:model:read`, 'dm-stats'])
        .should.deep.equal([TEMPLATE_ID]);
    });
    it('should dedupe multiple entries of the same template', () => {
      templatePermissions
        .findTemplateIDs([`dm:template-${TEMPLATE_ID}:model:read`, `dm:template-${TEMPLATE_ID}:model:write`])
        .should.deep.equal([TEMPLATE_ID]);
    });
    it('should ignore invalid uuids', () => {
      templatePermissions.findTemplateIDs(['dm:template-not-a-uuid:model:read']).should.deep.equal([]);
    });
    it('should ignore non template permissions', () => {
      templatePermissions
        .findTemplateIDs(['dm-template-create', 'dm:35b4f503-f361-4198-a11a-b2f24113731f', 'mail'])
        .should.deep.equal([]);
    });
    it('should handle empty/undefined input', () => {
      templatePermissions.findTemplateIDs(undefined).should.deep.equal([]);
    });
  });

  describe('hasTemplatePermissions', () => {
    it('should be true when a template entry is present', () => {
      templatePermissions.hasTemplatePermissions([`dm:template-${TEMPLATE_ID}:model:read`]).should.be.true;
    });
    it('should be false for plain permissions', () => {
      templatePermissions.hasTemplatePermissions(['dm-template-create', 'dm-stats']).should.be.false;
    });
    it('should be false for undefined', () => {
      templatePermissions.hasTemplatePermissions(undefined).should.be.false;
    });
  });

  describe('expandPermissions', () => {
    it('should replace a template entry with concrete dm entries', () => {
      const mappings = new Map([[TEMPLATE_ID, ['aaa', 'bbb']]]);
      templatePermissions
        .expandPermissions([`dm:template-${TEMPLATE_ID}:model:read`], mappings)
        .should.deep.equal(['dm:aaa:model:read', 'dm:bbb:model:read']);
    });
    it('should keep non template entries untouched', () => {
      const mappings = new Map([[TEMPLATE_ID, ['aaa']]]);
      templatePermissions
        .expandPermissions([`dm:template-${TEMPLATE_ID}:model:read`, 'dm-stats', 'mail'], mappings)
        .should.deep.equal(['dm:aaa:model:read', 'dm-stats', 'mail']);
    });
    it('should dedupe expanded entries', () => {
      const mappings = new Map([[TEMPLATE_ID, ['aaa', 'aaa']]]);
      templatePermissions
        .expandPermissions([`dm:template-${TEMPLATE_ID}:model:read`], mappings)
        .should.deep.equal(['dm:aaa:model:read']);
    });
    it('should leave unknown template entries untouched', () => {
      const mappings = new Map([[TEMPLATE_ID, ['aaa']]]);
      templatePermissions
        .expandPermissions([`dm:template-${OTHER_TEMPLATE_ID}:model:read`], mappings)
        .should.deep.equal([`dm:template-${OTHER_TEMPLATE_ID}:model:read`]);
    });
    it('should drop a template entry that maps to zero dataManagers', () => {
      const mappings = new Map([[TEMPLATE_ID, []]]);
      templatePermissions.expandPermissions([`dm:template-${TEMPLATE_ID}:model:read`], mappings).should.deep.equal([]);
    });
  });

  describe('datamanagerURL', () => {
    it('should resolve known environments', () => {
      templatePermissions.datamanagerURL('live').should.equal('https://datamanager.entrecode.de/');
    });
    it('should resolve shortID suffixed environments', () => {
      templatePermissions.datamanagerURL('stageaabbccdd').should.equal('https://datamanager.cachena.entrecode.de/');
    });
    it('should return undefined for unknown environments', () => {
      chai.expect(templatePermissions.datamanagerURL('unknown')).to.be.undefined;
    });
  });

  describe('resolveTemplateMappings', () => {
    it('should return an empty map when there are no template permissions', async () => {
      const stub = sinon.stub(helper, 'superagentGet');
      try {
        const result = await templatePermissions.resolveTemplateMappings(['dm-stats', 'mail'], 'live');
        result.size.should.equal(0);
        stub.should.not.have.been.called;
      } finally {
        stub.restore();
      }
    });

    it('should fetch and map dataManagerIDs per template', async () => {
      const stub = sinon.stub(helper, 'superagentGet');
      stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: ['aaa', 'bbb'] });
      try {
        const result = await templatePermissions.resolveTemplateMappings(
          [`dm:template-${TEMPLATE_ID}:model:read`],
          'live',
        );
        result.get(TEMPLATE_ID).should.deep.equal(['aaa', 'bbb']);
        stub.should.have.been.calledOnce;
        stub.firstCall.args[0].should.equal(`https://datamanager.entrecode.de/template/${TEMPLATE_ID}/datamanagers`);
        stub.firstCall.args[2].should.equal('live');
      } finally {
        stub.restore();
      }
    });

    it('should use the module cache within the TTL', async () => {
      const stub = sinon.stub(helper, 'superagentGet');
      stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: ['aaa'] });
      try {
        await templatePermissions.resolveTemplateMappings([`dm:template-${TEMPLATE_ID}:model:read`], 'live');
        await templatePermissions.resolveTemplateMappings([`dm:template-${TEMPLATE_ID}:model:read`], 'live');
        stub.should.have.been.calledOnce;
      } finally {
        stub.restore();
      }
    });

    it('should refetch after the TTL expires', async () => {
      const clock = sinon.useFakeTimers();
      const stub = sinon.stub(helper, 'superagentGet');
      stub.resolves({ templateID: TEMPLATE_ID, dataManagerIDs: ['aaa'] });
      try {
        await templatePermissions.resolveTemplateMappings([`dm:template-${TEMPLATE_ID}:model:read`], 'live');
        clock.tick(templatePermissions.TEMPLATE_MAPPING_TTL + 1);
        await templatePermissions.resolveTemplateMappings([`dm:template-${TEMPLATE_ID}:model:read`], 'live');
        stub.should.have.been.calledTwice;
      } finally {
        stub.restore();
        clock.restore();
      }
    });

    it('should fail-closed (empty map, no throw) when the route is down', async () => {
      const stub = sinon.stub(helper, 'superagentGet');
      stub.rejects(new Error('route down'));
      try {
        const result = await templatePermissions.resolveTemplateMappings(
          [`dm:template-${TEMPLATE_ID}:model:read`],
          'live',
        );
        result.size.should.equal(0);
      } finally {
        stub.restore();
      }
    });

    it('should fail-closed for unknown environments without any route call', async () => {
      const stub = sinon.stub(helper, 'superagentGet');
      try {
        const result = await templatePermissions.resolveTemplateMappings(
          [`dm:template-${TEMPLATE_ID}:model:read`],
          'unknown',
        );
        result.size.should.equal(0);
        stub.should.not.have.been.called;
      } finally {
        stub.restore();
      }
    });
  });
});
