'use strict';

ec.datamanager.list({ filters: 'go', here: '!' })
.then((dmList) => {
  dmList.get(n); // sync get n'th element
  return api.datamanager.create({ title: 'new dm' })
})
.then((dm) =>
  Promise.all([
    dm.createModel({ title: 'model1' }),
    dm.createModel({ title: 'model2' }),
  ]))
.then(([model1, model2]) => [
  () => model1.addPolicy({})
  .then(model => model.delete()),
  () => model2.addSync({})
  .then(model => model.save()),
  model2.getDm(),
].reduce((p, n) => p.then(n), Promise.resolve()))
.then((dm) => {
  dm.set({ title: 'New Title' });
  return dm.save();
});

ec.datamanager.get(id)
.then((dm) => {
  dm.models.map(model => model.addField({}));
})
.then(models => models[0].getHistory())
.then(history => display(history));

/*
 * ec.apps(…).list() => {count, total, array}
 * ec.app(…).then(…), ec.dm.model(…).then()
 * ec.app(…).platform(…), ec.dm.model(…).map(…)
 * class App extends Promise{}
 */


//
// Generic HAL Resources (aka. wie eine neue HAL lib aussehen könnte
//
api
.then((root) => root.follow('link'))          // follow 'link'
.then((linkResource) => {                     // when then is called 'link' is getted and resolve
  linkResource.getEmbedded();                 // getEmbedded will return single? / array of embedded
  return linkResource
  .follow('anotherLink')
  .follow('yetAnother')
  .withHeader({ Authorization: 'Bearer secret' })
  .withTemplate({ some: 'value', another: 5 });
})
.then((yetAnotherResource) => {
  // alternative: yetAnotherResource.follow('up', 'up')
  return yetAnotherResource.follow(['up', 'up'])
  .post({ a: 'body' });
})
.then((linkResource) => {

});


// importable?

'use strict';

(() => {
  const root = this;
  const previousEc = root.ec;

  const ec = {};
  ec.noConflict = () => {
    root.ec = previousEc;
    return ec;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = ec;
    }
    exports.ec = ec;
  }
  else {
    root.ec = ec;
  }
}).call(this);
