var kw = require('foounit').keywords
  Page = foounit.require(':lib/driver').Page;

var Login = module.exports = function (profile, options){
  this.constructor.apply(this, arguments);
};

Login.prototype = new Page();

Login.prototype.getSelector = function (){
  return 'body.foo-login';
}

Login.prototype.getUrl = function (){
  return '/login.html';
}

Login.prototype.typeUsername = function (){ return this; }
Login.prototype.typePassword = function (){ return this; }

Login.prototype.clickSubmit = function (){
  var profile = this.getProfile()
    , browser = this.getBrowser()
    , self = this;

  var _element;

  //this.waitForSelector(this.getSelector() + ' input[type="submit"]');

  profile.deferred(function (d){
    browser.element('css selector', 'input[type="submit"]', function (error, element){
      if (error){ return; }
      _element = element;
      d.complete();
    });
  });

  profile.deferred(function (d){
    browser.moveTo(_element, undefined, undefined, function (error, data){
      if (error){ return; }
      d.complete();
    });
  });

  profile.deferred(function (d){
    browser.click(0, function (error){    // 0 === left mouse button
      if (error){ return; }
      d.complete();
    });
  });
  
  return this;
}
