var fu = require('foounit')
  , fs = require('fs')
  , pth = require('path');

var driver = require('./driver');

exports.load = function (path){
  var parts = path.split('/')
    , key = parts.length > 1 ? parts.pop() : null
    , path = fu.translatePath(driver.config().fixtures + '/' + parts.join('/') + '.json');

  var json = fs.readFileSync(path).toString();
  return key ? JSON.parse(json)[key] : JSON.parse(json);
}
