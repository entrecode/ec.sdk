# ec.sdk

> This is the SDK for all [ec.APIs](https://doc.entrecode.de) by entrecode. By entrecode.

[![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][cover-image]][cover-url] [![Inline docs][doc-image]][doc-url] [![Greenkeeper badge](https://badges.greenkeeper.io/entrecode/ec.sdk.svg)](https://greenkeeper.io/) [![NSP Status][nsp-image]][nsp-url]

Documentation can be found [here](https://entrecode.github.io/ec.sdk/). If you like to see some code look [here](https://github.com/entrecode/ec.sdk).

## Getting Started

In order to use this SDK you should be familiar with ec.APIs and the concepts behind those. Please refer to the [official documentation](https://doc.entrecode.de) to get a basic understanding. The documentation you are reading now will first introduce the basic concept when using the SDK. Secondly it is the complete API documentation for ec.sdk.

For every ec.API you will find an API connector. Use one of those to connect to a certain ec.API. Login and logout for ec.users are special cases and are done in [Session](#Session) API connector. All API connectors of a certain [environment](#environment) share some information. The most important one is any access token either received with [Session#login](#Session#login) or by calling [Core#setToken](#Core#setToken). This means you can specifiy the token on any API connector and it will be automatically used by all other API connectors. Also it will be saved in a cookie with the name `<environment>Token`. If any API connector receives a token related Error ([Problem](#Problem)) it will be automatically removed from all API connectors and a [logout event](#eventeventlogout) is triggered. A special case is [PublicAPI](#PublicAPI) since this will store the token in a cookie containing the [environment](#environment) and Data Manager shortID of the PublicAPI (for example: `stagebeefbeefToken`).

Since version 0.13.0 you can create a stand-alone API Connector. By calling the constructor with `new Session({ noCookie: true });` the API Connector won't share its token with other API Connectors.

Every action you take in the ec.sdk will be validated before it will be sent as a request to ec.APIs. This means that the provided json schemas are used.

##### Installation

```sh
npm i --save ec.sdk
```

##### ES6 / Webpack

Add the following in your webpack.config.js.

```js

const config = {
  // …
  node: {
    fs: 'empty',
    Buffer: true,
    net: 'empty',
    tls: 'empty',
  },
};
```

Then you can start coding:

```js
import { Session, Accounts, DataManager } from 'ec.sdk';
import AccountResource from 'ec.sdk/src/resources/accounts/AccountResource';
import DataManagerResource from 'ec.sdk/src/resources/datamanager/DataManagerResource';

class MyExample {
  session: Session;
  accounts: Accounts;
  dataManager: DataManager;

  me: AccountResource;
  dm: DataManagerResource;

  constructor() {
    session = new Session();
    accounts = new Accounts();

    session.setClientID('rest');
    // this will also receive events from Accounts and DataManager
    session.on('error', console.error);
  }

  login(email, password) {
    session.login(email, password)
    .then((token) => {
      // if you use stand-alone API Connectors (`noCookie` set to true)
      accounts.setToken(token);

      // or anywhere in the code
      dataManager.setToken(session.getToken());
    });
  }

  setAccountLanguage(lang) {
    Promise.resolve()
    .then(() => {
      if (this.me){
        return this.me;
      }
      return this.accounts.me();
    })
    .then((me) => {
      me.language = lang;
      return me.save();
    })
    .then((meSaved: AccountResource) => this.me = meSaved);
  }

  loadDataManager(id) {
    if (!this.dataManager){
      this.dataManager = new DataManager();
    }

    this.dataManager.dataManager(id)
    .then((dm) =>{
      this.dm = dm;
    });
  }
}
```

##### Node

Require statements are different on node. Also, you probably don't want to share tokens in a node.js environment. You'll need to use `noCookie` or namespacing via `cookieModifier`.

```js
const ec = require('ec.sdk');
const dataManager = new ec.DataManager({ environment: 'live', cookieModifier: 'myScriptName' });
dataManager.setToken(accessToken);

dataManager.dataManagerList()
.then(list => doSomthingWith(list))
.catch(console.log);
```

###### Browsers

> This is not officially supported. Mainly exists for usage in jsfiddles or similar.

```html
<script src="https://unpkg.com/ec.sdk/dist/ec.sdk.min.js"></script>
<script>
    console.log('My development stack is old and I should feel old');

    var dataManager = new ec.DataManager('live');
    dataManager.setToken(accessToken);
    dataManager.list()
    .then(list => doSomthingWith(list))
    .catch(console.log);
</script>
```

[travis-image]: https://travis-ci.org/entrecode/ec.sdk.svg?branch=master
[travis-url]: https://travis-ci.org/entrecode/ec.sdk
[cover-image]: https://coveralls.io/repos/github/entrecode/ec.sdk/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/entrecode/ec.sdk?branch=master
[npm-image]: https://badge.fury.io/js/ec.sdk.svg
[npm-url]: https://www.npmjs.com/package/ec.sdk
[nsp-image]: https://nodesecurity.io/orgs/entrecode/projects/1cb6afc6-44bf-4cbc-8ea9-b2dcaf599609/badge
[nsp-url]: https://nodesecurity.io/orgs/entrecode/projects/1cb6afc6-44bf-4cbc-8ea9-b2dcaf599609
[doc-image]: http://inch-ci.org/github/entrecode/ec.sdk.svg?branch=master
[doc-url]: http://inch-ci.org/github/entrecode/ec.sdk
