const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $gte', function () {
  it('value $gte string', function () {
    assert(checkDepends({ license: { $gte: '' } }, data));
    assert(checkDepends({ license: { $gte: 'MIT' } }, data));
  });
  it('reverse: value $gte string', function () {
    assert(!checkDepends({ license: { $gte: 'ZZZ' } }, data));
  });
  it('value $gte number', function () {
    assert(checkDepends({ from: { $gte: 2015 } }, data));
    assert(checkDepends({ from: { $gte: 2016 } }, data));
  });
  it('reverse: value $gte number', function () {
    assert(!checkDepends({ from: { $gte: 2017 } }, data));
  });
  it('null $gte null', function () {
    assert(checkDepends({ null: { $gte: null } }, data));
  });
  it('undefined $gte null', function () {
    assert(checkDepends({ undefined: { $gte: null } }, data));
  });
  it('not exist $gte null', function () {
    assert(checkDepends({ noExist: { $gte: null } }, data));
  });
  it('reverse: 0 $gte null', function () {
    assert(!checkDepends({ bugs: { $gte: null } }, data));
  });
  it('reverse: false $gte null', function () {
    assert(!checkDepends({ no: { $gte: null } }, data));
  });
  it('reverse: number $gte false', function () {
    assert(!checkDepends({ from: { $gte: false } }, data));
    assert(!checkDepends({ bugs: { $gte: false } }, data));
  });
  it('reverse: number $gte true', function () {
    assert(!checkDepends({ from: { $gte: true } }, data));
    assert(!checkDepends({ one: { $gte: true } }, data));
  });
  it('reverse: 0 $gte empty string', function () {
    assert(!checkDepends({ bugs: { $gte: '' } }, data));
  });
  it('reverse: number $gte string number', function () {
    assert(!checkDepends({ from: { $gte: '2016' } }, data));
    assert(!checkDepends({ from: { $gte: '2015' } }, data));
  });
  it('reverse: 0 $gte false', function () {
    assert(!checkDepends({ bugs: { $gte: false } }, data));
  });
  it('reverse: false $gte empty string', function () {
    assert(!checkDepends({ no: { $gte: '' } }, data));
  });
  it('reverse: 0 $gte empty string', function () {
    assert(!checkDepends({ bugs: { $gte: '' } }, data));
  });
  it('value $gte objectid', function () {
    assert(checkDepends({ objectid: { $gte: new ObjectID('5eec088b6032cb16eb2418ba') } }, data));
  });
});
