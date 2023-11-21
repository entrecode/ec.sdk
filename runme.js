const { PublicAPI } = require('./lib/index');

(async () => {
  const api = new PublicAPI('fb5dbaab', 'stage').setToken('');

  const entries = await api.entryList('site', { remoteID: { not: 'DLY$-1' }, _count: 1000 });
  console.log(entries.count);

  return 'done';
})()
  .then(console.log)
  .catch((e) => {
    console.error(e);
  });
