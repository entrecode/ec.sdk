# ec.api-sdk

* SDK should be modularized.
    * core
        * request stuff
        * error stuff
        * validation stuff (schema)
            * check for sanity in filter functions
            * validate prior to request
            * validate when invoking setter
    * session
        * login/logout/register
            * post form
            * cookie magic
            * token directly
        * session storage
    * acc
        * accounts
        * tokens
        * groups
        * (permissions)
        * invalid permissions
    * dm models
        * dms
        * models
            * policies
            * sync
            * hook
            * …
    * dm files
        * assets/deleted assets
        * tags
    * dm accounts
        * clients
        * accounts
        * roles
        * stats
    * app
        * apps
        * platforms
        * types
        * targets/datasources/codesources/
        * builds
        * deployments
        * stats
    * public API
        * *tbd later*
        * on set of entry property validation of specific field
    * dm-history,search,pay
* Single root object `ec` which includes all SDK modules.
    * `ec.session.…`
    * `ec.accounts.…`
    * `ec.apps.…`
    * `ec.datamanager.…`
    * …
    * is this possible?
    
This ^ is not necessary since we use webpack for frontend projects
    
* Error Handler - EventEmitter?
    * errors with ec.codes - not http status
    * better handling of error messages (i18n?)
* json schema validation within sdk (reduce 4xx requests)
* importable (ES6, webpack, …)
* same structure for all resources
* object oriented approach
    * use getter/setter
        * single fields
        * complete object (getJSON/fromJSON)
        * resolve for known linked resources
    * flag changed/unchanged
    * dry run functions (can I set this to name: awesome; sync bool return)
* HAL iterator functions
    * map over entries (uses next relation)
    * listResource.map(iterator)
* Resources as subclasses of promise? <- does not work as we want
    * ec.app(…).then(…), ec.dm.model(…).then()
    * ec.apps(…).list() => {count, total, array}
    * ec.app(…).platform(…), ec.dm.model(…).map(…)
    * class App extends Promise{}
* Typings for typescript
    * *.d.ts for the module
    * package.json with typings property


```js
filter = {
  size: 5,
  page: 2,
  sort: ['asc', '+alsoasc', '-desc'],
  filter: {
    <property>: {
      exact: 'value',
      search: 'value',
      from: 'value',
      to: 'value',
      any: [
        'value1',
        'value2'
      ],
      all: [
        'value1',
        'value2'
      ]
    },
    <property>: ‘value’ // exact filter
  }
}
```

Felix' Wunsch Syntax ;):

```js
datamanager.model('person').entry(id).then(person => {
  person.value(); // return entry value object
  person.value('name'); //return value of property 'name'
  person.value({name:'Bobby'}); //set property 'name' to 'Bobby'
  person.value(['name','age']); //return object with given property values => maybe not needed
  person.value({name:'Tom',age:10}); //set properties
  person.save(); //save entry
  person.delete();
});
```    


#### implementation order
* Core
* Login/Logout/Register
    * Session storage
    * @Ruben SDK vs. Redirects?
* Data Manager
    * dms, models, assets, tags
    * clients, accounts, roles, stats
* Accounts
    * accounts, groups, permissions
    * tokens, invalid permissions
* Apps
    * apps, builds, deployments
    * platforms, types, plugins, stats
* dm-history (server side events), search, pay

[Simple nodejs Module in Browser](http://www.richardrodger.com/2013/09/27/how-to-make-simple-node-js-modules-work-in-the-browser/#.WD2hsqLhA18)

[Awesome JS API Design](http://webstandardssherpa.com/reviews/secrets-of-awesome-javascript-api-design/)

[Webpack Author Lib](https://webpack.js.org/guides/author-libraries/)

[Local Storage](https://github.com/capaj/localstorage-polyfill)

[Promise as Parent](http://ibnrubaxa.blogspot.de/2014/07/how-to-inherit-native-promise.html)

[ES6 Module](http://www.2ality.com/2014/09/es6-modules-final.html)

[node vs esm](https://hackernoon.com/node-js-tc-39-and-modules-a1118aecf95e#.euc8pj782)

[ES6M and CJS the right way?](https://github.com/rollup/d3-jsnext/tree/0fcfe6e195f14c07d6b94f67e373e23f3da1cbbc)

[Type Declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

[Typings](https://medium.com/@mweststrate/how-to-create-strongly-typed-npm-modules-1e1bda23a7f4#.ag1swgmaw)

[Generate Typings](https://github.com/ConquestArrow/dtsmake)

[Sinon Best Practices](https://semaphoreci.com/community/tutorials/best-practices-for-spies-stubs-and-mocks-in-sinon-js)
