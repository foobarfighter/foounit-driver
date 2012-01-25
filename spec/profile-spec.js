foounit.require(':spec/spec-helper');
foounit.require(':lib/driver');

describe('Profile', function (){
  describe('as', function (){
    after(function (){
      closeBrowsers();
    });

    it('loads a profile fixture and adds a block to the work queue', function (){
      var queue = foounit.getBuildContext().getCurrentExample()
        .getCurrentBlockQueue();

      expect(queue.size()).to(be, 0);

      var bob = as('bob', function (){});

      expect(queue.size()).to(be, 1);
      expect(bob.permalink).to(be, 'b');
    });

    it('opens a browser', function (){
    });
  });
});
