var _ = require('underscore')
  , fu = require('foounit')
  , Profile = require('./profile').Profile;

/**
 * This is a block that is completed manually
 */
var CallbackBlock = function (){};
CallbackBlock.prototype = new fu.Block();
CallbackBlock.prototype.run = function (){
};
CallbackBlock.prototype.complete = function (){
  this.onComplete(this);
}
CallbackBlock.prototype.fail = function (exception){
  // TODO: What happens if both queues fail
  //if (this._failed){ return; }
  this._exception = exception;
  this.onFailure(this);
}

/**
 * A queue that has a reference to a profile
 */
var ProfileQueue = function (){};
ProfileQueue.prototype = new fu.WorkQueue();
ProfileQueue.prototype.setProfile = function (profile){
  this._profile = profile;
}
ProfileQueue.prototype.getProfile = function (){
  return this._profile;
}


/**
 * Context for concurrent profile queues
 */
var CoContext = exports.CoContext = function (queue){
  this._queue = queue;
  this._profileQueues = [];
  this._completions = 0;

  this._main = new CallbackBlock();
  this._queue.enqueue(this._main);
};

CoContext.prototype.as = function (name, callback){
  var queue = new ProfileQueue()
    , profile = new Profile(name, callback, queue);

  queue.setProfile(profile);
  this.addQueue(queue);
  return this;
};

CoContext.prototype.getProfiles = function (){
  return _(this._profileQueues).map(function (queue){
    return queue.getProfile();
  });
};

CoContext.prototype.addQueue = function (queue){
  var self = this;
  queue.onTaskFailure = fu.bind(this, function (task){
    //this.failProfileTask(task, profile);
    self.failProfileTask(task);
  });

  queue.onComplete = fu.bind(this, function (){
    //this.completeProfileTask(profile);
    this.completeProfileTask();
  });

  this._profileQueues.push(queue);
  queue.run();
}

CoContext.prototype.failProfileTask = function (task, profile){
  _.invoke(this._profileQueues, 'stop');
  this._main.fail(task.getException());
}

CoContext.prototype.completeProfileTask = function (profile){
  if (++this._completions == this._profileQueues.length){
    this._main.complete();
  }
}

//CoContext.prototype.complete = function (){
//  _.invoke(this._profileQueues, 'stop');
//  this._main.complete();
//  this._queue.stop();
//};
