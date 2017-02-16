# Accounts

**Extends Core**

Module for working with Accounts API.

## constructor

Creates a new instance of [Accounts](#accounts) module. Can be used to work with Accounts
API.

**Parameters**

-   `environment` **?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment to connect to. 'live', 'stage', 'nightly', or
      'develop'.

## setClientID

Set the clientID to use with the Accounts API. Currently only 'rest' is supported.

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID.

Returns **[Accounts](#accounts)** this object for chainability

## list

Load a [AccountList](#accountlist) of [AccountResource](#accountresource) filtered by the values specified
by the options parameter.

**Parameters**

-   `options` **{size: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), page: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), sort: [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>, filter: [filter](#filter)}** the
      filter options.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountList](#accountlist)>** resolves to account list with applied filters.

## get

Get a single [AccountResource](#accountresource) identified by accountID.

**Parameters**

-   `accountID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the Account.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountResource](#accountresource)>** resolves to the Account which should be loaded.

## me

Get the [AccountResource](#accountresource) which is currently logged in.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[AccountResource](#accountresource)>** resolves to the Account which is logged in.

## createApiToken

Creates a new API token with 100 years validity.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;tokenResponse>** the created api
  token response.

## emailAvailable

Will check if the given email is available for login.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the email to check.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** Whether or not the email is available.

## signup

Signup a new account.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email for the new account
-   `password` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** password for the new account
-   `invite` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** optional invite. signup can be declined without invite.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Promise resolving the newly created [AccountResource](#accountresource)

## resetPassword

Start a password reset.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email of the account

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Promise resolving on success.

## changeEmail

Change the logged in account to the given new email address.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the new email

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Promise resolving on success.

## createInvites

Create new invites. Specify number of invites to create with count.

**Parameters**

-   `count` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** the number of invites to create

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvitesResource](#invitesresource)>** Promise resolving to the invites resource

## invites

Load the [InvitesResource](#invitesresource).

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvitesResource](#invitesresource)>** Promise resolving to the invites resource

## clientList

Load the [ClientList](#clientlist).

**Parameters**

-   `options` **filterOptions** filter options

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ClientList](#clientlist)>** Promise resolving to ClientList

## client

Load a single [ClientResource](#clientresource).

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ClientResource](#clientresource)>** Promise resolving to ClientResource

## invalidPermissions

Get [InvalidPermissionsResource](#invalidpermissionsresource) to show all invalid permissions.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[InvalidPermissionsResource](#invalidpermissionsresource)>** Promise resolving to invalid permissions

## groupList

Load the [GroupList](#grouplist)

**Parameters**

-   `options` **filterOptions?** filter options

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[GroupList](#grouplist)>** Promise resolving goup list

## group

Load a single group

**Parameters**

-   `groupID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the id of the group

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[GroupResource](#groupresource)>** Promise resolving to the group

# Core

Core class for connecting to any entrecode API.

## setToken

Set an existing accessToken

**Parameters**

-   `token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the existing token

Returns **[Core](#core)** this for chainability

## on

Attaches a listener on the underlying EventEmitter.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the event type
-   `listener` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the listener

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## removeListener

Removes a previously attached listener from the underlying EventEmitter.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the event type
-   `listener` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the listener

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not the listener was removed

# DataManager

**Extends Core**

Module for working with DataManager API.

## constructor

Creates a new instance of [DataManager](#datamanager) module. Can be used to work with DataManager
API.

**Parameters**

-   `environment` **?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment to connect to. 'live', 'stage', 'nightly', or
      'develop'.

## create

Create a new DataManager.

**Parameters**

-   `datamanager` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object representing the datamanager.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerResource](#datamanagerresource)>** the newly created DataManagerResource

## list

Load a [DataManagerList](#datamanagerlist) of [DataManagerResource](#datamanagerresource) filtered by the values specified
by the options parameter.

**Parameters**

-   `options` **{size: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), page: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), sort: [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>, filter: [filter](#filter)}** the
      filter options.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerList](#datamanagerlist)>** resolves to datamanager list with applied filters.

## get

Get a single [DataManagerResource](#datamanagerresource) identified by dataManagerID.

**Parameters**

-   `dataManagerID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the DataManager.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[DataManagerResource](#datamanagerresource)>** resolves to the DataManager which should be loaded.

# EventEmitter

Global event emitter. All received errors will be emitted as an error event here.
You can access this emitter with [DataManager#events](DataManager#events) or [Accounts#events](Accounts#events)

## constructor

default constructor initialising a empty [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) for event listeners.

## addListener

Adds a listener for an event type.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** event type
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function to invoke when event occurs.

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## on

Adds a listener for an event type.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** event type
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function to invoke when event occurs.

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## removeListener

Removes a listener.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** event type
-   `callback` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** listener function to remove.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not the listener got removed.

## removeAllListeners

Removes all listeners for a given label.

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** event type.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not all listeners got removed.

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

# AccountList

**Extends ListResource**

Account list resource class.

## constructor

Creates a new [AccountList](#accountlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# openID

Object describing openID connections.

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
-   `openID` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[openID](#openid)>** Array of connected openID accounts
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

# ClientList

**Extends ListResource**

Client list class

## constructor

Creates a new [ClientList](#clientlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
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

# DataManagerList

**Extends ListResource**

DataManager list resource class.

## constructor

Creates a new [DataManagerList](#datamanagerlist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

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

-   `options` **{size: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), page: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), sort: [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>, filter: [filter](#filter)}** ? the
      filter options.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ModelList](#modellist)>** resolves to model list with applied filters.

## model

Get a single [ModelResource](#modelresource) identified by modelID.

**Parameters**

-   `modelID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id of the Model.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ModelResource](#modelresource)>** resolves to the Model which should be loaded.

# GroupList

**Extends ListResource**

GroupList list class

## constructor

Creates a new [GroupList](#grouplist).

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
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

## addPermission

Adds a new permission to permissions array.

**Parameters**

-   `value` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the permission to add.

Returns **[GroupResource](#groupresource)** this Resource for chainability

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
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
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
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# ListResource

**Extends Resource**

Generic list resource class. Represents [HAL resources](https://tools.ietf.org/html/draft-kelly-json-hal-08) with added support for lists.

## constructor

Creates a new [ListResource](#listresource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
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

# ListClass

Defines the class this [ListResource](#listresource) has. Is used to support more specified classes
like [DataManagerList](#datamanagerlist).

# ItemClass

Defines the class the items of this [ListResource](#listresource) have.

# ModelList

**Extends ListResource**

Model list resource class.

## constructor

Creates a new [ModelList](#modellist).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# 

Fields object

# ModelResource

**Extends Resource**

Model resource class

**Properties**

-   `modelID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of this Model
-   `created` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** The Date on which this Model was created
-   `description` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** optional description
-   `fields` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Field>** Array of fields
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
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# Resource

Generic resource class. Represents [HAL resources](https://tools.ietf.org/html/draft-kelly-json-hal-08).

**Properties**

-   `isDirty` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not this Resource was modified

## constructor

Creates a new [Resource](#resource).

**Parameters**

-   `resource` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** resource loaded from the API.
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
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

# TokenList

**Extends ListResource**

Token list class

## constructor

Creates a new [TokenList](#tokenlist).

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
-   `environment` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment this resource is associated to.
-   `traversal` **?[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** traversal from which traverson can continue.

# Session

**Extends Core**

Module for logging in and logging out.

## constructor

Creates a new instance of [Session](#session) module. Can be used to log in and log out.

**Parameters**

-   `environment` **?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the environment to connect to. 'live', 'stage', 'nightly', or
      'develop'.

## setClientID

Set the clientID to use with the Accounts API. Currently only 'rest' is supported.

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID.

Returns **[Accounts](#accounts)** this object for chainability

## login

Login with email and password. Currently only supports rest clientID with body post of
credentials.

**Parameters**

-   `email` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** email address of the user
-   `password` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** password of the user

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Promise resolving to the issued token

## tokenResponse

Response when creating a API token in account server.

**Parameters**

-   `email`  
-   `password`  

## logout

Logout with existing token. Will invalidate the token with the Account API and remove any
cookie stored.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>** Promise resolving undefined on success.

# TokenStore

Factory function for creating a [TokenStore](#tokenstore) for an environment. Will return a
previously created [TokenStore](#tokenstore).

**Parameters**

-   `environment` **environment** the environment for which the token store should be created

Returns **[TokenStore](#tokenstore)** The created token store

## constructor

Creates a new [TokenStore](#tokenstore) for the specified environment.

**Parameters**

-   `environment` **environment** The environment for which to store tokens.

## set

Set a new token.

**Parameters**

-   `token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** new token.

## get

Get a previously saved token. Undefined on missing token.

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))** The token or undefined.

## has

Check if a token is saved.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not a token is saved.

## del

Delete the saved token.

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## setClientID

Set clientID for this [TokenStore](#tokenstore).

**Parameters**

-   `clientID` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 

## getClientID

Get the clientID for this [TokenStore](#tokenstore).

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the clientID

## hasClientID

Whether or not this [TokenStore](#tokenstore) has a clientID set.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether or not a clientID is set.
