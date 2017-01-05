# ec.api-sdk

> SDK for most APIs of AppCMS by entrecode. By entrecode.
> 
> This is under active development and not yet ready for use!

[![Build Status][npm-image]][npm-url]

## Basic Usage

```sh
npm i --save ec.api
```

##### Node

```js
const ec = require('ec.api');

ec.datamanager.list( {size: 20, page:3 } )
.then(list => doSomething(list));
```

##### Browser

###### Webpack

```js
import {datamanager, apps} from 'ec.api';

ec.datamanager.list( {size: 20, page:3 } )
.then(list => doSomething(list));
```

###### Other

Good luck :) (maybe we can add browserify build?)

## APIs

* [Accounts](./doc/accounts)
* [AppManager](./doc/appmanager)
* [DataManager](./doc/datamanager)

[npm-image]: https://travis-ci.org/entrecode/ec.sdk.svg?branch=master
[npm-url]: https://travis-ci.org/entrecode/ec.sdk
