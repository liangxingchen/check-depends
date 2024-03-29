const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $size', function () {
  it('reverse: value $size string', function () {
    assert(!checkDepends({ license: { $size: 3 } }, data));
  });
  it('value $size number array', function () {
    assert(checkDepends({ numbers: { $size: 3 } }, data));
  });
  it('value $size number array', function () {
    assert(checkDepends({ tags: { $size: 2 } }, data));
  });
  it('reverse: value $size number array', function () {
    assert(!checkDepends({ tags: { $size: 5 } }, data));
  });
});
