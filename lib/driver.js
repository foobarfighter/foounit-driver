var _  = require('underscore')
  , Profile = require('./profile').Profile;
//require('./page');

var _profiles = [];

// Extend the foounit keywords with as
foounit.addKeyword('as', function (name, callback){
  if (!name){ throw new Error('as: name is a required argument'); }
  if (!callback){ throw new Error('callback: callback is a required argument'); }

  var queue = foounit.getBuildContext().getCurrentExample()
    .getCurrentBlockQueue();

  var profile = new Profile(name, callback, queue);
  _profiles.push(profile);
  return profile;
});

foounit.addKeyword('closeBrowsers', function (){
  _.each(_profiles, function (profile){
    profile._browser.stop(function (){
      // need to do something here
    });
  });
});

foounit.addKeyword('concurrently', function (){
});
