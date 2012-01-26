var _  = require('underscore')
  , Profile = require('./profile').Profile
  , kw = require('foounit').keywords;

/**
 * driver methods
 */
exports.getProfiles = function (){ return Profile.active; }

/**
 * Creates a profile from a fixture file
 */
foounit.addKeyword('as', function (name, callback){
  if (!name){ throw new Error('as: name is a required argument'); }

  callback = callback || function (){};

  var queue = foounit.getBuildContext().getCurrentExample()
    .getCurrentBlockQueue();

  return new Profile(name, callback, queue);
});


/**
 * Closes all active browsers
 */
foounit.addKeyword('killProfiles', function (){

  // Wait for all other async bullshit to finish before we do this.
  kw.run(function (){
    _.each(Profile.active, function (profile){
      profile.kill();
    });
  });

  // Enqueue a task to ensure that all the shits are dead.
  kw.waitFor(function (){
    kw.expect(Profile.active.length).to(kw.be, 0);
  });
});

foounit.addKeyword('concurrently', function (){
});
