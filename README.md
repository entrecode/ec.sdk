# ec.api-sdk

> SDK for most APIs of AppCMS by entrecode. By entrecode.
> 
> This is under active development and not yet ready for use!

[![Build Status][travis-image]][travis-url] [![Coverage Status][cover-image]][cover-url]

## Basic Usage

```sh
npm i --save ec.api
```

###### ES6 / Webpack

```js
import {DataManager, Accounts} from 'ec.api';

const dataManager = new DataManager('live', accessToken);

dataManager.list()
.then(list => doSomthingWith(list))
.catch(console.log);
```

##### Node

```js
const ec = require('ec.api');
const dataManager = new ec.DataManager('live', accessToken);

dataManager.list()
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
    
    var dataManager = new ec.DataManager('live', accessToken);
    dataManager.list()
    .then(list => doSomthingWith(list))
    .catch(console.log);
</script>

```

[travis-image]: https://travis-ci.org/entrecode/ec.sdk.svg?branch=master
[travis-url]: https://travis-ci.org/entrecode/ec.sdk
[cover-image]: https://coveralls.io/repos/github/entrecode/ec.sdk/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/entrecode/ec.sdk?branch=master
