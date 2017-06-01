/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const TypesResource = require('../../lib/resources/apps/TypesResource').default;
const Resource = require('../../lib/resources/Resource').default;

const should = chai.should();
chai.use(sinonChai);

describe('Types Resource', () => {
  let resourceJson;
  let resource;
  before(() => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../mocks/app-types.json`, 'utf-8', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(res));
      });
    })
    .then((json) => {
      resourceJson = json;
    });
  });
  beforeEach(() => {
    resource = new TypesResource(resourceJson);
  });
  afterEach(() => {
    resource = null;
  });
  it('should be instance of Resource', () => {
    resource.should.be.instanceOf(Resource);
  });
  it('should be instance of TokenResource', () => {
    resource.should.be.instanceOf(TypesResource);
  });

  const getter = ['platformTypes', 'codeSourceTypes', 'dataSourceTypes', 'targetTypes'];
  getter.forEach((name) => {
    it(`should call resource.getProperty with ${name}`, () => {
      const spy = sinon.spy(resource, 'getProperty');

      const property = resource[name];
      spy.should.have.been.called.once;
      spy.should.have.been.calledWith(name);
      property.should.be.equal(resource.getProperty(name));

      spy.restore();
    });
  });

  it('should get plugin', () => {
    resource.getPlugin('platform', 'website').should.have.property('type', 'website');
  });
  it('should be undefined on invalid plugin type', () => {
    should.not.exist(resource.getPlugin('invalid', 'egal'));
  });
  it('should be undefined on unavailable type', () => {
    should.not.exist(resource.getPlugin('platform', 'missing'));
  });
  it('should get platform', () => {
    resource.getPlatform('website').should.have.property('type', 'website');
  });
  it('should get code source', () => {
    resource.getCodeSource('remoteGit').should.have.property('type', 'remoteGit');
  });
  it('should get data source', () => {
    resource.getDataSource('singleEntry').should.have.property('type', 'singleEntry');
  });
  it('should get target', () => {
    resource.getTarget('entrecodeS3').should.have.property('type', 'entrecodeS3');
  });

  it('should get plugin schema', () => {
    resource.getPluginSchema('platform', 'website')
    .should.have.property('id', 'https://appserver.entrecode.de/schema/types/platform-type/website');
  });
  it('should be undefined schema on invalid plugin', () => {
    should.not.exist(resource.getPluginSchema('invalid', 'egal'));
  });
  it('should get platform schema', () => {
    resource.getPlatformSchema('website')
    .should.have.property('id', 'https://appserver.entrecode.de/schema/types/platform-type/website');
  });
  it('should get code source schema', () => {
    resource.getCodeSourceSchema('remoteGit')
    .should.have.property('id', 'https://appserver.entrecode.de/schema/types/code-source/remoteGit');
  });
  it('should get data source schema', () => {
    resource.getDataSourceSchema('singleEntry')
    .should.have.property('id', 'https://appserver.entrecode.de/schema/types/data-source/singleEntry');
  });
  it('should get target schema', () => {
    resource.getTargetSchema('entrecodeS3')
    .should.have.property('id', 'https://appserver.entrecode.de/schema/types/target-type/entrecodeS3');
  });

  it('should get available types', () => {
    resource.getAvailableTypes('platform').should.have.property('length', 8);
  });
  it('should be empty array on invalid plugin', () => {
    resource.getAvailableTypes('invalid').should.have.property('length', 0);
  });
  it('should get available platforms', () => {
    resource.getAvailablePlatforms().should.have.property('length', 8);
  });
  it('should get available code sources', () => {
    resource.getAvailableCodeSources().should.have.property('length', 3);
  });
  it('should get available data sources', () => {
    resource.getAvailableDataSource().should.have.property('length', 3);
  });
  it('should get available targets', () => {
    resource.getAvailableTargets().should.have.property('length', 5);
  });
});
