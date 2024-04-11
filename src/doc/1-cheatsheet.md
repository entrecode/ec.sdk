This is a quick cheatsheet with the most needed snippets to get started with the [PublicAPI](#publicapi).

### Setup

NodeJS / ec-user-token:

```js
const { PublicAPI } = require('ec.sdk');
const api = new PublicAPI('beefbeef', { environment: 'live', noCookie: true }, true); // for ec user
api.setToken(config.accessToken);
```

Frontend / public:

```js
import { PublicAPI } from 'ec.sdk';
const api = new PublicAPI('beefbeef', { environment: 'live' });
```

### entryList

```js
const list = await api.entryList('modelTitle', {
  size: 10,
  page: 1,
  sort: ['-_created'],
  _levels: 1, // only for single entry requests
  _fields: ['id', 'title'],
  myproperty: 'exactValue',
  email: { search: 'andre' },
  prop: { any: ['id1', 'id2'] },
});
```

Always recommended: `size` and `_fields`.

Properties:

```js
list.count; // results in this response
list.total; // total
list.getFirstItem(); // not really needed anymore:
```

Get single entry:

```js
const entry = await api.entry('modelTitle', { uniqueField: 'uniqueValue' });
```

Async Iterator Functions:

_Keep in mind that you should sort the entryList after something that does not change, like `created`_

```js
await list.map();
await list.filter();
await list.find();
```

### liteEntry

```js
liteEntry._entryTitle;
await liteEntry.resolve();
```

### entry

Properties:

```js
entry.isDirty; // boolean
```

Saving/Deleting:

```js
await entry.del();
await entry.save(true); // save PUT
```
