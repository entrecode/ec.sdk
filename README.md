# ec.api-sdk

> SDK for most APIs of AppCMS by entrecode. By entrecode.
> 
> This is under active development and not yet ready for use!

[![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][cover-image]][cover-url] [![NSP Status][nsp-image]][nsp-url] [![Code Climate][cc-image]][cc-url] [![Inline docs][doc-image]][doc-url]

## Documentation

Documentation can be found [here](https://entrecode.github.io/ec.sdk/).

## Basic Usage

```sh
npm i --save ec.api
```

##### ES6 / Webpack

```js
import {DataManager, Accounts} from 'ec.api';

const dataManager = new DataManager('live').setToken(accessToken);

dataManager.dataManagerList()
.then(list => doSomthingWith(list))
.catch(console.log);
```

##### Node

```js
const ec = require('ec.api');
const dataManager = new ec.DataManager('live').setToken(accessToken);

dataManager.dataManagerList()
.then(list => doSomthingWith(list))
.catch(console.log);
```

###### Browsers
> This is not officially supported. Mainly exists for usage in jsfiddles or similar.

```html
<!-- Good Luck :D - We have a browserified build in ./dist/ -->
<script src="https://unpkg.com/ec.sdk/dist/ec.sdk.min.js"></script>
<script>
    console.log('My development stack is bad and I should feel bad');
    
    var dataManager = new ec.DataManager('live').setToken(accessToken);
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
[cc-image]: https://codeclimate.com/github/entrecode/ec.sdk/badges/gpa.svg
[cc-url]: https://codeclimate.com/github/entrecode/ec.sdk
[doc-image]: http://inch-ci.org/github/entrecode/ec.sdk.svg?branch=master
[doc-url]: http://inch-ci.org/github/entrecode/ec.sdk

