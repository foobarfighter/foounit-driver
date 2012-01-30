var fu = require('foounit')
  , fs = require('fs');

var kw = fu.keywords;

var Page = exports.Page = function (profile, options){
  this._options = options;
  this._profile = profile;
};

Page.assets = {};
Page.assets.jquery = fs.readFileSync(__dirname + '/../assets/jquery-1.7.1.js').toString() + 
  "\n\nwindow.$jqFoo = jQuery.noConflict();\n";
  


Page.prototype.getProfile = function (){ return this._profile; };
Page.prototype.getOptions = function (){ return this._options; };
Page.prototype.getBrowser = function (){ return this.getProfile().getBrowser(); };

Page.prototype.go = function (){
  var url = this.getOptions().baseUri + this.getOptions().url
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

Page.prototype.waitForSelector = function (selector){
  var browser = this.getBrowser()
    , profile = this.getProfile()
    , hTimeout;

  var poll = function (d, func){
    clearTimeout(hTimeout)

    return hTimeout = setTimeout(function (){
      browser.eval('$jqFoo("' + selector + '").length', function (error, value){
        if (error){
          error.message = 'Error ocurred while evaling javascript: ' + error.message;
          d.fail(error);
        }

        if (func(value)){
          d.complete();
        } else {
          poll(d, func);
        }
      });
    }, 100);
  }

  var block = profile.deferred(function (d){
    poll(d, function (value){
      return value > 0;
    });
  });

  block.onTimeout = function (){
    clearTimeout(hTimeout);
  }
}

Page.prototype.doSwitch = function (){
  this.go();
  this.waitForSelector(this.getOptions().selector);
  return this;
}

Page.prototype.element = function (name){
}


