foounit.require(':spec/spec-helper');

var driver = foounit.require(':lib/driver');

describe('keywords', function (){
  var started;

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
      var queue = foounit.getBuildContext().getCurrentExample()
        .getCurrentBlockQueue();

      expect(queue.size()).to(be, 0);

      var bob = as('bob', started);

      expect(queue.size()).to(beGt, 0);
      expect(bob.permalink).to(be, 'b');
    });

    it('opens a browser', function (){
      var bob = as('bob', started);

      waitFor(function (){
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

      waitFor(function (){
        expect(driver.getProfiles().length).to(be, 0);
      });
    });
  });

  //describe('concurrently', function (){
  //  it('creates a separate workqueue for each profile', function (){
  //    
  //  });
  //});
});
