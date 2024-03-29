var _  = require('underscore')
  , kw = require('foounit').keywords
  , Profile = require('./profile').Profile
  , Page = require('./page').Page
  , CoContext = require('./co-context').CoContext;

exports.Page = Page;
exports.Profile = Profile;

/**
 * driver config object
 */
var _config = {};

/**
 * driver methods
 */
exports.getProfiles = function (){ return Profile.active; }

/**
 * global driver configuration
 */
exports.configure = function (settings){
  _config = settings;
};
exports.config = function (){
  return _config;
}

/**
 * Gets the current work queue from foounit
 */
var getCurrentBlockQueue = function (){
  return foounit.getBuildContext().getCurrentExample()
    .getCurrentBlockQueue();
};

/**
 * Creates a profile from a fixture file
 */
foounit.addKeyword('as', function (name, callback){
  if (!name){ throw new Error('as: name is a required argument'); }

  callback = callback || function (){};

  var queue = getCurrentBlockQueue();
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
foounit.addKeyword('concurrently', function (callback){
  var context = new CoContext(getCurrentBlockQueue());
  if (callback){ callback(context); }
  return context;
});
