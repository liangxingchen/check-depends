const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $ne', function () {
  it('value $ne string', function () {
    assert(checkDepends({ license: { $ne: 'GPL' } }, data));
  });
  it('reverse: value $ne string', function () {
    assert(!checkDepends({ license: { $ne: 'MIT' } }, data));
  });
  it('value $ne number', function () {
    assert(checkDepends({ from: { $ne: 2018 } }, data));
  });
  it('reverse: value $ne number', function () {
    assert(!checkDepends({ from: { $ne: 2016 } }, data));
  });
  it('value $ne objectid', function () {
    assert(checkDepends({ objectid: { $ne: new ObjectID('5eec088b6032cb16eb240000') } }, data));
  });
  it('reverse: value $ne objectid', function () {
    assert(!checkDepends({ objectid: { $ne: new ObjectID('5eec088b6032cb16eb2418ba') } }, data));
  });
  it('string $ne objectid', function () {
    assert(checkDepends({ objectid: { $ne: '5eec088b6032cb16eb240000' } }, data));
  });
  it('reverse: string $ne objectid', function () {
    assert(!checkDepends({ objectid: { $ne: '5eec088b6032cb16eb2418ba' } }, data));
  });
  it('objectid $ne string', function () {
    assert(checkDepends({ id: { $ne: new ObjectID('5eec088b6032cb16eb240000') } }, data));
  });
  it('reverse: objectid $ne string', function () {
    assert(!checkDepends({ id: { $ne: new ObjectID('5eec088b6032cb16eb2418ba') } }, data));
  });
});
