var assert = require("should");

describe('Array', function(){
	var test;

	beforeEach(function(){
		test = -1;
	});

  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      test.should.equal([1,2,3].indexOf(5));
      test.should.equal([1,2,3].indexOf(0));
    })
  })
})
