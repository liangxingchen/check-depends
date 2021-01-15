const assert = require('assert');
const checkDepends = require('../');
const { data, parent, top } = require('./data');

describe('test parent', function () {
  it('query string', function () {
    assert(checkDepends('&&.address', data, parent, top));
  });
  it('reverse: query string', function () {
    assert(!checkDepends('!&&.address', data, parent, top));
  });
  it('ref', function () {
    assert(checkDepends({ company: ':&&.name' }, data, parent, top));
  });
  it('$gt ref', function () {
    assert(
      checkDepends(
        {
          from: {
            $gt: ':&&.since'
          }
        },
        data,
        parent,
        top
      )
    );
  });
});
