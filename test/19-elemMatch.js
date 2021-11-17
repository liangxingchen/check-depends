const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $elemMatch', function () {
  it('reverse: test $elemMatch string', function () {
    assert(!checkDepends({ license: { $elemMatch: { $eq: 'MIT' } } }, data));
  });
  it('reverse: test $elemMatch string RegExp', function () {
    assert(!checkDepends({ license: { $elemMatch: { $regex: /MIT/ } } }, data));
  });
  it('test $elemMatch string array', function () {
    assert(checkDepends({ tags: { $elemMatch: { $eq: 'web' } } }, data));
  });
  it('reverse: test $elemMatch string array RegExp', function () {
    assert(!checkDepends({ tags: { $elemMatch: { $eq: /web/ } } }, data));
  });
  it('test $elemMatch string array RegExp', function () {
    assert(checkDepends({ tags: { $elemMatch: { $regex: /web/ } } }, data));
  });
  it('reverse: test $elemMatch number', function () {
    assert(!checkDepends({ from: { $elemMatch: { $gt: 2015 } } }, data));
  });
  it('test $elemMatch number array', function () {
    assert(checkDepends({ numbers: { $elemMatch: { $eq: 15 } } }, data));
  });
  it('test $elemMatch number array', function () {
    assert(checkDepends({ numbers: { $elemMatch: { $gt: 15 } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: 'Liang' } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: ':author' } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: /Liang/ } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: { $regex: /Liang/ } } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: { $regex: 'Liang' } } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: { $regex: ':author' } } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { name: { $regex: /liang/, $options: 'i' } } } }, data));
  });
  it('test $elemMatch object array', function () {
    assert(checkDepends({ contributors: { $elemMatch: { 'name.length': 5 } } }, data));
  });
});
