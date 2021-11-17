const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $and', function () {
  it('test plain object', function () {
    assert(checkDepends({ $and: [{ name: 'CheckDepends' }, { from: 2016 }] }, data));
  });
  it('reverse: test plain object', function () {
    assert(!checkDepends({ $and: [{ name: 'CheckDepends' }, { from: 2017 }] }, data));
  });
  it('test $gt $and $lt', function () {
    assert(checkDepends({ $and: [{ from: { $gt: 2012 } }, { from: { $lt: 2017 } }] }, data));
  });
  it('reverse: test $gt $and $lt', function () {
    assert(!checkDepends({ $and: [{ from: { $gt: 2012 } }, { from: { $lt: 2016 } }] }, data));
  });
  it('test string array', function () {
    assert(checkDepends({ $and: [{ tags: 'web' }, { tags: 'app' }] }, data));
  });
});
