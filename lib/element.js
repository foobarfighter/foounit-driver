var fu = require('foounit')
  , kw = fu.keywords;

var Element = exports.Element = function (profile){
  this._profile = profile;
}

Element.prototype.getProfile = function (){
  return this._profile;
}

Element.prototype.getBrowser = function (){
  return this._profile.getBrowser();
}

Element.prototype._waitForSelector = function (selector){
  console.log('selector: ', selector);
  if (!selector){ throw new Error('selector cannot be falsy'); }

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

Element.prototype.getSelector = function (){
  throw new Error('getSelector must be implemented');
}

Element.prototype.waitForSelector = function (selector){
  return this._waitForSelector(selector);
}

