const { PublicAPI } = require('./lib/index');

(async () => {
  const api = new PublicAPI('fb5dbaab', 'stage').setToken(
    'eyJhbGciOiJSUzUxMiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFjY291bnRzZXJ2ZXItcm9vdCJ9.eyJqdGkiOiJpMmpaVW1BRmx6QkV4cS1JWU1WSUQiLCJzdWIiOiI1MzZkZTRiMC00NDQxLTQ1MDQtYWMyZS05MjVkYWVhNTI2MjEiLCJpYXQiOjE3MDA0OTIxNDUsImV4cCI6MTcwMDQ5OTM0NSwic2NvcGUiOiJlY2FwaSIsImNsaWVudF9pZCI6ImxvY2FsaG9zdC13aXRoLWNhY2hlbmEtbG9naW4iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmNhY2hlbmEuZW50cmVjb2RlLmRlL29pZGMiLCJhdWQiOiJ1cm46ZW50cmVjb2RlOmFwaSJ9.G_eRrUC8aRYfGdQBlYSs7UYlSTIpp_44n1LofEtubhwpozd7MUnAMKNUgrdu-4nG34FzDvq-9l4DAxV0ihvpVuMI7FtwSktPcHSUlCsE_tZ1zSSTq8M6ifpMnA7UOzul_MQ-J7fhNn8rSnxIeYba6QjKSwQwAOeyRSNi6-ycrO2lwHWiNbiJE8XwqlABvxpXUXx8fKegjnHPbJ9rM2VL_20WaHh0GXB89wdsi0mhZ3KQ6E06dh9unYNRmLVstQuZI6SQLFclbtyaM7_9hSWSVvAVq4kJRVkcVFBe7oltki_2jLpIMP5dguuC0AgDmSVdZe8BR7o3kxc1YC5PKvVC2A',
  );

  const entries = await api.entryList('site', { remoteID: { not: 'DLY$-1' }, _count: 1000 });
  console.log(entries.count);

  return 'done';
})()
  .then(console.log)
  .catch((e) => {
    console.error(e);
  });
