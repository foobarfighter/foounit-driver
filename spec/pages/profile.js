var kw = require('foounit').keywords
  Page = foounit.require(':lib/driver').Page;

var Profile = module.exports = function (profile, options){
  this.constructor.apply(this, arguments);
};

Profile.prototype = new Page();

Profile.prototype.getSelector = function (){
  return 'body.foo-profile';
}

Profile.prototype.getUrl = function (){
  return '/profile.html';
}
