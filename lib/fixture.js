var fu = require('foounit')
  , fs = require('fs')
  , pth = require('path');

exports.load = function (path){
  var parts = path.split('/')
    , key = parts.pop()
    , path = fu.translatePath(':fixtures/' + parts.join('/') + '.json');

  var json = fs.readFileSync(path);
  return JSON.parse(json)[key]; 
}
