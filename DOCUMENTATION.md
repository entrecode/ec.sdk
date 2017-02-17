# Introduction

Awesome Introduction.

# API connectors

What are those?

# Core

Each API connector Class inherits directly from Core class. You can not instantiate Core
directly. Use one of the following API connectors instead.

## setToken

If you have an existing access token you can use it by calling this function. All
subsequent requests will use the provided [Json Web Token](https://jwt.io/) with an
Authorization header.

**Parameters**

-   `token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the existing token

**Examples**

```javascript
return accounts.me(); // will result in error
accounts.setToken('aJwtToken');
return accounts.mes(); // will resolve
```

Returns **[Core](#core)** this for chainability

## on

All API connectors have an underlying [EventEmitter](#eventemitter) for emitting events. You can use
this function for attaching an event listener. See [EventEmitter](#eventemitter) for the events which
will be emitted.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the event type
-   `listener` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the listener

**Examples**

```javascript
session.on('login', myAlertFunc);
session.login(email, password)
.then(token => console.log(token)); // myAlertFunct will be called with token
```

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## removeListener

You can remov a previously attached listener from the underlying [EventEmitter](#eventemitter) with
this function.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the event type
-   `listener` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the listener

**Examples**

```javascript
session.on('login', myAlertFunc);
session.login(email, password)
.then(token => {  // myAlertFunc will be called with token
  console.log(token);
  session.removeListener('login', myAlertFunc);
  // myAlertFunc will no longer be called.
});
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not the listener was removed

# Session

**Extends Core**

This API connector can be used for login or logout into ec.apis. Login state will be avaliable
to all other API connectors of the same [environment](#environment).

**Examples**

```javascript
return session.login(email, password)
.then(() => {
  return accounts.me();
})
.then((account) => {
  return show(account);
});
```

## constructor

Creates a new instance of [Session](#session) API connector.

**Parameters**

-   `environment` **?[environment](#environment)** the environment to connect to.

## setClientID

Set the clientID to use with the Accounts API. Currently only \`rest is supported.

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID.

Returns **[Accounts](#accounts)** this object for chainability

## login

Login with email and password. Currently only supports `rest` clientID with body post of
credentials and tokenMethod `body`.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email address of the user
-   `password` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** password of the user

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Promise resolving to the issued token

## logout

Logout with existing token. Will invalidate the token with the Account API and remove any
cookie stored.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>** Promise resolving undefined on success.

# Accounts

**Extends Core**

API connector for [Accounts API](https://doc.entrecode.de/en/latest/account_server/).

Multiple instances for multiple environments are possible.

## constructor

Creates a new instance of [Accounts](#accounts) module.

**Parameters**

-   `environment` **?[environment](#environment)** the [environment](#environment) to connect to.

## setClientID

Set the clientID to use with the Accounts API. Currently only `rest` is supported.

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID.

Returns **[Accounts](#accounts)** this object for chainability

## list

Load a [AccountList](#accountlist) of [AccountResource](#accountresource) filtered by the values specified
by the options parameter.

**Parameters**

-   `options` **[filterOptions](#filteroptions)?** the filter options.

**Examples**

```javascript
return accounts.list({
  filter: {
    created: {
      from: new Date(new Date.getTime() - 600000).toISOString(),
    },
  },
})
.then((list) => {
  return show(list);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountList](#accountlist)>** resolves to account list with applied filters.

## get

Get a single [AccountResource](#accountresource) identified by accountID.

**Parameters**

-   `accountID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the Account.

**Examples**

```javascript
return accounts.get(this.accountList.getItem(index).accountID)
.then((account) => {
  return show(account.email);
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountResource](#accountresource)>** resolves to the Account which should be loaded.

## me

Get the [AccountResource](#accountresource) which is currently logged in.

**Examples**

```javascript
return accounts.me()
.then((account) => {
  return show(`Your are logged in as ${account.name || account.email}`);
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountResource](#accountresource)>** resolves to the Account which is logged in.

## createApiToken

Creates a new API token with 100 years validity.

**Examples**

```javascript
return accounts.createAPIToken()
.then((token) => {
  return apiTokenCreated(token);
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;{jwt: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), accountID: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), iat: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), exp: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)}>** the created api
  token response.

## emailAvailable

Will check if the given email is available for login.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the email to check.

**Examples**

```javascript
return accounts.emailAvailable(email)
.then((available) => {
   if (available){
     return accounts.signup(email, password);
   } else {
     return showError(new Error(`Email ${email} already registered.`));
   }
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** Whether or not the email is available.

## signup

Signup a new account. Invite may be required.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email for the new account
-   `password` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** password for the new account
-   `invite` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** optional invite. signup can be declined without invite.

**Examples**

```javascript
return accounts.signup(email, password, invite)
.then((token) => {
  accounts.setToken(token);
  return show('Successfully registered account');
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Promise resolving the newly created [AccountResource](#accountresource)

## resetPassword

Start a password reset.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email of the account

**Examples**

```javascript
return accounts.resetPassword(email)
.then(() => show(`Password reset link send to ${email}`))
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Promise resolving on success.

## changeEmail

Change the logged in account to the given new email address.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the new email

**Examples**

```javascript
return accounts.resetPassword(email)
.then(() => show(`Email change startet. Please verify with your new address`))
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Promise resolving on success.

## createInvites

Create new invites. Specify number of invites to create with count.

**Parameters**

-   `count` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** the number of invites to create

**Examples**

```javascript
return accounts.createInvites(5)
.then((invites) => {
  return Promise.all(invites.invites.forEach((invite, index) => sendInvite(invite,
  emails[index]);
})
.then(() => console.log('Invites send.');
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvitesResource](#invitesresource)>** Promise resolving to the invites resource

## invites

Load the [InvitesResource](#invitesresource) with unused invites.

**Examples**

```javascript
return accounts.invites()
.then((invites) => {
  if (invites.invites.length < 5){
    return Promise.resolve(invites.invites);
  }
  return accounts.createInvites(5 - invites.invites.length);
})
.then((invites) => {
  return Promise.all(invites.invites.forEach((invite, index) => sendInvite(invite,
  emails[index]);
})
.then(() => console.log('Invites send.');
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvitesResource](#invitesresource)>** Promise resolving to the invites resource

## clientList

Load the [ClientList](#clientlist).

**Parameters**

-   `options` **[filterOptions](#filteroptions)?** filter options

**Examples**

```javascript
return accounts.clientList()
.then(clients => {
  return clients.getAllItems().filter(client => client.clientID === 'thisOne');
})
.then(clientArray => {
  return show(clientArray[0]);
});

// This would actually be better:
return accounts.clientList({
  filter: {
    clientID: 'thisOne',
  },
})
.then(clients => {
  return show(clients.getFirstItem());
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ClientList](#clientlist)>** Promise resolving to ClientList

## client

Load a single [ClientResource](#clientresource).

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID

**Examples**

```javascript
return accounts.client('thisOne')
.then(client => {
  return show(client);
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ClientResource](#clientresource)>** Promise resolving to ClientResource

## invalidPermissions

Get [InvalidPermissionsResource](#invalidpermissionsresource) to show all invalid permissions.

**Examples**

```javascript
return accounts.invalidPermissions()
.then((invalidPermissions) => {
  show(invalidPermissions.invalidAccountPermissions);
  show(invalidPermissions.invalidGroupPermissions);
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvalidPermissionsResource](#invalidpermissionsresource)>** Promise resolving to invalid permissions

## groupList

Load the [GroupList](#grouplist)

**Parameters**

-   `options` **[filterOptions](#filteroptions)?** filter options

**Examples**

```javascript
return accounts.groupList({
  filter: {
    title: {
      search: 'dev',
    },
  },
})
.then(groups => {
  // all groups with 'dev' in the title
  return Promise.all(groups.getAllItems.forEach(group => show(group)));
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[GroupList](#grouplist)>** Promise resolving goup list

## group

Load a single group

**Parameters**

-   `groupID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the id of the group

**Examples**

```javascript
return accounts.group(groupID)
.then((group) => {
  group.addPermission('can-view-stacktrace');
  return group.save();
});
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[GroupResource](#groupresource)>** Promise resolving to the group

# DataManager

**Extends Core**

API connector for [Accounts API](https://doc.entrecode.de/en/latest/data_manager/).

Multiple instances for multiple environments are possible.

## constructor

Creates a new instance of [DataManager](#datamanager) module.\*

**Parameters**

-   `environment` **?[environment](#environment)** the environment to connect to.

## create

Create a new DataManager.

**Parameters**

-   `datamanager` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object representing the datamanager.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerResource](#datamanagerresource)>** the newly created DataManagerResource

## list

Load a [DataManagerList](#datamanagerlist) of [DataManagerResource](#datamanagerresource) filtered by the values specified
by the options parameter.

**Parameters**

-   `options` **[filterOptions](#filteroptions)?** the filter options.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerList](#datamanagerlist)>** resolves to datamanager list with applied filters.

## get

Get a single [DataManagerResource](#datamanagerresource) identified by dataManagerID.

**Parameters**

-   `dataManagerID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the DataManager.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerResource](#datamanagerresource)>** resolves to the DataManager which should be loaded.

# environment

You can define which API should be used with the environment parameter. Internally this is also
used as key to store tokens into cookies (for browsers).

Valid value is one of `live`, `stage`, `nightly`, or `develop`.

**Examples**

```javascript
// will connect to production https://editor.entrecode.de
const session = new Session('live');
// will connect to cachena https://editor.cachena.entrecode.de
const accounts = new Accounts('stage');
// will connect to buffalo https://editor.buffalo.entrecode.de
const dataManager = new DataManager('nightly');
// will connect to your local instances, well maybe
const accounts = new Accounts('develop');
```

# Event#login

Login event is emitted when a login succeeds with [Session#login](#sessionlogin).

# Event#logout

Logout event is emitted either on a successful logout with [Session#logout](#sessionlogout) or an API
error with token related error codes.

# Event#error

Error events are emitted whenever an API responds with an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) or [Problem](#problem).

# Find a name

Describe it.

# Problem

**Extends Error**

Class representing Errors sent by all entrecode APIs. Complies to [| Problem Details for HTTP APIs](https://tools.ietf.org/html/draft-nottingham-http-problem-07).
Problems also comply to [resources](<https://tools.ietf.org/html/draft-kelly-json-hal-08 HAL>) but this class won't include any special hal implementation (like getEmbedded or
getLinks).

## constructor

Creates a new [Problem](#problem) with the given error object. May contain embedded [Problem](#problem)s.

**Parameters**

-   `error` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the error received from any entrecode API.

## short

Get short string representation of this error.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** short string representation.

## shortAll

Get short string representation for this and all sub errors. Will contain newlines for each
sub error.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** short string representation

## long

More detailed string representation for this error. Will contain newlines.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** detailed string representation.

## longAll

More detailed string representation for this and short strin representation for all sub
errors. Will contain newlines.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** detailed string representation.

## getAsArray

Get all [Problem](#problem)s as an array.

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Problem](#problem)>** array of all problems.

# EventEmitter

Global event emitter. All received errors will be emitted as an error event here.
You can access this emitter with [DataManager#events](DataManager#events) or [Accounts#events](Accounts#events)

# Resources

Resource Description.

# Resource

Generic resource class. Represents [HAL resources](https://tools.ietf.org/html/draft-kelly-json-hal-08).

**Properties**

-   `isDirty` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not this Resource was modified

## constructor

Creates a new [Resource](#resource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## newRequest

Creates a new [traverson request builder](https://github.com/basti1302/traverson/blob/master/api.markdown#request-builder)
 which can be used for a new request to the API.

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traverson request builder instance.

## resolve

Reloads this [Resource](#resource). Can be used when this resource was loaded from any [ListResource](#listresource) from \_embedded.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Resource](#resource)>** this resource

## reset

Reset this [Resource](#resource) to its initial state. [Resource#isDirty](Resource#isDirty) will be false
afterwards.

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## save

Saves this [Resource](#resource).

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Resource](#resource)>** Promise will resolve to the saved Resource. Will
  be the same object but with refreshed data.

## del

Deletes this [Resource](#resource).

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>** Promise will resolve on success and reject otherwise.

## hasLink

Checks if this [Resource](#resource) has at least one [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5)  with the given name.

**Parameters**

-   `link` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the link name.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not a link with the given name was found.

## getLink

Get the first [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5) with
the given name.

**Parameters**

-   `link` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the link name.

Returns **([object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | null)** the link with the given name or null.

## followLink

Loads the given [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5) and
returns a [Resource](#resource) with the loaded result.

**Parameters**

-   `link` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the link name.
-   `ResourceClass` **class** override the default resource class ([Resource](#resource)).

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Resource](#resource) | ResourceClass)>** the resource identified by the link.

## get

Returns an object with selected properties of the [Resource](#resource). Will return all properties
when properties array is empty or undefined.

**Parameters**

-   `properties` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** array of properties to select.

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object containing selected properties.

## set

Will assign all properties in resource to this [Resource](#resource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object with properties to assign.

Returns **[Resource](#resource)** this Resource for chainability

## getProperty

Will return a single selected property identified by property.

**Parameters**

-   `property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the selected property name.

Returns **Any** the property which was selected.

## setProperty

Set a new value to the property identified by property.

**Parameters**

-   `property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the property to change.
-   `value` **any** the value to assign.

Returns **[Resource](#resource)** this Resource for chainability

# ListResource

**Extends Resource**

Generic list resource class. Represents [HAL resources](https://tools.ietf.org/html/draft-kelly-json-hal-08) with added support for lists.

## constructor

Creates a new [ListResource](#listresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `name` **?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the embedded resources.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## getAllItems

Get all list items [embedded](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2) into this [ListResource](#listresource).

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([Resource](#resource) | ResourceClass)>** an array of all list items.

## getItem

Get the n'th [embedded](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2) item from the list

**Parameters**

-   `n` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the item

Returns **([Resource](#resource) | ResourceClass)** the requested item.

## getFirstItem

Get the first [embedded](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-4.1.2) item from the list

Returns **([Resource](#resource) | ResourceClass)** the first item.

## hasFirstLink

Checks if this [Resource](#resource) has at least one [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5)  with the name 'first'.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not a link with the name 'first' was found.

## followFirstLink

Loads the first [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5) and
returns a [ListResource](#listresource) with the loaded result.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Resource](#resource) | ResourceClass)>** the resource identified by the link.

## hasNextLink

Checks if this [Resource](#resource) has at least one [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5)  with the name 'next'.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not a link with the name 'next' was found.

## followNextLink

Loads the next [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5) and
returns a [ListResource](#listresource) with the loaded result.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Resource](#resource) | ResourceClass)>** the resource identified by the link.

## hasPrevLink

Checks if this [Resource](#resource) has at least one [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5)  with the name 'prev'.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not a link with the name 'prev' was found.

## followPrevLink

Loads the prev [link](https://tools.ietf.org/html/draft-kelly-json-hal-08#section-5) and
returns a [ListResource](#listresource) with the loaded result.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Resource](#resource) | ResourceClass)>** the resource identified by the link.

# filterOptions

List filter options with pagination, sorting, and [filter](#filter)

# filter

This object should contain key value pairs with filter options. These object will be applied
when loading a [ListResource](#listresource).

**Examples**

```javascript
{
  title: 'Recipe Book',
  created: {
    to: new Date().toISOString()
  },
  description: {
    search: 'desserts'
  }
}
```

# Accounts Resources

Accounts resources are awesome.

# AccountResource

**Extends Resource**

Account resource class

**Properties**

-   `accountID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of the Account
-   `created` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) on which this account was created
-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The current email. Can be changed with [Accounts#changeEmail](#accountschangeemail)
-   `groups` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Array of groups this account is member of
-   `hasPassword` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not this account has a password
-   `hasPendingEmail` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not this account has a pending email
-   `language` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The language for frontend usage
-   `permissions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of permissions
-   `state` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** State of the account.

## constructor

Creates a new [AccountResource](#accountresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## getAllPermissions

Returns an array of all permissions of this account. The array will contain the account
permissions and all group permissions.

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** All permissions.

## addPermission

Adds a new permission to permissions array.

**Parameters**

-   `value` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the permission to add.

Returns **[AccountResource](#accountresource)** this Resource for chainability

## tokenList

Load the [TokenList](#tokenlist) for this account

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[TokenList](#tokenlist)>** Promise resolving the token list

# AccountList

**Extends ListResource**

Account list resource class.

## constructor

Creates a new [AccountList](#accountlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# TokenResource

**Extends Resource**

TokenResource class

**Properties**

-   `tokenID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of this token
-   `device` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object containing device information
-   `ipAddress` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The IP address
-   `ipAddressLocation` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The location of the IP
-   `isCurrent` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if this is the current token
-   `issued` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) on which this token was issued
-   `validUntil` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) this token is valid until

## constructor

Creates a new [TokenResource](#tokenresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# TokenList

**Extends ListResource**

Token list class

## constructor

Creates a new [TokenList](#tokenlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# ClientResource

**Extends Resource**

ClientResource class

**Properties**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of the client
-   `callbackURL` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** callback URL
-   `config` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The config

## constructor

Creates a new [ClientResource](#clientresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# ClientList

**Extends ListResource**

Client list class

## constructor

Creates a new [ClientList](#clientlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# GroupResource

**Extends Resource**

GroupResource class

**Properties**

-   `groupID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of the group
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The group name
-   `permissions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of permissions

## constructor

Creates a new [GroupResource](#groupresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## addPermission

Adds a new permission to permissions array.

**Parameters**

-   `value` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the permission to add.

Returns **[GroupResource](#groupresource)** this Resource for chainability

# GroupList

**Extends ListResource**

GroupList list class

## constructor

Creates a new [GroupList](#grouplist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# InvitesResource

**Extends Resource**

Invites Resource. Will contain an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) containing all unused invites.

**Properties**

-   `invites` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of unused invites

## constructor

Creates a new [InvitesResource](#invitesresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# InvalidPermissionsResource

**Extends Resource**

InvalidPermissionsResource class

**Properties**

-   `invalidAccountPermission` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Permission>** Array of invalid permissions linked to a
      [AccountResource](#accountresource)
-   `invalidGroupPermission` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Permission>** Array of invalid permissions linked to a
      [GroupResource](#groupresource)

## constructor

Creates a new [InvalidPermissionsResource](#invalidpermissionsresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# DataManager Resources

They are awesome too.

# DataManagerResource

**Extends Resource**

DataManager resource class.

**Properties**

-   `dataManagerID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of the dataManager
-   `config` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The dataManager config
-   `created` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The Date this dataManager was created
-   `description` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The description
-   `hexColor` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The hexColor for frontend usage
-   `locales` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of available locales
-   `shortID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Shortened [DataManager#dataManagerID](DataManager#dataManagerID)
-   `title` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Title of the dataManager

## constructor

Creates a new [DataManagerResource](#datamanagerresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## modelList

Load a [ModelList](#modellist) of [DataManagerResource](#datamanagerresource) filtered by the values specified
by the options parameter.

**Parameters**

-   `options` **[filterOptions](#filteroptions)?** the
      filter options.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ModelList](#modellist)>** resolves to model list with applied filters.

## model

Get a single [ModelResource](#modelresource) identified by modelID.

**Parameters**

-   `modelID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the Model.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ModelResource](#modelresource)>** resolves to the Model which should be loaded.

# DataManagerList

**Extends ListResource**

DataManager list resource class.

## constructor

Creates a new [DataManagerList](#datamanagerlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# ModelResource

**Extends Resource**

Model resource class

**Properties**

-   `modelID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of this Model
-   `created` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The Date on which this Model was created
-   `description` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** optional description
-   `fields` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Array of fields
-   `hasEntries` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not this Model has Entries
-   `hexColor` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The hexColor for frontend usage
-   `hooks` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Array of hooks
-   `locales` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of available locales
-   `modified` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The Date this Model was modified last
-   `policies` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Array of Policies
-   `title` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Model title
-   `titleField` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the field to used as a title for Entries

## constructor

Creates a new [ModelResource](#modelresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# ModelList

**Extends ListResource**

Model list resource class.

## constructor

Creates a new [ModelList](#modellist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[environment](#environment)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.
