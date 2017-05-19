/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const fs = require('fs');

const Resource = require('../../lib/resources/Resource');
const InvitesResource = require('../../lib/resources/accounts/InvitesResource').default;

const should = chai.should();

describe('InvitesResource', () => {
  let resourceJson;
  let resource;
  before((done) => {
    fs.readFile(`${__dirname}/../mocks/invites.json`, 'utf-8', (err, res) => {
      if (err) {
        return done(err);
      }
      resourceJson = JSON.parse(res);
      return done();
    });
  });
  beforeEach(() => {
    resource = new InvitesResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource.default);
  });
  it('should be instance of InvitesResource', () => {
    resource.should.be.instanceOf(InvitesResource);
  });
  it('should instantiate with traversal and environment', () => {
    const res = new Resource.default(resourceJson, 'stage', {});
    res[Resource.environmentSymbol].should.be.equal('stage');
    should.exist(res[Resource.traversalSymbol]);
  });
  it('should get invites', () => {
    const invites = resource.invites;
    invites.should.be.instanceOf(Array);
    invites.forEach(invite => (typeof invite).should.be.equal('string'));
  });
});
