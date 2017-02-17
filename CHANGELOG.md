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

