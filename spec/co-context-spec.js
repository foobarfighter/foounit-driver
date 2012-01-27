foounit.require(':spec/spec-helper');

var CoContext = foounit.require(':lib/co-context').CoContext;

describe('CoContext', function (){
  var createPassQueue = function (){
    var queue = new foounit.WorkQueue();
    queue.enqueue(new foounit.Block(function(){}));
    queue.enqueue(new foounit.Block(function(){}));
    queue.enqueue(new foounit.Block(function(){}));
    return queue;
  }


  var createFailQueue = function (){
    var queue = new foounit.WorkQueue();
    queue.enqueue(new foounit.Block(function(){}));
    queue.enqueue(new foounit.Block(function(){
      throw new Error('expected');
    }));
    return queue;
  }

  describe('construction', function (){
    it('adds itself to the current work queue', function (){
      var queue = new foounit.WorkQueue();
      expect(queue.size()).to(be, 0);
      var ctx = new CoContext(queue);
      expect(queue.size()).to(be, 1);
      //ctx.complete();
      //expect(queue.size()).to(be, 0);
    });
  });

  describe('pass or fail in subqueues', function (){
    describe('when all of the subqueues passes', function (){
      it('passes the entire concurrently block', function (){
        var mainQueue = new foounit.WorkQueue();
        mock(mainQueue, 'onComplete');

        var context = new CoContext(mainQueue);
        context.addQueue(createPassQueue());
        context.addQueue(createPassQueue());
        
        mainQueue.run();

        waitFor(function (){
          expect(mainQueue.onComplete).to(haveBeenCalled, once);
        });
      });

      it('runs the next task in the main queue', function (){
      });
    });


    describe('when one of the subqueues fails', function (){
      it('fails the entire concurrently block', function (){
        var mainQueue = new foounit.WorkQueue();

        mock(mainQueue, 'onTaskFailure');
        
        var context = new CoContext(mainQueue);
        context.addQueue(createPassQueue());
        context.addQueue(createFailQueue());

        mainQueue.run();

        waitFor(function (){
          expect(mainQueue.onTaskFailure).to(haveBeenCalled, once);
          var failedTask = mainQueue.onTaskFailure.mostRecentArgs[0];
          expect(failedTask.getException().message).to(be, 'expected');
        });
      });

      it('stops all async profile queues', function (){
        var mainQueue = new foounit.WorkQueue();

        mock(mainQueue, 'onTaskComplete');
        mock(mainQueue, 'onTaskFailure');

        var failQueue = createFailQueue();
        var passQueue = createPassQueue();

        var context = new CoContext(mainQueue);
        context.addQueue(failQueue);
        context.addQueue(passQueue);

        mock(failQueue, 'onTaskComplete', failQueue.onTaskComplete);
        mock(failQueue, 'onTaskFailure', failQueue.onTaskFailure);
        mock(passQueue, 'onTaskComplete', passQueue.onTaskComplete);
        mock(passQueue, 'onComplete');

        mainQueue.run();

        waitFor(function (){
          // there is one successful task in the fail queue
          expect(failQueue.onTaskComplete).to(haveBeenCalled, once);
          expect(failQueue.onTaskFailure).to(haveBeenCalled, once);

          // the passQueue should have been stopped short but
          // it will still complete.  enuring that it didn't get
          // to all 3 tasks in the queue.
          expect(passQueue.onComplete).to(haveBeenCalled);
          expect(passQueue.onTaskComplete).toNot(haveBeenCalled, 3);

          // The mainQueue should have failed
          expect(mainQueue.onTaskFailure).to(haveBeenCalled, once);
          expect(mainQueue.onTaskComplete).toNot(haveBeenCalled);
        });
      });
    });
  });

  xdescribe('as', function (){
    it('creates a profile in a separate work queue', function (){
      
    });
  });
});

