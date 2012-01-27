var fu = require('foounit')
  , driver = require('./driver')
  , fixture = require('./fixture')
  , jf = require('jellyfish');

var kw = fu.keywords;

var Profile = exports.Profile = function (name, callback, queue){
  var self = this;

  // save off the profile name
  this._name = name;

  // add active profile
  Profile.active.push(this);

  // use our own work queue (needed for concurrent profiles)
  this._queue = queue;

  // load fixture data
  var attrs = fixture.load('profiles/' + name);
  for (var p in attrs){
    this[p] = attrs[p];
  }

  // start browser
  jf.createChrome(function (browser){
    self._browser = browser;
  });

  // wait for the browser to finish loading
  this._queue.enqueue(new fu.PollingBlock(function (){
    kw.expect(self._browser).toNot(beUndefined);
  }, driver.config().maxStartMillis));

  // call the started callback with the profile as the argument
  this._queue.enqueue(new fu.Block(function (){
    callback(self);
  }));
}

/**
 * Place to store active profiles
 */
Profile.active = [];

/**
 * Returns the browser instance associated with this profile
 */
Profile.prototype.getBrowser = function (){ return this._browser; };

/**
 * Returns the profile name
 */
Profile.prototype.getName = function (){ return this._name; };

/**
 * Destroys a browser and removes the profile from the active
 * profile list.
 */
Profile.prototype.kill = function (){
  var self = this
    , active = Profile.active;

  this.getBrowser().stop(function (err){
    if (err){ return; }

    // Find the killed profile and remove it.
    for (var i = 0; i < active.length; ++i){
      if (active[i] == self){
        active.splice(i, 1);
        break;
      }
    }
  });
}


Profile.prototype.switchTo = function (pageName){
  // locate page object

  // assert loaded
  // return page object
}
