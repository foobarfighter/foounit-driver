var fu = require('foounit')
  , fs = require('fs');

var kw = fu.keywords;

var Page = exports.Page = function (profile, options){
  this._options = options;
  this._profile = profile;
};

Page.assets = {};
//Page.assets.jquery = fs.readFileSync(__dirname + '/../assets/jquery-1.7.1.js').toString() + 
//  "\n\nwindow.$jqFoo = jQuery.noConflict();\n";
Page.assets.jquery = '$jqFoo = function (){ return []; }';
  


Page.prototype.getProfile = function (){ return this._profile; };
Page.prototype.getOptions = function (){ return this._options; };
Page.prototype.getBrowser = function (){ return this.getProfile().getBrowser(); };

Page.prototype.go = function (){
  var url = this.getOptions().baseUri + this.getOptions().url
    , self = this;

  // TODO: This would be nice
  //this.getProfile().deferred(function (d){
  //  this.getBrowser().get(url, foounit.bind(d, 'complete'));
  //});

  var browser = this.getBrowser();

  this.getProfile().run(fu.bind(this, function (){
    browser.get(this.getOptions().baseUri + this.getOptions().url, function (){
      console.log('adding magic....', Page.assets.jquery);
      browser.eval(Page.assets.jquery, function (){});
    });
  }));
}

Page.prototype.waitForSelector = function (selector){
  var browser = this.getBrowser();
  
  // async as a rule in nodejs is fucking retarded.
  var hRetarded, value;

  var handler = function (err, _value){
    value = _value;
    if (!value){ hRetarded = poll(); }
  }

  var poll = function (){
    return setTimeout(function (){
      browser.eval('1', handler);
    }, 100);
  }

  hRetarded = poll();

  // Polling check for a response from web driver.
  // Needed because it adds a block to the current work queue.
  // This could be simpler (or less weird) if we had a deferred block in foounit.
  var ensuredCleanup = false;

  var block = this.getProfile().waitFor(function (){
    // This is where things start getting REALLY weird
    if (!ensuredCleanup){
      hookCleanup();
      ensuredCleanup = true;
    }
    kw.expect(value).to(kw.beGt, 0);
  });

  // Ensure that if the timeout is reached we still clean up the poll.
  var hookCleanup = function (){
    var onFailure = block.onFailure;
    block.onFailure = function (){
      clearTimeout(hRetarded);
      onFailure.apply(this, arguments);
    }
  }

}

Page.prototype.doSwitch = function (){
  this.go();
  this.waitForSelector(this.getOptions().selector);
  return this;
}

Page.prototype.element = function (name){
}


