> You've found the documentation for [ec.sdk](https://www.npmjs.com/package/ec.sdk). Congrats. 😊
>
> This is the SDK for all [ec.APIs](https://doc.entrecode.de) by entrecode. By entrecode.

In order to use this SDK you should be familiar with ec.APIs and the concepts behind those. Please refer to the official documentation linked above to get a basic understanding. The documentation you are reading now will first introduce the basic concept when using the SDK. Secondly it is the complete API documentation for ec.sdk.

### Basic usage

For every ec.API you will find an API connector. Use one of those to connect to a certain ec.API. Login and logout are special cases and are done in [Session](#Session) API connector.

All API connectors of a certain [environment](#environment) share some information. The most important one is any access token either received with [Session#login](#Session#login) or by calling [Core#setToken](#Core#setToken). This means you can specifiy the token on any API connector and it will be automatically used by all other API connectors. If any API connector will receives a token related Error ([Problem](#Problem)) it will be automatically removed from all API connectors and a [logout event](#eventeventlogout) is fired.

Every action you take in the ec.sdk will be validated before it will send as a request to ec.APIs. This means that the provided json schemas are used.

The following example will show you the basic usage within a typscript project. This is by all means not complete. So feel free to read on.

#### Example
```js
import { Session, Accounts, DataManager } from 'ec.sdk';
import { AccountResource } from 'ec.sdk/typings/resources/AccountResource';
import { DataManagerResource } from 'ec.sdk/typings/resources/DataManagerResource';

class myExample {
  session: Session;
  accounts: Accounts;
  dataManager: DataManager;
  
  me: AccountResource;
  dm: DataManagerResource;
  
  constructor() {
    session = new Session();
    accounts = new Accounts();
    
    session.setClient('rest');
    // this will also receive events from Accounts and DataManager
    session.on('error', console.error);
  }
  
  login(email, password) {
    session.login(email, password)
    .then(console.log);
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
    .then(meSaved => this.me = meSaved);
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
