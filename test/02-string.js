const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('query string', function () {
  it('value is string', function () {
    assert(checkDepends('name', data));
  });
  it('reverse: query !string', function () {
    assert(!checkDepends('!name', data));
  });
  it('value is boolean', function () {
    assert(checkDepends('awesome', data));
  });
  it('reverse: query !boolean', function () {
    assert(!checkDepends('!awesome', data));
  });
  it('value is number', function () {
    assert(checkDepends('from', data));
  });
  it('reverse: query !number', function () {
    assert(!checkDepends('!from', data));
  });
  it('reverse: value is 0', function () {
    assert(!checkDepends('bugs', data));
  });
  it('query !number & value is 0', function () {
    assert(checkDepends('!bugs', data));
  });
  it('reverse: value is null', function () {
    assert(!checkDepends('others', data));
  });
  it('query !null', function () {
    assert(checkDepends('!others', data));
  });
  it('reverse: value is undefined', function () {
    assert(!checkDepends('undefined', data));
  });
  it('query !undefined', function () {
    assert(checkDepends('!undefined', data));
  });
  it('query embed string', function () {
    assert(checkDepends('object.attr', data));
  });
});
