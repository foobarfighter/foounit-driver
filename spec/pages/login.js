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
Login.prototype.clickSubmit = function (){ return this; }
