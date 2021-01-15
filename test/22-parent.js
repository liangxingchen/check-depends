const assert = require('assert');
const checkDepends = require('../');
const { data, parent, top } = require('./data');

describe('test parent', function () {
  it('query string', function () {
    assert(checkDepends('&.platform', data, parent));
  });
  it('reverse: query string', function () {
    assert(!checkDepends('!&.platform', data, parent));
  });
  it('test object key', function () {
    assert(
      checkDepends(
        {
          '&.platform': 'nodejs'
        },
        data,
        parent
      )
    );
  });
  it('test object key ref', function () {
    assert(
      checkDepends(
        {
          ':&.platform': true
        },
        data,
        parent,
        top
      )
    );
  });
});
