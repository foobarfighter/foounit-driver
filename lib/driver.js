var _  = require('underscore')
  , kw = require('foounit').keywords
  , Profile = require('./profile').Profile
  , CoContext = require('./co-context').CoContext;

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
    _.invoke(Profile.active, 'kill');
  });

  // Enqueue a task to ensure that all the shits are dead.
  kw.waitFor(function (){
    kw.expect(Profile.active.length).to(kw.be, 0);
  });
});


/**
 * Creates a queue for each profile.  Each queue is executed simultaneously.
 */
foounit.addKeyword('concurrently', function (){
//  return new CoContext();
});
