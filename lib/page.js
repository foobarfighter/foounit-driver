var fs = require('fs')
  , driver = require('./driver')
  , Element = require('./element').Element;

var Page = exports.Page = function (profile){
  this.constructor.apply(this, arguments);
};

Page.prototype = new Element();

Page.assets = {};
Page.assets.jquery = fs.readFileSync(__dirname + '/../assets/jquery-1.7.1.js')
  .toString() + "\n\nwindow.$jqFoo = jQuery.noConflict();\n";
  
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

  profile.deferred(function (d){
    browser.execute(Page.assets.jquery, function (){
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

Page.prototype.element = function (name){
  // create the element and shit
}


