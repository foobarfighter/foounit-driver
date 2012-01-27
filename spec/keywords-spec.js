foounit.require(':spec/spec-helper');

var driver = foounit.require(':lib/driver');

describe('keywords', function (){
  var started;

  var getCurrentBlockQueue = function (){
    return foounit.getBuildContext().getCurrentExample()
      .getCurrentBlockQueue();
  }

  before(function (){
    started = mock(function (){});
  });

  after(function (){
    killProfiles();
  });

  describe('as', function (){
    after(function (){
      expect(started).to(haveBeenCalled, once);
    });

    it('loads a profile fixture and adds a block to the work queue', function (){
      var queue = getCurrentBlockQueue();
      expect(queue.size()).to(be, 0);

      var bob = as('bob', started);
      expect(queue.size()).to(beGt, 0);
      expect(bob.permalink).to(be, 'b');
    });

    it('opens a browser', function (){
      var bob = as('bob', started);

      run(function (){
        expect(bob.getBrowser()).toNot(beUndefined);
      });
    });
  });

  describe('killProfiles', function (){
    after(function (){
      expect(started).to(haveBeenCalled, twice);
    });

    it('returns when all browsers are closed', function (){
      as('bob', started);
      as('bob', started);

      expect(driver.getProfiles().length).to(be, 2);

      killProfiles();

      run(function (){
        expect(driver.getProfiles().length).to(be, 0);
      });
    });
  });

  describe('concurrently', function (){
    it('creates a separate profile and queue', function (){
      var bob, bill, jane;

      // 1 item added to the queue
      concurrently()
        .as('bob', function (_bob){ bob = _bob; })
        .as('bill', function (_bill){ bill = _bill; });

      run(function (){
        var profiles = driver.getProfiles();
        expect(profiles).to(include, bob);
        expect(profiles).to(include, bill);
        expect(profiles).toNot(include, jane);
      });

      // counts as 2 items added to the main work queue
      as('jane', function (_jane){ jane = _jane; });

      run(function (){
        var profiles = driver.getProfiles();
        expect(profiles).to(include, jane);
      });

      // this is NOT part of the async excecution flow
      expect(getCurrentBlockQueue().size()).to(be, 5);
      expect(driver.getProfiles().length).to(be, 3);
    });
  });
});
