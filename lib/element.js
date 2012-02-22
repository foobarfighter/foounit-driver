var fu = require('foounit')
  , driver = require('./driver')
  , kw = fu.keywords;

var Element = exports.Element = function (profile){
  this._profile = profile;
}

//Element.load = function (name, profile){
//  var path = foounit.translatePath(driver.config().elements)
//    + '/' + inflection.underscore(name);
//
//  var Klass = require(path)
//  return new Klass(profile);
//}

Element.prototype.getProfile = function (){
  return this._profile;
}

Element.prototype.getBrowser = function (){
  return this._profile.getBrowser();
}

Element.prototype._waitForSelector = function (selector){
  if (!selector){ throw new Error('selector cannot be falsy'); }

  this._waitForJs('$jqFoo("' + selector + '").length', function (value){
    return value > 0;
  });

  return this;
}

Element.prototype._waitForJs = function (js, comparator){
  var browser = this.getBrowser()
    , profile = this.getProfile()
    , hTimeout;

  var poll = function (d, func){
    clearTimeout(hTimeout)

    return hTimeout = setTimeout(function (){
      browser.eval(js, function (error, value){
        if (error){
          error.message = 'Error ocurred while evaling javascript: ' + error.message;
          d.fail(error);
        }

        if (comparator(value)){
          d.complete();
        } else {
          poll(d, comparator);
        }
      });
    }, 100);
  }

  var block = profile.deferred(function (d){
    poll(d, comparator);
  });

  block.onTimeout = function (){
    clearTimeout(hTimeout);
  }
}

Element.prototype.getSelector = function (){
  throw new Error('getSelector must be implemented');
}

Element.prototype.waitForSelector = function (selector){
  return this._waitForSelector(selector);
}

Element.prototype.page = function (name){
  var page = Page.load(name, this._profile);
  return page.waitForSwitch();
}
