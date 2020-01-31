const { PublicAPI } = require('./lib/index');

(async () => {
  const dm = new PublicAPI('beefbeef', 'stage').setToken('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...');

  // TODO your magic
  
  return 'done';
})()
  .then(console.log)
  .catch(console.error);
