const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('query boolean', function () {
  it('query true', function () {
    assert(checkDepends(true, data));
  });
  it('reverse: query false', function () {
    assert(!checkDepends(false, data));
  });
});
