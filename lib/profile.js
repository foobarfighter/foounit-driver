var foounit = require('foounit')
  , fixture = require('./fixture')
  , jf = require('jellyfish');

var Profile = exports.Profile = function (name, callback, queue){
  this._queue = queue;
  this._queue.enqueue(new foounit.Block(callback));
  this._browser = jf.createChrome();

  var attrs = fixture.load('profiles/' + name);
  for (var p in attrs){
    this[p] = attrs[p];
  }
}

Profile.prototype.switchTo = function (pageName){
  // locate page object

  // assert loaded
  // return page object
}

Profile.prototype.destroy = function (){
  
}
