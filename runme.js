const { PublicAPI, Accounts } = require('./lib/index');

(async () => {
  //const dm = new PublicAPI('beefbeef', 'stage').setToken('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...');
  const accounts = new Accounts('stage').setToken('eyJhbGciOiJSUzUxMi....');
  
  const apiToken = await accounts.createApiToken();
  console.log(apiToken);
  const account = await accounts.account(apiToken.accountID);
  console.log(account);
  const newToken = await account.createToken();
  console.log(newToken);
  const allTokens = await account.tokenList();
  console.log(allTokens);
  // TODO your magic
  
  return 'done';
})()
  .then(console.log)
  .catch(console.error);
