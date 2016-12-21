# DataManager
### `list(filter)`
Get a list of Data Managers. Filter the list with the values provided in `filter`.

Example

```js
datamanager.list({size: 5})
.then((list) => {
  list.getFirst();
});
```

### `get(dataManagerID)`
Get a single Data Manager by ID.

Example

```js
datamanager.get('189cedfd-fdee-4555-bae6-78e000167f28')
.then((dm) => {
  console.log(dm.getTitle());
})
```
