<a name="0.11.4"></a>
## 0.11.4 (2017-11-28)

* release version 0.11.4 ([573cd6e](https://github.com/entrecode/ec.sdk/commit/573cd6e))
* refactor: reworked all resources to use interface/class with defineProperties, should make all nice  ([0b4187a](https://github.com/entrecode/ec.sdk/commit/0b4187a))



<a name="0.11.3"></a>
## 0.11.3 (2017-11-27)

* release version 0.11.3 ([98d8950](https://github.com/entrecode/ec.sdk/commit/98d8950))
* fix: remove power-assert warnings from webpack builds ([c825822](https://github.com/entrecode/ec.sdk/commit/c825822))



<a name="0.11.2"></a>
## 0.11.2 (2017-11-21)

* release version 0.11.2 ([c218c62](https://github.com/entrecode/ec.sdk/commit/c218c62))
* feat: make list resources stringifyable, adds items property ([ad40192](https://github.com/entrecode/ec.sdk/commit/ad40192))



<a name="0.11.1"></a>
## 0.11.1 (2017-11-15)

* release version 0.11.1 ([8a0ac32](https://github.com/entrecode/ec.sdk/commit/8a0ac32))



<a name="0.11.0"></a>
# 0.11.0 (2017-11-15)

* release version 0.11.0 ([4bd537b](https://github.com/entrecode/ec.sdk/commit/4bd537b))
* refactor: only add built sources for npm package, should allow angular production builds ([fd1e4f2](https://github.com/entrecode/ec.sdk/commit/fd1e4f2))
* fix: typings for bestFile methods in DataManager API Connector ([92a9667](https://github.com/entrecode/ec.sdk/commit/92a9667))


### BREAKING CHANGE

* import for typescript projects changed from `src` to `lib`.

before:

```js
import { EntryResource } from 'ec.sdk/src/resources/publicAPI/EntryResource';
```

after:

```js
import { EntryResource } from 'ec.sdk/lib/resources/publicAPI/EntryResource';
```


<a name="0.10.2"></a>
## 0.10.2 (2017-11-15)

* release version 0.10.2 ([3633aea](https://github.com/entrecode/ec.sdk/commit/3633aea))
* fix: dirty detection did not handle complex types ([edf3155](https://github.com/entrecode/ec.sdk/commit/edf3155))
* fix: throw error when filterOptions are not an object ([f452c3e](https://github.com/entrecode/ec.sdk/commit/f452c3e))
* tests: tests for filterOptions not an object, response not a json ([957abe4](https://github.com/entrecode/ec.sdk/commit/957abe4))
* refactor: reduce duplicate code in helper ([cf5d4f2](https://github.com/entrecode/ec.sdk/commit/cf5d4f2))



<a name="0.10.1"></a>
## 0.10.1 (2017-11-10)

* release version 0.10.1 ([61fd0f4](https://github.com/entrecode/ec.sdk/commit/61fd0f4))
* feat: handle weird responses which are not a json ([33567eb](https://github.com/entrecode/ec.sdk/commit/33567eb))



<a name="0.10.0"></a>
# 0.10.0 (2017-11-09)

* release version 0.10.0 ([cd724b9](https://github.com/entrecode/ec.sdk/commit/cd724b9))
* fix: handle prefilled dataManagerID on assetGroup relations CMS-2986 ([cc343ac](https://github.com/entrecode/ec.sdk/commit/cc343ac))
* chore: package-lock update ([1249ca0](https://github.com/entrecode/ec.sdk/commit/1249ca0))
* chore: untrack .idea ([f7be172](https://github.com/entrecode/ec.sdk/commit/f7be172))
* chore: update gitignore ([ee95b09](https://github.com/entrecode/ec.sdk/commit/ee95b09))
* chore: updated idea config ([dd7051e](https://github.com/entrecode/ec.sdk/commit/dd7051e))
* test: dmAssetCreate tests ([b55c88a](https://github.com/entrecode/ec.sdk/commit/b55c88a))
* test: removed dangling comma node 6 doesn’t like ([e47fdd8](https://github.com/entrecode/ec.sdk/commit/e47fdd8))
* feat: adds AssetGroup resources and DMAsset resources (aka asset-neue) ([6606d43](https://github.com/entrecode/ec.sdk/commit/6606d43))
* feat: best file helper in PublicAPI support for assetsNeue ([2be785c](https://github.com/entrecode/ec.sdk/commit/2be785c))
* feat: createDMAsset returns DMAssetList directly ([2385356](https://github.com/entrecode/ec.sdk/commit/2385356))
* feat: createDMAssets, dmAsset and dmAssetList in PublicAPI ([543c8da](https://github.com/entrecode/ec.sdk/commit/543c8da))
* feat: DMAssetResource and AssetGroupResource CMS-2971 CMS-2972 ([292f74c](https://github.com/entrecode/ec.sdk/commit/292f74c))
* feat: file helper for DMAssetResource ([1e804ce](https://github.com/entrecode/ec.sdk/commit/1e804ce))



<a name="0.9.1"></a>
## 0.9.1 (2017-10-30)

* release version 0.9.1 ([8e9d81d](https://github.com/entrecode/ec.sdk/commit/8e9d81d))
* fix: fixed querystring typings ([2b46291](https://github.com/entrecode/ec.sdk/commit/2b46291))
* chore: patchday ([ecb6186](https://github.com/entrecode/ec.sdk/commit/ecb6186))



<a name="0.9.0"></a>
# 0.9.0 (2017-10-12)

* release version 0.9.0 ([1f55373](https://github.com/entrecode/ec.sdk/commit/1f55373))
* tests: add various tests ([5789c22](https://github.com/entrecode/ec.sdk/commit/5789c22))
* tests: missing tests for generic resource functions ([f8b0b0b](https://github.com/entrecode/ec.sdk/commit/f8b0b0b))
* feat: add warning when token could not be saven into cookie ([911c474](https://github.com/entrecode/ec.sdk/commit/911c474))
* feat: change email in PublicAPI ([335b4e7](https://github.com/entrecode/ec.sdk/commit/335b4e7))
* feat: create model in DataManagerResource CMS-2969 ([c832547](https://github.com/entrecode/ec.sdk/commit/c832547))
* feat: generic resource/list resource for Resources COM-77 ([3db40c0](https://github.com/entrecode/ec.sdk/commit/3db40c0))
* feat: generic resourceList() and resource() methods for API Connectors ([7d9a173](https://github.com/entrecode/ec.sdk/commit/7d9a173))
* feat: removed hardcoded urls in asset best file CMS-2942 ([2d9e5bb](https://github.com/entrecode/ec.sdk/commit/2d9e5bb))
* feat: request cache for permission checks ([87a76e7](https://github.com/entrecode/ec.sdk/commit/87a76e7))
* feat: start sync in model resource CMS-2967 ([7e4a309](https://github.com/entrecode/ec.sdk/commit/7e4a309))
* feat: throw on list requests with _levels parameter CMS-2963 ([2e23d21](https://github.com/entrecode/ec.sdk/commit/2e23d21))
* feat: validate functions for Resource and EntryResource(fields) CMS-2908 ([d481b4a](https://github.com/entrecode/ec.sdk/commit/d481b4a))
* chore: removed unused files ([d7e14d1](https://github.com/entrecode/ec.sdk/commit/d7e14d1))
* chore: updated package.json with json-schema-remote 1.3.1 ([fa474d9](https://github.com/entrecode/ec.sdk/commit/fa474d9))
* chore(package): update coveralls to version 3.0.0 ([a069fa2](https://github.com/entrecode/ec.sdk/commit/a069fa2))
* chore(package): update mocha to version 4.0.0 ([0d13d76](https://github.com/entrecode/ec.sdk/commit/0d13d76))
* chore(package): update sinon to version 4.0.0 ([28c2035](https://github.com/entrecode/ec.sdk/commit/28c2035))
* fix: adds string to typings for AssetList#download return type ([5229bf6](https://github.com/entrecode/ec.sdk/commit/5229bf6))
* fix: removed the hack for filter/filterOptions doc, found better solution ([44b6433](https://github.com/entrecode/ec.sdk/commit/44b6433))
* fix: resource not marked as dirty when set CMS-2938 ([c5ef0d7](https://github.com/entrecode/ec.sdk/commit/c5ef0d7))
* fix: wrong path for helper import ([d81a5ff](https://github.com/entrecode/ec.sdk/commit/d81a5ff))
* doc: use a hack to add filter/filterOptions to docs ([db0eb1a](https://github.com/entrecode/ec.sdk/commit/db0eb1a))
* test: fix typo in tests ([8131fb4](https://github.com/entrecode/ec.sdk/commit/8131fb4))



<a name="0.8.9"></a>
## 0.8.9 (2017-09-11)

*  docs: hide private createEntry and createList in docs ([88597d3](https://github.com/entrecode/ec.sdk/commit/88597d3))
* release version 0.8.9 ([8a0be83](https://github.com/entrecode/ec.sdk/commit/8a0be83))
* fix: adds typing for packageJson in helper.ts ([b6a4f39](https://github.com/entrecode/ec.sdk/commit/b6a4f39))



<a name="0.8.8"></a>
## 0.8.8 (2017-09-11)

* release version 0.8.8 ([5067bef](https://github.com/entrecode/ec.sdk/commit/5067bef))
* fix: define properties even if they are "missing" in EntryResource ([8947b00](https://github.com/entrecode/ec.sdk/commit/8947b00))



<a name="0.8.7"></a>
## 0.8.7 (2017-09-09)

* add caret to dependecy, update some, tested doc build ([a59ee77](https://github.com/entrecode/ec.sdk/commit/a59ee77))
* release version 0.8.7 ([f4731af](https://github.com/entrecode/ec.sdk/commit/f4731af))
* fix: fixed JSON.stringify of resource ([6d24b5e](https://github.com/entrecode/ec.sdk/commit/6d24b5e))
* fix: ListResource with enumerable properties and ts interface ([82b449c](https://github.com/entrecode/ec.sdk/commit/82b449c))
* fix: Public Resources with enumerable properties and ts interface ([cb3b1c9](https://github.com/entrecode/ec.sdk/commit/cb3b1c9))
* fix: reworked promise chain in Resource#save ([8348185](https://github.com/entrecode/ec.sdk/commit/8348185))
* refactor: AccountResource enumerable properties with ts interface ([9da0608](https://github.com/entrecode/ec.sdk/commit/9da0608))
* chore: updated idea config ([14851bb](https://github.com/entrecode/ec.sdk/commit/14851bb))
* chore(package): update documentation to version 5.3.1 ([8cf49eb](https://github.com/entrecode/ec.sdk/commit/8cf49eb))
* doc: fix filter object in PublicAPI example ([1788a73](https://github.com/entrecode/ec.sdk/commit/1788a73))



<a name="0.8.6"></a>
## 0.8.6 (2017-09-08)

* release version 0.8.6 ([4557528](https://github.com/entrecode/ec.sdk/commit/4557528))
* fix: cookieModifier handling of undefined values ([13c513d](https://github.com/entrecode/ec.sdk/commit/13c513d))



<a name="0.8.5"></a>
## 0.8.5 (2017-09-06)

* release version 0.8.5 ([3b232f6](https://github.com/entrecode/ec.sdk/commit/3b232f6))
* fix: unexported aliases ([0b91795](https://github.com/entrecode/ec.sdk/commit/0b91795))



<a name="0.8.4"></a>
## 0.8.4 (2017-09-06)

* release version 0.8.4 ([09aecc4](https://github.com/entrecode/ec.sdk/commit/09aecc4))
* doc: fixed wrong example in doc CMS-2921 ([cba26f4](https://github.com/entrecode/ec.sdk/commit/cba26f4))
* doc: rearranged methods for proper sorting in doc ([5f8234c](https://github.com/entrecode/ec.sdk/commit/5f8234c))
* doc: reworked doc introduction and API connectors CMS-2923 ([9493512](https://github.com/entrecode/ec.sdk/commit/9493512))
* feat: getOriginal() for [Public]AssetResources ([3aeb51b](https://github.com/entrecode/ec.sdk/commit/3aeb51b))



<a name="0.8.3"></a>
## 0.8.3 (2017-09-04)

* release version 0.8.3 ([4258ea0](https://github.com/entrecode/ec.sdk/commit/4258ea0))
* chore: release script back to working version ([675d1a8](https://github.com/entrecode/ec.sdk/commit/675d1a8))
* feat: DataManagerResource#getPublicAPI() for creating a PublicAPI from Data Manager CMS-2933 ([62df352](https://github.com/entrecode/ec.sdk/commit/62df352))



<a name="0.8.2"></a>
## 0.8.2 (2017-09-04)

* chore: dot reporter for tests ([66b552c](https://github.com/entrecode/ec.sdk/commit/66b552c))
* chore: package patches, new package-lock ([b9b58b1](https://github.com/entrecode/ec.sdk/commit/b9b58b1))
* chore(package): update documentation to version 5.3.0 ([ce7d408](https://github.com/entrecode/ec.sdk/commit/ce7d408))
* fix: changelog mix up ([1894f89](https://github.com/entrecode/ec.sdk/commit/1894f89))
* fix: main file fix, browser build fix ([c31adf6](https://github.com/entrecode/ec.sdk/commit/c31adf6))
* fix: manually create index.js to match index.js in root dir ([1a49999](https://github.com/entrecode/ec.sdk/commit/1a49999))
* fix: typings fix for event listeners ([d1e6744](https://github.com/entrecode/ec.sdk/commit/d1e6744))
* refactor: getter setter instead of Object.defineProperty for API Connectors an PublicAPI CMS-2932 ([74b6df2](https://github.com/entrecode/ec.sdk/commit/74b6df2))
* refactor: moved index into root directory ([5df4f1e](https://github.com/entrecode/ec.sdk/commit/5df4f1e))
* refactor: switch to proper getter/setter CMS-2932 ([ca04bc0](https://github.com/entrecode/ec.sdk/commit/ca04bc0))



<a name="0.8.1"></a>
## 0.8.1 (2017-09-01)

* refactor: do not export Symbols use Symbol.for(…) ([aef1353](https://github.com/entrecode/ec.sdk/commit/aef1353))
* refactor: environment type belongs to Core not ListResource ([a502a1d](https://github.com/entrecode/ec.sdk/commit/a502a1d))
* refactor: PublicAssetResource#resolve to Resource#resolve CMS-2927 ([25154bb](https://github.com/entrecode/ec.sdk/commit/25154bb))
* refactor: use this.getLinks and similar instead of this[resourceSymbol].links etc. ([fbd014a](https://github.com/entrecode/ec.sdk/commit/fbd014a))
* feat: ListResources are now iterable CMS-2929 ([6f1e0d7](https://github.com/entrecode/ec.sdk/commit/6f1e0d7))
* chore: updated release script for improved conventional changelog version ([45eed87](https://github.com/entrecode/ec.sdk/commit/45eed87))
* release version 0.8.0 ([b72fb46](https://github.com/entrecode/ec.sdk/commit/b72fb46))



<a name="0.8.0"></a>
# 0.8.0 (2017-09-01)

* refactor: major refactor. switched sources to typescript to get rid of extra typings files. ([cfc9a4e](https://github.com/entrecode/ec.sdk/commit/cfc9a4e))
* release version 0.7.1 ([91387e4](https://github.com/entrecode/ec.sdk/commit/91387e4))
* fix: count properties when PublicAssetResource is resolved ([3e5496e](https://github.com/entrecode/ec.sdk/commit/3e5496e))
* fix: getter/setter for linked types must handle missing links/embeds CMS-2924 ([9634ec1](https://github.com/entrecode/ec.sdk/commit/9634ec1))
* revert: chore: documentation alphabetically CMS-2922 ([ff2154c](https://github.com/entrecode/ec.sdk/commit/ff2154c))
* chore: changelog fix for breaking change ([527c7d8](https://github.com/entrecode/ec.sdk/commit/527c7d8))
* chore: documentation alphabetically CMS-2922 ([14d29cd](https://github.com/entrecode/ec.sdk/commit/14d29cd))


### BREAKING CHANGE

* All import statements will change with this update. Also note that some bug were fixed during the refactor. Those also include some typos in function names, but only of functions I'm certain nobody is using. :-D

Before:

```js
// …
import { AccountResource } from 'ec.sdk/typings/resources/accounts/AccountResource';
// …
```

After:

```js
// …
import AccountResource from 'ec.sdk/src/resources/accounts/AccountResource';
// …
```


<a name="0.7.1"></a>
## 0.7.1 (2017-08-29)

* release version 0.7.1 ([91387e4](https://github.com/entrecode/ec.sdk/commit/91387e4))
* fix: count properties when PublicAssetResource is resolved ([3e5496e](https://github.com/entrecode/ec.sdk/commit/3e5496e))
* fix: getter/setter for linked types must handle missing links/embeds CMS-2924 ([9634ec1](https://github.com/entrecode/ec.sdk/commit/9634ec1))
* revert: chore: documentation alphabetically CMS-2922 ([ff2154c](https://github.com/entrecode/ec.sdk/commit/ff2154c))
* chore: changelog fix for breaking change ([527c7d8](https://github.com/entrecode/ec.sdk/commit/527c7d8))
* chore: documentation alphabetically CMS-2922 ([14d29cd](https://github.com/entrecode/ec.sdk/commit/14d29cd))



<a name="0.7.0"></a>
# 0.7.0 (2017-08-29)

* feat: allow createEntry with direct loading of nested elements CMS-2905 ([b7e0cd6](https://github.com/entrecode/ec.sdk/commit/b7e0cd6))
* feat: "Lite" PublicAssetResource for better handling of entries. Used for ec-form. ([88a3639](https://github.com/entrecode/ec.sdk/commit/88a3639))
* feat: LiteEntryResource for better handling of entry title. Used for ec-form. CMS-2 ([ec21a79](https://github.com/entrecode/ec.sdk/commit/ec21a79))
* release version 0.7.0 ([7d842ac](https://github.com/entrecode/ec.sdk/commit/7d842ac))
* refactor: manually set isResolved flag for PublicAssetResource ([b8ed06e](https://github.com/entrecode/ec.sdk/commit/b8ed06e))
* fix: another fix for those createAsset(s) typings 😀 ([18d00da](https://github.com/entrecode/ec.sdk/commit/18d00da))
* fix: FormData in createAsset(s) has set function, not field ([64794a7](https://github.com/entrecode/ec.sdk/commit/64794a7))
* fix: input type for createAssets ([ee07643](https://github.com/entrecode/ec.sdk/commit/ee07643))
* fix: options are optional on createAsset(s) ([e8a8569](https://github.com/entrecode/ec.sdk/commit/e8a8569))
* fix: token handling for superagent helper as well CMS-2916 ([1933169](https://github.com/entrecode/ec.sdk/commit/1933169))
* fix: typings for PublicAPI#createAsset(s) ([9c5e7fc](https://github.com/entrecode/ec.sdk/commit/9c5e7fc))

### BREAKING CHANGE:

* feat: "Lite" PublicAssetResource for better handling of entries. Used for ec-form.

    Since version 0.7.0 the ec.sdk supports "Lite" PublicAssetResources. Those are used to better support EntryResources in ec-forms. They are a stripped down versions of PublicAssetResources containing everything but `tags`. The reason to add this was better support of title handling for linked entries.

    Migration is straight forward, just add `.assetID` on all linked entry types when you don't use nested assets.

    Before:

    ```js
    publicAPI.entry('myModel', entryID)
    .then((entry) => {
      console.log(entry.asset); // would print `assetID`
    });
    ```

    After:

    ```js
    publicAPI.entry('myModel', entryID)
    .then((entry) => {
      console.log(entry.asset.assetID); // would print `assetID`
    });
    ```

* feat: LiteEntryResource for better handling of entry title. Used for ec-form.

    Since version 0.7.0 the ec.sdk supports LiteEntryResources. Those are used to better support EntryResources in ec-forms. They are a stripped down versions of EntryResources only containing `id`, `_id`, `_entryTitle`, and `getModelTitle()`. The reason to add this was better support of title handling for linked entries.

    Migration is straight forward, just add `.id` on all linked entry types when you don't use nested entries.

    Before:

    ```js
    publicAPI.entry('myModel', entryID)
    .then((entry) => {
      console.log(entry.linkedEntry); // would print `entryID`
    });
    ```

    After:

    ```js
    publicAPI.entry('myModel', entryID)
    .then((entry) => {
      console.log(entry.linkedEntry.id); // would print `entryID`
    });
    ```
    
<a name="0.6.13"></a>
## 0.6.13 (2017-08-25)

* release version 0.6.13 ([393d5fa](https://github.com/entrecode/ec.sdk/commit/393d5fa))
* fix: null value handling in EntryResource CMS-2909, CMS-2910 ([7cc4986](https://github.com/entrecode/ec.sdk/commit/7cc4986))
* fix: token handling for publicAPIs with logged in ecUser (via Session) CMS-2916 ([514d4f0](https://github.com/entrecode/ec.sdk/commit/514d4f0))



<a name="0.6.12"></a>
## 0.6.12 (2017-08-24)

* release version 0.6.12 ([63ed1a8](https://github.com/entrecode/ec.sdk/commit/63ed1a8))
* feat: _entryTitle field in EntryResource CMS-2911 ([8c4384d](https://github.com/entrecode/ec.sdk/commit/8c4384d))
* chore: updated package-lock ([42c43a9](https://github.com/entrecode/ec.sdk/commit/42c43a9))
* chore(package): update documentation to version 5.2.2 ([7cd070a](https://github.com/entrecode/ec.sdk/commit/7cd070a))



<a name="0.6.11"></a>
## 0.6.11 (2017-08-22)

* release version 0.6.11 ([8c374e8](https://github.com/entrecode/ec.sdk/commit/8c374e8))
* chore: add package-lock.json to release script ([58957a2](https://github.com/entrecode/ec.sdk/commit/58957a2))
* chore: adds package lock ([d0ae0c1](https://github.com/entrecode/ec.sdk/commit/d0ae0c1))
* chore: no Babel file watcher pls ([f97bc29](https://github.com/entrecode/ec.sdk/commit/f97bc29))
* chore(package): update documentation to version 5.2.0 ([76b5564](https://github.com/entrecode/ec.sdk/commit/76b5564))
* chore(package): update documentation to version 5.2.1 ([2f16540](https://github.com/entrecode/ec.sdk/commit/2f16540))
* feat: EntryResource#getTitle() now for entry and nested elements CMS-2901 ([7b572fd](https://github.com/entrecode/ec.sdk/commit/7b572fd))
* feat: PublicResource#getLevelCount for returning # of levels CMS-2900 ([485fd28](https://github.com/entrecode/ec.sdk/commit/485fd28))
* fix: getAllItems on PublicAssetList broken CMS-2907 ([9ab3a21](https://github.com/entrecode/ec.sdk/commit/9ab3a21))
* fix: getter for date time fields returned 1.1.1970 for null dates ([01f4071](https://github.com/entrecode/ec.sdk/commit/01f4071))
* fix: typings fixes for public assets CMS-2906 ([65f59bd](https://github.com/entrecode/ec.sdk/commit/65f59bd))



<a name="0.6.10"></a>
## 0.6.10 (2017-08-09)

* release version 0.6.10 ([6673a9f](https://github.com/entrecode/ec.sdk/commit/6673a9f))
* feat: template parameter on PublicAPI#getAuthLink ([0ec07c8](https://github.com/entrecode/ec.sdk/commit/0ec07c8))



<a name="0.6.9"></a>
## 0.6.9 (2017-08-09)

* release version 0.6.9 ([9f44937](https://github.com/entrecode/ec.sdk/commit/9f44937))
* feat: PublicAPI#getAuthLink for auth link retrieval ([3625690](https://github.com/entrecode/ec.sdk/commit/3625690))



<a name="0.6.8"></a>
## 0.6.8 (2017-08-08)

* release version 0.6.8 ([582af4f](https://github.com/entrecode/ec.sdk/commit/582af4f))
* feat: resources with additional properties will throw on save CMS-2883 ([bce4557](https://github.com/entrecode/ec.sdk/commit/bce4557))
* fix: more types allowed on filter CMS-2882 ([8013ec8](https://github.com/entrecode/ec.sdk/commit/8013ec8))
* chore(package): update documentation to version 5.1.1 ([c390e54](https://github.com/entrecode/ec.sdk/commit/c390e54))



<a name="0.6.7"></a>
## 0.6.7 (2017-08-04)

* release version 0.6.7 ([331a0fc](https://github.com/entrecode/ec.sdk/commit/331a0fc))
* chore: require json-schema-remote 1.2.2, will remove warnings from webpack ([9678e62](https://github.com/entrecode/ec.sdk/commit/9678e62))
* chore(package): update documentation to version 5.1.0 ([d5d1d28](https://github.com/entrecode/ec.sdk/commit/d5d1d28)), closes [#2](https://github.com/entrecode/ec.sdk/issues/2)
* chore(package): update sinon to version 3.0.0 ([9c19924](https://github.com/entrecode/ec.sdk/commit/9c19924))
* fix: PublicAPI#createEntry follow link ([5f1d983](https://github.com/entrecode/ec.sdk/commit/5f1d983))
* doc: fixed typo in doc ([1562f34](https://github.com/entrecode/ec.sdk/commit/1562f34))



<a name="0.6.6"></a>
## 0.6.6 (2017-07-21)

* release version 0.6.6 ([35a01c2](https://github.com/entrecode/ec.sdk/commit/35a01c2))
* chore: adds new npm auth token, hopefully fix deployment builds ([807b7bc](https://github.com/entrecode/ec.sdk/commit/807b7bc))



<a name="0.6.5"></a>
## 0.6.5 (2017-07-21)

* release version 0.6.5 ([27c544c](https://github.com/entrecode/ec.sdk/commit/27c544c))
* fix: typo in typings ([84606c3](https://github.com/entrecode/ec.sdk/commit/84606c3))
* test: fixed all broken assertions ([d14673e](https://github.com/entrecode/ec.sdk/commit/d14673e))
* docs: reordered badges ([9159f4a](https://github.com/entrecode/ec.sdk/commit/9159f4a))
* docs(readme): add Greenkeeper badge ([c8033ec](https://github.com/entrecode/ec.sdk/commit/c8033ec))
* chore(package): update dependencies ([518d29b](https://github.com/entrecode/ec.sdk/commit/518d29b))



<a name="0.6.4"></a>
## 0.6.4 (2017-07-20)

* release version 0.6.4 ([0f92878](https://github.com/entrecode/ec.sdk/commit/0f92878))
* feat: sanity checks for filter options CMS-2820 ([e4287e6](https://github.com/entrecode/ec.sdk/commit/e4287e6))
* doc: add new docs build ([5912036](https://github.com/entrecode/ec.sdk/commit/5912036))
* doc: fixed some doc issues ([3b4066c](https://github.com/entrecode/ec.sdk/commit/3b4066c))
* doc: fixed some doc issues ([fb84f5b](https://github.com/entrecode/ec.sdk/commit/fb84f5b))
* chore: new path to node and eslint, editor config ([a9ac9fa](https://github.com/entrecode/ec.sdk/commit/a9ac9fa))



<a name="0.6.3"></a>
## 0.6.3 (2017-07-18)

* release version 0.6.3 ([03feb29](https://github.com/entrecode/ec.sdk/commit/03feb29))
* fix: another fix for Problem detection in superagent helper ([c399c48](https://github.com/entrecode/ec.sdk/commit/c399c48))
* fix: schema handling for EntryResource#save() CMS-2844 ([1f9ce99](https://github.com/entrecode/ec.sdk/commit/1f9ce99))
* chore: new editor config ([2caf81c](https://github.com/entrecode/ec.sdk/commit/2caf81c))



<a name="0.6.2"></a>
## 0.6.2 (2017-07-12)

* release version 0.6.2 ([9bd2ac2](https://github.com/entrecode/ec.sdk/commit/9bd2ac2))
* fix: asset helper in publicAPI url templating ([c657329](https://github.com/entrecode/ec.sdk/commit/c657329))
* fix: response handling of superagentGet responses ([41a68e2](https://github.com/entrecode/ec.sdk/commit/41a68e2))
* fix: undefined locale header in file api of publicAPI ([6597b83](https://github.com/entrecode/ec.sdk/commit/6597b83))



<a name="0.6.1"></a>
## 0.6.1 (2017-07-10)

* release version 0.6.1 ([86983ec](https://github.com/entrecode/ec.sdk/commit/86983ec))
* feat: handle null values on entries/assets fields ([4b984e1](https://github.com/entrecode/ec.sdk/commit/4b984e1))
* chore: add node 8 to travis config ([9533d9a](https://github.com/entrecode/ec.sdk/commit/9533d9a))



<a name="0.6.0"></a>
# 0.6.0 (2017-07-06)

* release version 0.6.0 ([d730046](https://github.com/entrecode/ec.sdk/commit/d730046))
* feat: getToken support ([d1f33ba](https://github.com/entrecode/ec.sdk/commit/d1f33ba))
* feat: tokens separated by Data Manager CMS-2828 ([ad920af](https://github.com/entrecode/ec.sdk/commit/ad920af))
* refactor: more resilient filterOptions typings ([293557d](https://github.com/entrecode/ec.sdk/commit/293557d))



<a name="0.5.7"></a>
## 0.5.7 (2017-07-06)

* release version 0.5.7 ([97d8c7d](https://github.com/entrecode/ec.sdk/commit/97d8c7d))
* feat: checkPermission with force refresh MYC-628 ([9e7b052](https://github.com/entrecode/ec.sdk/commit/9e7b052))



<a name="0.5.6"></a>
## 0.5.6 (2017-07-04)

* release version 0.5.6 ([779c54b](https://github.com/entrecode/ec.sdk/commit/779c54b))
* fix: nestedEntry support for null values ([a4c7544](https://github.com/entrecode/ec.sdk/commit/a4c7544))



<a name="0.5.5"></a>
## 0.5.5 (2017-06-29)

* release version 0.5.5 ([95e2ba4](https://github.com/entrecode/ec.sdk/commit/95e2ba4))
* feat: Resource#allLinks added ([ba62f8a](https://github.com/entrecode/ec.sdk/commit/ba62f8a))
* feat: Resource#getLinks for all link objects of a given key ([4c804d5](https://github.com/entrecode/ec.sdk/commit/4c804d5))
* feat: shortID property for PublicAPI ([560af28](https://github.com/entrecode/ec.sdk/commit/560af28))
* fix: add stream dependency so projects with angular cli work ([0526b4d](https://github.com/entrecode/ec.sdk/commit/0526b4d))
* fix: more resilient detection of traversons continue in Resource ([5dda38e](https://github.com/entrecode/ec.sdk/commit/5dda38e))
* fix: typings in PublicAPI invite property optional in signup ([54cf9b8](https://github.com/entrecode/ec.sdk/commit/54cf9b8))



<a name="0.5.4"></a>
## 0.5.4 (2017-06-21)

* release version 0.5.4 ([2a1f4e3](https://github.com/entrecode/ec.sdk/commit/2a1f4e3))
* fix: parsing of already parsed resources ([86a1d35](https://github.com/entrecode/ec.sdk/commit/86a1d35))



<a name="0.5.3"></a>
## 0.5.3 (2017-06-21)

* release version 0.5.3 ([6044b03](https://github.com/entrecode/ec.sdk/commit/6044b03))
* fix: creation of EntryList parameter order wrong ([39e0b15](https://github.com/entrecode/ec.sdk/commit/39e0b15))
* fix: detection of Promblem in superagent helper CMS-2813 ([7dfa398](https://github.com/entrecode/ec.sdk/commit/7dfa398))
* feat: only available properties in EntryResource CMS-2817 ([c1b0959](https://github.com/entrecode/ec.sdk/commit/c1b0959))



<a name="0.5.2"></a>
## 0.5.2 (2017-06-14)

* release version 0.5.2 ([f5828b1](https://github.com/entrecode/ec.sdk/commit/f5828b1))
* chore: no git hooks in release script ([4285ddf](https://github.com/entrecode/ec.sdk/commit/4285ddf))
* fix: handling of _fields property in filter ([b6df5b6](https://github.com/entrecode/ec.sdk/commit/b6df5b6))



<a name="0.5.1"></a>
## 0.5.1 (2017-06-14)

* release version 0.5.1 ([05785c3](https://github.com/entrecode/ec.sdk/commit/05785c3))
* feat: _fields filter for PublicAPI entry and entry list CMS-2816 ([3093fd7](https://github.com/entrecode/ec.sdk/commit/3093fd7))
* feat: export environment type in typings ([fe2c15c](https://github.com/entrecode/ec.sdk/commit/fe2c15c))
* feat: preloadSchemas CMS-2815 ([0be491f](https://github.com/entrecode/ec.sdk/commit/0be491f))
* doc: fixes typo in docs ([b2a86c4](https://github.com/entrecode/ec.sdk/commit/b2a86c4))



<a name="0.5.0"></a>
# 0.5.0 (2017-06-06)

* release version 0.5.0 ([e9c9f2c](https://github.com/entrecode/ec.sdk/commit/e9c9f2c))
* doc: add doc for ListResource.map() ([6734424](https://github.com/entrecode/ec.sdk/commit/6734424))
* doc: adds missing doc ([8822b2a](https://github.com/entrecode/ec.sdk/commit/8822b2a))
* doc: adds sort order for Apps documentation ([90a141a](https://github.com/entrecode/ec.sdk/commit/90a141a))
* doc: extends example in readme ([a85119b](https://github.com/entrecode/ec.sdk/commit/a85119b))
* doc: updated readme with webpack.config part ([0082c97](https://github.com/entrecode/ec.sdk/commit/0082c97))
* fix: a lot typing fixes ([fb169a6](https://github.com/entrecode/ec.sdk/commit/fb169a6))
* fix: fixed typings and small other things CMS-2801 ([eeaecbe](https://github.com/entrecode/ec.sdk/commit/eeaecbe))
* fix: support next, prev, first links for EntryList correctly ([158a8e7](https://github.com/entrecode/ec.sdk/commit/158a8e7))
* feat: add convenience relations CMS-2800 ([ede6d8b](https://github.com/entrecode/ec.sdk/commit/ede6d8b))
* feat: AppResource, AppList, basic Apps API Connector CMS-2567 ([b113fac](https://github.com/entrecode/ec.sdk/commit/b113fac))
* feat: AppStatsList and AppStatsResource CMS-2573 ([2cab8ef](https://github.com/entrecode/ec.sdk/commit/2cab8ef))
* feat: build resource CMS-2571 ([928f78f](https://github.com/entrecode/ec.sdk/commit/928f78f))
* feat: convenient functions in TypesResource ([65c76ac](https://github.com/entrecode/ec.sdk/commit/65c76ac))
* feat: create platform CMS-2797 ([0c5301c](https://github.com/entrecode/ec.sdk/commit/0c5301c))
* feat: deployment resource CMS-2572 ([a05e9dd](https://github.com/entrecode/ec.sdk/commit/a05e9dd))
* feat: getter/setter for platform plugins CMS-2802 ([b8d6989](https://github.com/entrecode/ec.sdk/commit/b8d6989))
* feat: list.map function in ListResource CMS-2609 ([f131469](https://github.com/entrecode/ec.sdk/commit/f131469))
* feat: PlatformList, PlatformResource CMS-2569 ([6d15d09](https://github.com/entrecode/ec.sdk/commit/6d15d09))
* feat: plugin create CMS-2570 ([12cde86](https://github.com/entrecode/ec.sdk/commit/12cde86))
* feat: plugin resources CMS-2570 ([12c8d6e](https://github.com/entrecode/ec.sdk/commit/12c8d6e))
* feat: public assets nested in entries CMS-2794 ([35ff58f](https://github.com/entrecode/ec.sdk/commit/35ff58f))
* feat: TypesResource CMS-2568 ([4599d77](https://github.com/entrecode/ec.sdk/commit/4599d77))
* feat: typings for ListResource#map() CMS-2609 ([237dcd9](https://github.com/entrecode/ec.sdk/commit/237dcd9))
* refactor: removed duplicate tests of cliendID ([3cf2fa5](https://github.com/entrecode/ec.sdk/commit/3cf2fa5))



<a name="0.4.0"></a>
# 0.4.0 (2017-05-19)

* release version 0.4.0 ([5f76e86](https://github.com/entrecode/ec.sdk/commit/5f76e86))
* test: fixed tests, added more ([1a03a34](https://github.com/entrecode/ec.sdk/commit/1a03a34))
* feat: add validation of dm-clients on create ([f2e9cf7](https://github.com/entrecode/ec.sdk/commit/f2e9cf7))
* feat: any, all filter of id fields in lists allowed CMS-2790 ([cb1080c](https://github.com/entrecode/ec.sdk/commit/cb1080c))
* feat: API connector for public api CMS-2763 ([7cd2080](https://github.com/entrecode/ec.sdk/commit/7cd2080))
* feat: asset file helper in EntryResource CMS-2782 ([e1692a2](https://github.com/entrecode/ec.sdk/commit/e1692a2))
* feat: create anonymous in public api CMS-2767 ([e39e1f3](https://github.com/entrecode/ec.sdk/commit/e39e1f3))
* feat: do not block login on old token ([122d096](https://github.com/entrecode/ec.sdk/commit/122d096))
* feat: email available check public api CMS-2768 ([ac60bd3](https://github.com/entrecode/ec.sdk/commit/ac60bd3))
* feat: entry list class CMS-2765 ([aee1ab8](https://github.com/entrecode/ec.sdk/commit/aee1ab8))
* feat: entry, entryList, createEntry in PublicAPICMS-2765 ([0ef9676](https://github.com/entrecode/ec.sdk/commit/0ef9676))
* feat: load “me” in public api CMS-2771 ([2324252](https://github.com/entrecode/ec.sdk/commit/2324252))
* feat: nested entries CMS-2778 ([9a55b7b](https://github.com/entrecode/ec.sdk/commit/9a55b7b))
* feat: public api user signup CMS-2769 ([0f30b6d](https://github.com/entrecode/ec.sdk/commit/0f30b6d))
* feat: public assts/tags CMS-2773, CMS-2774 ([6269bbd](https://github.com/entrecode/ec.sdk/commit/6269bbd))
* feat: public global asset helper CMS-2772 ([4ad6496](https://github.com/entrecode/ec.sdk/commit/4ad6496))
* feat: public model, getSchema CMS-2764 ([5701f88](https://github.com/entrecode/ec.sdk/commit/5701f88))
* feat: public permissions check CMS-2777 ([edeb716](https://github.com/entrecode/ec.sdk/commit/edeb716))
* feat: reset password public api CMS-2770 ([ac5a465](https://github.com/entrecode/ec.sdk/commit/ac5a465))
* feat: signin/signout in public api CMS-2762 ([0bfc93a](https://github.com/entrecode/ec.sdk/commit/0bfc93a))
* feat: simple EntryResource CMS-2766 ([578c6d6](https://github.com/entrecode/ec.sdk/commit/578c6d6))
* feat: support for _levels parameter in options CMS-2765 ([b71d467](https://github.com/entrecode/ec.sdk/commit/b71d467))
* feat: typings for CMS-2767 ([f5ff0b7](https://github.com/entrecode/ec.sdk/commit/f5ff0b7))
* feat: typings for CMS-2768 CMS-2769 CMS-2770 ([1907fcc](https://github.com/entrecode/ec.sdk/commit/1907fcc))
* feat: typings update for entry related functions ([ca847a1](https://github.com/entrecode/ec.sdk/commit/ca847a1))
* fix: detection of single resource query in public api ([a077ed5](https://github.com/entrecode/ec.sdk/commit/a077ed5))
* fix: handling of single item get in public api ([87e72ee](https://github.com/entrecode/ec.sdk/commit/87e72ee))
* fix: reloading of root response CMS-2779 ([4c17ba1](https://github.com/entrecode/ec.sdk/commit/4c17ba1))
* fix: test fix for CMS-2779 ([15c9f29](https://github.com/entrecode/ec.sdk/commit/15c9f29))
* refactor: do not use getAllItems on getItem(n) for better performance ([55f30ea](https://github.com/entrecode/ec.sdk/commit/55f30ea))
* refactor: renamed create functions for Entry classes ([aa8423f](https://github.com/entrecode/ec.sdk/commit/aa8423f))
* refactor: use Symbols for private properties CMS-2781 ([59d21d6](https://github.com/entrecode/ec.sdk/commit/59d21d6))
* docs: updated documentation order ([4d3dd22](https://github.com/entrecode/ec.sdk/commit/4d3dd22))
* docs: updated EntryResource doc ([2918aa6](https://github.com/entrecode/ec.sdk/commit/2918aa6))
* chore: build before coverage tasks ([f893a15](https://github.com/entrecode/ec.sdk/commit/f893a15))
* chore: fixed typo in changelog ([c86672e](https://github.com/entrecode/ec.sdk/commit/c86672e))



<a name="0.3.0"></a>
# 0.3.0 (2017-05-03)

* release version 0.3.0 ([c6a1b59](https://github.com/entrecode/ec.sdk/commit/c6a1b59))
* feat: add default user agent and Core#setUserAgent for cusstom one CMS-2628 ([8c8ddd8](https://github.com/entrecode/ec.sdk/commit/8c8ddd8))
* feat: add missing filter checks CMS-2707 ([ac8e247](https://github.com/entrecode/ec.sdk/commit/ac8e247))
* feat: asset file helper CMS-2705 ([82967a7](https://github.com/entrecode/ec.sdk/commit/82967a7))
* feat: assets resource (CMS-2564) and deleted assets resource (CMS-2703) ([63911e5](https://github.com/entrecode/ec.sdk/commit/63911e5))
* feat: best file in DataManager CMS-2706 ([df1073c](https://github.com/entrecode/ec.sdk/commit/df1073c))
* feat: best file negotiation in delted assets ([b36daaf](https://github.com/entrecode/ec.sdk/commit/b36daaf))
* feat: check permissions in Session and AccountResource ([bf5fc89](https://github.com/entrecode/ec.sdk/commit/bf5fc89))
* feat: client schema validation on create CMS-2751 ([3326061](https://github.com/entrecode/ec.sdk/commit/3326061))
* feat: create Asset CMS-2704 ([5096224](https://github.com/entrecode/ec.sdk/commit/5096224))
* feat: create dm from template dataSchema validation ([b5cdf8b](https://github.com/entrecode/ec.sdk/commit/b5cdf8b))
* feat: create dm-client CMS-2558 ([ff1496a](https://github.com/entrecode/ec.sdk/commit/ff1496a))
* feat: create multiple assets CMS-2719 ([82637b8](https://github.com/entrecode/ec.sdk/commit/82637b8))
* feat: create/update DataManager from Template CMS-2732 ([fd05bec](https://github.com/entrecode/ec.sdk/commit/fd05bec))
* feat: dm-account resource CMS-2560 ([73ffcc9](https://github.com/entrecode/ec.sdk/commit/73ffcc9))
* feat: dm-client resource CMS-2562 ([f081af5](https://github.com/entrecode/ec.sdk/commit/f081af5))
* feat: DMStatsResource CMS-2566 ([d395fab](https://github.com/entrecode/ec.sdk/commit/d395fab))
* feat: download option for assets CMS-2728 ([861f139](https://github.com/entrecode/ec.sdk/commit/861f139))
* feat: export datamanager CMS-2730 ([75df67f](https://github.com/entrecode/ec.sdk/commit/75df67f))
* feat: group create with validation CMS-2750 ([50a7953](https://github.com/entrecode/ec.sdk/commit/50a7953))
* feat: purge/restore deleted asset CMS-2729 ([de47cd7](https://github.com/entrecode/ec.sdk/commit/de47cd7))
* feat: resolve dm-templates ([ed4dbcb](https://github.com/entrecode/ec.sdk/commit/ed4dbcb))
* feat: Role resource CMS-2561 ([55561e9](https://github.com/entrecode/ec.sdk/commit/55561e9))
* feat: root response cache in Core CMS-2742 ([fcd9a31](https://github.com/entrecode/ec.sdk/commit/fcd9a31))
* feat: schema validation prior to put CMS-2595 ([1082d64](https://github.com/entrecode/ec.sdk/commit/1082d64))
* feat: TagResource CMS-2565 ([b393f4e](https://github.com/entrecode/ec.sdk/commit/b393f4e))
* feat: TemplateResource CMS-2563 ([2185c56](https://github.com/entrecode/ec.sdk/commit/2185c56))
* feat: typings for asset best file ([e612f51](https://github.com/entrecode/ec.sdk/commit/e612f51))
* feat: typings for dm-clients CMS-2562 ([f5bd2d9](https://github.com/entrecode/ec.sdk/commit/f5bd2d9))
* feat: validation create template CMS-2753 ([b946774](https://github.com/entrecode/ec.sdk/commit/b946774))
* feat: validation in create actions CMS-2743 ([573902e](https://github.com/entrecode/ec.sdk/commit/573902e))
* feat: validation of create role CMS-2752 ([4f739a2](https://github.com/entrecode/ec.sdk/commit/4f739a2))
* feat: validity check for filter CMS-2707 ([3b3429e](https://github.com/entrecode/ec.sdk/commit/3b3429e))
* fix: embedded name in RoleList ([36e5f8a](https://github.com/entrecode/ec.sdk/commit/36e5f8a))
* fix: fixed a really bad typo ([a436cb5](https://github.com/entrecode/ec.sdk/commit/a436cb5))
* fix: global transform for babelify ([855d660](https://github.com/entrecode/ec.sdk/commit/855d660))
* fix: return types in DataManager.d.ts ([2df8fa7](https://github.com/entrecode/ec.sdk/commit/2df8fa7))
* fix: some typings fixes ([a426f3f](https://github.com/entrecode/ec.sdk/commit/a426f3f))
* fix: wrong relation for DataManagerResource#stats ([06f6dd2](https://github.com/entrecode/ec.sdk/commit/06f6dd2))
* refactor: changelog old breaking change documented ([90ba228](https://github.com/entrecode/ec.sdk/commit/90ba228))
* refactor: reworked filter options ([57a526c](https://github.com/entrecode/ec.sdk/commit/57a526c))
* refactor: split resources into packages ([d9ab53e](https://github.com/entrecode/ec.sdk/commit/d9ab53e))
* refactor: User-Agent now X-User-Agent ([b25e934](https://github.com/entrecode/ec.sdk/commit/b25e934))
* chore: add webpack test build ([b27694b](https://github.com/entrecode/ec.sdk/commit/b27694b))
* chore: coverage recursive ([1c0839a](https://github.com/entrecode/ec.sdk/commit/1c0839a))
* chore: dependency update ([11c3b65](https://github.com/entrecode/ec.sdk/commit/11c3b65))
* chore: dependency updates ([49dc02e](https://github.com/entrecode/ec.sdk/commit/49dc02e))
* chore: json-schema-remote develop with tv4-format fork ([7530bbd](https://github.com/entrecode/ec.sdk/commit/7530bbd))
* chore: json-schema-remote version bump ([99e6967](https://github.com/entrecode/ec.sdk/commit/99e6967))
* chore: json-schema-remote with fixed tv4-formats ([a36d1ba](https://github.com/entrecode/ec.sdk/commit/a36d1ba))
* chore: renamed dm account testfile ([9c3df88](https://github.com/entrecode/ec.sdk/commit/9c3df88))
* chore: some formatting :) ([9230b65](https://github.com/entrecode/ec.sdk/commit/9230b65))
* doc: asset best file doc ([5bbd870](https://github.com/entrecode/ec.sdk/commit/5bbd870))
* doc: document missing types CMS-2731 ([6293a3b](https://github.com/entrecode/ec.sdk/commit/6293a3b))
* doc: fixed some wrong examples in docs ([e4345de](https://github.com/entrecode/ec.sdk/commit/e4345de))
* doc: more doc for filter options CMS-2727 ([09ee4b1](https://github.com/entrecode/ec.sdk/commit/09ee4b1))
* doc: properties in RoleResource ([1753a1a](https://github.com/entrecode/ec.sdk/commit/1753a1a))
* tests: for superagentPost helper ([dae79f3](https://github.com/entrecode/ec.sdk/commit/dae79f3))
* test: add newRequest() test with continue() ([4afe047](https://github.com/entrecode/ec.sdk/commit/4afe047))
* test: test for rejectWith proper error message ([3f10251](https://github.com/entrecode/ec.sdk/commit/3f10251))


### BREAKING CHANGE

* filter objects do not contain `filter` anymore

before:

```js
{
  filter: {
    property: 'exactFilter'
  }
}
```

after:

```js
{
  property: 'exactFilter'
}
```


<a name="0.2.1"></a>
## 0.2.1 (2017-02-21)

* refactor: renamed list and single functions in DataManager and Accounts ([b502aa4](https://github.com/entrecode/ec.sdk/commit/b502aa4))
* release version 0.2.1 ([d0c4811](https://github.com/entrecode/ec.sdk/commit/d0c4811))
* chore: remove DOCUMENTATION.md from release.sh ([71b327f](https://github.com/entrecode/ec.sdk/commit/71b327f))
* feat: count and total properties in ListResource ([6b4f621](https://github.com/entrecode/ec.sdk/commit/6b4f621))
* doc: updated documentation ([4331747](https://github.com/entrecode/ec.sdk/commit/4331747))
* docs: adds introduction and api connector description to doc ([7c1eb48](https://github.com/entrecode/ec.sdk/commit/7c1eb48))
* docs: remove single file doc. html doc is hosted ([d1f5cf2](https://github.com/entrecode/ec.sdk/commit/d1f5cf2))

### BREAKING CHANGE

* refactor: renamed list and single functions in DataManager and Accounts

before:

```js
dataManager.list(…);
dataManager.get(…);
accounts.list(…);
accounts.get(…);
```

after:

```js
dataManager.dataManageList(…);
dataManager.dataManager(…);
accounts.accountList(…);
accounts.account(…);
```

<a name="0.2.0"></a>
# 0.2.0 (2017-02-17)

* release version 0.2.0 ([75ffbd6](https://github.com/entrecode/ec.sdk/commit/75ffbd6))
* fix: build body on Resource#save with Object.keys().forEach ([1dd1896](https://github.com/entrecode/ec.sdk/commit/1dd1896))
* fix: create resources with environments ([e75614b](https://github.com/entrecode/ec.sdk/commit/e75614b))
* fix: create resources with environments in Accounts ([5f81098](https://github.com/entrecode/ec.sdk/commit/5f81098))
* fix: fixed typings for Core and childs ([bb4de8b](https://github.com/entrecode/ec.sdk/commit/bb4de8b))
* fix: loading of single dm ([51d3b01](https://github.com/entrecode/ec.sdk/commit/51d3b01))
* fix: lowercase accountid for Accounts#get ([c9cc64c](https://github.com/entrecode/ec.sdk/commit/c9cc64c))
* fix: ModelResource typings fixed ([42ee13e](https://github.com/entrecode/ec.sdk/commit/42ee13e))
* fix: no optionsToQuery on Accounts#get ([43bf6f7](https://github.com/entrecode/ec.sdk/commit/43bf6f7))
* fix: release script docs dir wrong ([ed1c983](https://github.com/entrecode/ec.sdk/commit/ed1c983))
* fix: use dataManagerID property in DataManagerResource#modelList() ([53a192c](https://github.com/entrecode/ec.sdk/commit/53a192c))
* fix: use ec:accounts/options relation on Account#get ([444bbb0](https://github.com/entrecode/ec.sdk/commit/444bbb0))
* docs: add doc link to README ([6417cdd](https://github.com/entrecode/ec.sdk/commit/6417cdd))
* docs: config for docs rearranging items ([e810485](https://github.com/entrecode/ec.sdk/commit/e810485))
* docs: examples for Accounts and Core ([538055c](https://github.com/entrecode/ec.sdk/commit/538055c))
* docs: updates docs and adds some examples ([29de937](https://github.com/entrecode/ec.sdk/commit/29de937))
* refactor: refactored changelog ([7474218](https://github.com/entrecode/ec.sdk/commit/7474218))
* chore: adds missing jsdoc ([cd572b5](https://github.com/entrecode/ec.sdk/commit/cd572b5))
* chore: CMS-2659 consistent types ([a9abc9a](https://github.com/entrecode/ec.sdk/commit/a9abc9a))
* chore: exclude docs from code climate ([725c6d1](https://github.com/entrecode/ec.sdk/commit/725c6d1))
* chore: include docs folder to github ([5e20cc5](https://github.com/entrecode/ec.sdk/commit/5e20cc5))
* chore: include docs folder to github ([2f2d42c](https://github.com/entrecode/ec.sdk/commit/2f2d42c))
* chore: missing jsdoc ([bd5b9a7](https://github.com/entrecode/ec.sdk/commit/bd5b9a7))
* chore: sort doc alphabetically ([47fc16d](https://github.com/entrecode/ec.sdk/commit/47fc16d))
* chore: updated dm mocks ([968437e](https://github.com/entrecode/ec.sdk/commit/968437e))
* feat: account created getter ([9d7b577](https://github.com/entrecode/ec.sdk/commit/9d7b577))
* feat: check for clientID in register ([af639c5](https://github.com/entrecode/ec.sdk/commit/af639c5))
* feat: CMS-2551 simple model resource ([ed93b68](https://github.com/entrecode/ec.sdk/commit/ed93b68))
* feat: CMS-2555 group resource ([6d43a25](https://github.com/entrecode/ec.sdk/commit/6d43a25))
* feat: CMS-2557 invites resource ([3bf79b6](https://github.com/entrecode/ec.sdk/commit/3bf79b6))
* feat: CMS-2558 clients resource ([2ac4fbc](https://github.com/entrecode/ec.sdk/commit/2ac4fbc))
* feat: CMS-2579 password reset ([58d6793](https://github.com/entrecode/ec.sdk/commit/58d6793))
* feat: CMS-2580 changeEmail request ([c77f28f](https://github.com/entrecode/ec.sdk/commit/c77f28f))
* feat: CMS-2595 invalid permissions ([2e542c6](https://github.com/entrecode/ec.sdk/commit/2e542c6))
* feat: CMS-2604 token resource ([fb404b0](https://github.com/entrecode/ec.sdk/commit/fb404b0))
* feat: CMS-2630 resource resolve ([b432cb3](https://github.com/entrecode/ec.sdk/commit/b432cb3))
* feat: CMS-2637 CMS-2638 expose EventEmitter on Core, send event ([fe84571](https://github.com/entrecode/ec.sdk/commit/fe84571))
* feat: CMS-2641 remove token and send loggedOut event on 401/402 ec.error ([8bc3f79](https://github.com/entrecode/ec.sdk/commit/8bc3f79))
* feat: CMS-2643 move create dm into DataManager.js ([4d2a997](https://github.com/entrecode/ec.sdk/commit/4d2a997))
* feat: CMS-2646 Object.defineProperties getter and setter ([17606fd](https://github.com/entrecode/ec.sdk/commit/17606fd))
* feat: CMS-2647 moved login logout into Session.js away from Accounts.js ([d757480](https://github.com/entrecode/ec.sdk/commit/d757480))
* feat: CMS-2648 own account relation me ([a294cf3](https://github.com/entrecode/ec.sdk/commit/a294cf3))
* feat: CMS-2650 filter single responses on list requests ([aebbade](https://github.com/entrecode/ec.sdk/commit/aebbade))
* feat: datamanager created getter ([2f4efcf](https://github.com/entrecode/ec.sdk/commit/2f4efcf))
* feat: do not throw error in asyn functions - reject instead CMS-2634 ([317da0a](https://github.com/entrecode/ec.sdk/commit/317da0a))
* feat: getDataManagerID for DataManagerResource ([0472018](https://github.com/entrecode/ec.sdk/commit/0472018))
* feat: modelList and model functions in DataManagerResource ([37c2dd9](https://github.com/entrecode/ec.sdk/commit/37c2dd9))
* feat: reject on login when token is saved CMS-2640 ([685f858](https://github.com/entrecode/ec.sdk/commit/685f858))
* feat: resource throws on non string environment ([36876ae](https://github.com/entrecode/ec.sdk/commit/36876ae))
* feat: typings for Model* Resources ([ddb9f1c](https://github.com/entrecode/ec.sdk/commit/ddb9f1c))
* feat: typings for Token resource and Account#me() ([de5b937](https://github.com/entrecode/ec.sdk/commit/de5b937))
* test: adds assertions for existance of token in signup ([8dc7489](https://github.com/entrecode/ec.sdk/commit/8dc7489))
* test: fixed typos in model test ([ee06973](https://github.com/entrecode/ec.sdk/commit/ee06973))
* test: missing return statements in chai-as-promise tests ([486b5ec](https://github.com/entrecode/ec.sdk/commit/486b5ec))
* test: throws on undefined permission in GroupResource#addPermission ([c3a9960](https://github.com/entrecode/ec.sdk/commit/c3a9960))



<a name="0.1.5"></a>
## 0.1.5 (2017-02-02)

* release version 0.1.5 ([c7d994e](https://github.com/entrecode/ec.sdk/commit/c7d994e))
* fix: embedded resource name for AccountList ([dc44fd2](https://github.com/entrecode/ec.sdk/commit/dc44fd2))
* fix: resolver returns traverson object in tests ([15ba11d](https://github.com/entrecode/ec.sdk/commit/15ba11d))
* fix: send json body as Content-Type: application/json ([d413e84](https://github.com/entrecode/ec.sdk/commit/d413e84))
* fix: typings split into two files ([d90dc8b](https://github.com/entrecode/ec.sdk/commit/d90dc8b))
* fix: use clientID on login ([4659308](https://github.com/entrecode/ec.sdk/commit/4659308))
* feat: basic logout function ([0453e14](https://github.com/entrecode/ec.sdk/commit/0453e14))
* feat: CMS-2574 signup ([0b9a2fb](https://github.com/entrecode/ec.sdk/commit/0b9a2fb))
* feat: email available check CMS-2581 ([6713b10](https://github.com/entrecode/ec.sdk/commit/6713b10))
* feat: export all Resources ([e916644](https://github.com/entrecode/ec.sdk/commit/e916644))
* feat: fixed some missbehaving tests ([da29ed7](https://github.com/entrecode/ec.sdk/commit/da29ed7))
* feat: handle tokens with TokenStore instead of events ([2676d8c](https://github.com/entrecode/ec.sdk/commit/2676d8c))
* feat: login event with token ([32ab71b](https://github.com/entrecode/ec.sdk/commit/32ab71b))
* feat: logout events ([70fc8d7](https://github.com/entrecode/ec.sdk/commit/70fc8d7))
* feat: save cookie on login ([3c9a570](https://github.com/entrecode/ec.sdk/commit/3c9a570))
* feat: set token when cookie is saved ([c6aa320](https://github.com/entrecode/ec.sdk/commit/c6aa320))
* feat: typings for signup ([bbde3ad](https://github.com/entrecode/ec.sdk/commit/bbde3ad))
* chore: moved cookie related tests to own file ([a07578e](https://github.com/entrecode/ec.sdk/commit/a07578e))
* chore: remove event listeners after tests ([1ca60f9](https://github.com/entrecode/ec.sdk/commit/1ca60f9))
* chore: remove unused token in travis ([04e0330](https://github.com/entrecode/ec.sdk/commit/04e0330))
* chore: removed dangling _ from traversal ([0b0ad12](https://github.com/entrecode/ec.sdk/commit/0b0ad12))
* chore: renamed resources dir in typings ([00b4f1e](https://github.com/entrecode/ec.sdk/commit/00b4f1e))
* chore: splitted core and helper into two files ([1751292](https://github.com/entrecode/ec.sdk/commit/1751292))
* chore: typings is source dir ([f5e1052](https://github.com/entrecode/ec.sdk/commit/f5e1052))
* chore: updated browserify dependency ([d7ea240](https://github.com/entrecode/ec.sdk/commit/d7ea240))
* test: additional EventEmitter tests ([19703d9](https://github.com/entrecode/ec.sdk/commit/19703d9))



<a name="0.1.4"></a>
## 0.1.4 (2017-01-24)

* release version 0.1.4 ([7c8f40e](https://github.com/entrecode/ec.sdk/commit/7c8f40e))
* feat: create API tokens in Accounts CMS-2577 ([775e946](https://github.com/entrecode/ec.sdk/commit/775e946))
* feat: login with rest clientID and body post credentials ([7b0a7ac](https://github.com/entrecode/ec.sdk/commit/7b0a7ac))
* fix: comma dangle in method call throws in browser ([39c7403](https://github.com/entrecode/ec.sdk/commit/39c7403))
* fix: updated typings for ListResource ([2e07a3c](https://github.com/entrecode/ec.sdk/commit/2e07a3c))



<a name="0.1.3"></a>
## 0.1.3 (2017-01-24)

* release version 0.1.3 ([ee05477](https://github.com/entrecode/ec.sdk/commit/ee05477))
* fix: fixed missing > in accounts typings ([8420ab4](https://github.com/entrecode/ec.sdk/commit/8420ab4))
* fix: fixed wrong describe ([de22537](https://github.com/entrecode/ec.sdk/commit/de22537))
* feat: adds typings for account resources ([db32ffe](https://github.com/entrecode/ec.sdk/commit/db32ffe))
* feat: clone input on resource create ([b54b173](https://github.com/entrecode/ec.sdk/commit/b54b173))
* feat: implement simple account resource CMS-2575 ([fc0c65b](https://github.com/entrecode/ec.sdk/commit/fc0c65b))
* feat: jsdoc and typings fixes ([ee253f0](https://github.com/entrecode/ec.sdk/commit/ee253f0))
* refactor: moved filter typedef to list resource ([489d195](https://github.com/entrecode/ec.sdk/commit/489d195))
* refactor: removed constructor value name from DataManagerList and ~Resource ([86ff6d4](https://github.com/entrecode/ec.sdk/commit/86ff6d4))
* refactor: removed use strict ([79691b7](https://github.com/entrecode/ec.sdk/commit/79691b7))
* refactor: setToken now function of Core instead of constructor option ([dce46dd](https://github.com/entrecode/ec.sdk/commit/dce46dd))



<a name="0.1.2"></a>
## 0.1.2 (2017-01-23)

* release version 0.1.2 ([9003f46](https://github.com/entrecode/ec.sdk/commit/9003f46))
* chore: adds codeclimate config ([58faccb](https://github.com/entrecode/ec.sdk/commit/58faccb))
* chore: push tags in release ([abff967](https://github.com/entrecode/ec.sdk/commit/abff967))
* docs: adds jsdoc for Core#newRequest ([e570a3d](https://github.com/entrecode/ec.sdk/commit/e570a3d))
* feat: adds first version of typ declarations ([669dd13](https://github.com/entrecode/ec.sdk/commit/669dd13))
* feat: updated type declarations ([a2a8a36](https://github.com/entrecode/ec.sdk/commit/a2a8a36))
* refactor: reduce code duplicates in Core ([f43c6e0](https://github.com/entrecode/ec.sdk/commit/f43c6e0))
* refactor: reduce complexity of optionsToQuery ([e85160c](https://github.com/entrecode/ec.sdk/commit/e85160c))
* refactor: reduced duplicate code in Problem ([756a891](https://github.com/entrecode/ec.sdk/commit/756a891))
* refactor: split typings into separated files ([db5d93b](https://github.com/entrecode/ec.sdk/commit/db5d93b))
* refactor: use traversonWrapper for getUrl ([db9923b](https://github.com/entrecode/ec.sdk/commit/db9923b))
* test: adds test for invalid filter ([7de4d61](https://github.com/entrecode/ec.sdk/commit/7de4d61))



<a name="0.1.1"></a>
## 0.1.1 (2017-01-20)

* release version 0.1.1 ([7c5d4e8](https://github.com/entrecode/ec.sdk/commit/7c5d4e8))
* chore: adds more checks and badges ([6b8fab2](https://github.com/entrecode/ec.sdk/commit/6b8fab2))
* chore: reset changelog ([b855a73](https://github.com/entrecode/ec.sdk/commit/b855a73))
* chore: reworked release script for changelog ([b3b89a0](https://github.com/entrecode/ec.sdk/commit/b3b89a0))
* chore: tag with vX.X.X so travis recognises the version ([657a304](https://github.com/entrecode/ec.sdk/commit/657a304))



<a name="0.1.0"></a>
## 0.1.0 (2017-01-19)

* initial release

