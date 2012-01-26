foounit.require(':spec/spec-helper');

var CoContext = foounit.require(':lib/co-context').CoContext;

describe('CoContext', function (){
  describe('construction', function (){
    it('adds itself to the current work queue', function (){

      var queue = foounit.getBuildContext().getCurrentExample()
        .getCurrentBlockQueue();
      var queue = new foounit.WorkQueue();

      expect(queue.size()).to(be, 0);

      var ctx = new CoContext(queue);

      expect(queue.size()).to(be, 1);
      //ctx.complete();
      //expect(queue.size()).to(be, 0);
    });
  });

  describe('as', function (){
    xit('creates a profile in a separate work queue', function (){
    });
  });
});

