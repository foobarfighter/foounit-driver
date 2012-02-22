var fs = require('fs')
  , driver = require('./driver')
  , inflection = require('inflection')
  , Element = require('./element').Element;

var Page = exports.Page = function (profile){
  this.constructor.apply(this, arguments);
};

Page.prototype = new Element();

/**
 * Loads a page by name
 */
Page.load = function (name, profile){
  var path = foounit.translatePath(driver.config().pages)
    + '/' + inflection.underscore(name);

  var Klass = require(path)
  return new Klass(profile);
}

Page.assets = {};
Page.assets.jquery = fs.readFileSync(__dirname + '/../assets/jquery-1.7.1.js')
  .toString() + "\n\nwindow.$jqFoo = jQuery.noConflict();\n";

/**
 * Changes the url of the page and injects jquery into the new page
 */
Page.prototype.go = function (){
  var url = driver.config().baseUri + this.getUrl()
    , self = this;

  var browser = this.getBrowser()
    , profile = this.getProfile();

  profile.deferred(function (d){
    browser.get(url, function (){
      d.complete();
    });
  });

  this._inject$();
}

Page.prototype._inject$ = function (){
  var browser = this.getBrowser()
    , profile = this.getProfile();

  profile.deferred(function (d){
    browser.execute(Page.assets.jquery, function (error){
      d.complete();
    });
  });
}

Page.prototype.getUrl = function (){
  throw new Error('getUrl must be implemented');
}

Page.prototype.doSwitch = function (){
  this.go();
  this.waitForSelector(this.getSelector());
  return this;
}

Page.prototype.waitForSwitch = function (){
  var url = driver.config().baseUri + this.getUrl();

  this._waitForJs('window.location.href',
  // TODO: good matching for urls
  function (value){
    // remove a trailing query string if it exists
    value = value.replace(/\?$/, '');
    return value == url;
  });

  this._inject$();
  return this.waitForSelector(this.getSelector());
}

Page.prototype.element = function (name){
  // create the element and shit
}


