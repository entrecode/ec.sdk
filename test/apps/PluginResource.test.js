/* eslint no-unused-expressions:0 */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fs = require('fs');

const Resource = require('../../lib/resources/Resource').default;
const requires = {
  CodeSourceList: require('../../lib/resources/apps/CodeSourceList').default,
  CodeSourceResource: require('../../lib/resources/apps/CodeSourceResource').default,
  DataSourceList: require('../../lib/resources/apps/DataSourceList').default,
  DataSourceResource: require('../../lib/resources/apps/DataSourceResource').default,
  TargetList: require('../../lib/resources/apps/TargetList').default,
  TargetResource: require('../../lib/resources/apps/TargetResource').default,
};

chai.should();
chai.use(sinonChai);

['CodeSource', 'DataSource', 'Target']
.forEach((plugin) => {
  const pluginCamel = plugin.charAt(0).toLowerCase() + plugin.slice(1);
  const pluginLower = plugin.toLocaleLowerCase();

  describe(`${plugin} ListResource`, () => {
    let listJson;
    let list;
    before(() => {
      return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/${pluginLower}-list.json`, 'utf-8', (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.parse(res));
        });
      })
      .then((json) => {
        listJson = json;
      });
    });
    beforeEach(() => {
      list = new requires[`${plugin}List`](listJson);
    });
    afterEach(() => {
      list = null;
    });
    it('should be instance of Resource', () => {
      list.should.be.instanceOf(Resource);
    });
    it('should be instance of TokenList', () => {
      list.should.be.instanceOf(requires[`${plugin}List`]);
    });
    it('should have PlatformResource items', () => {
      list.getAllItems().forEach(item => item.should.be.instanceOf(requires[`${plugin}Resource`]));
    });
  });

  describe(`${plugin} Resource`, () => {
    let resourceJson;
    let resource;
    before(() => {
      return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../mocks/${pluginLower}-single.json`, 'utf-8', (err, res) => {
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
      resource = new requires[`${plugin}Resource`](resourceJson);
    });
    afterEach(() => {
      resource = null;
    });
    it('should be instance of Resource', () => {
      resource.should.be.instanceOf(Resource);
    });
    it('should be instance of PlatformResource', () => {
      resource.should.be.instanceOf(requires[`${plugin}Resource`]);
    });

    const getter = [`${pluginCamel}ID`];
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

    const functions = ['config', `${pluginCamel}Type`];
    functions.forEach((name) => {
      it(`should call resource.getProperty with ${name}`, () => {
        const spy = sinon.spy(resource, 'getProperty');

        const property = resource[name];
        spy.should.have.been.called.once;
        spy.should.have.been.calledWith(name);
        property.should.be.equal(resource.getProperty(name));

        spy.restore();
      });
      it(`should call resource.setProperty with ${name}`, () => {
        const spy = sinon.spy(resource, 'setProperty');

        resource[name] = resource.getProperty(name);
        spy.should.have.been.called.once;
        spy.should.have.been.calledWith(name, resource.getProperty(name));

        spy.restore();
      });
    });
  });
});
