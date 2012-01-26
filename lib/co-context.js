var _ = require('underscore')
  , fu = require('foounit')
  , Profile = require('./profile');

var CoContext = exports.CoContext = function (queue){
  this._queue = queue;
  this._profileQueues = [];
  this._completions = 0;

  this._main = new CallbackBlock();
  this._queue.enqueue(this._main);
};

CoContext.prototype.as = function (name, callback){
  var queue = new fu.WorkQueue()
    , profile = new Profile(name, callback, queue);

  queue.onTaskFailure = fu.bind(this, function (task){
    this.failProfileTask(task, profile);
  });

  queue.onComplete = fu.bind(this, function (){
    this.completeProfileTask(profile);
  });
  
  this._profileQueues.push(profile);
};

CoContext.prototype.failProfileTask = function (task, profile){
  _.invoke(this._profileQueues, 'stop');
  this._main.fail(task.getException());
  //this._main.fail('So fucked right now.');
}

CoContext.prototype.completeProfile = function (profile){
  if (++this._completions == this._profileQueues.length){
    this.complete();
  }
}

CoContext.prototype.complete = function (){
  this._main.complete();
};
