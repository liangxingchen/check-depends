const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $lt', function () {
  it('value $lt string', function () {
    assert(checkDepends({ license: { $lt: 'ZZZ' } }, data));
  });
  it('reverse: value $lt empty string', function () {
    assert(!checkDepends({ license: { $lt: '' } }, data));
  });
  it('value $lt number', function () {
    assert(checkDepends({ from: { $lt: 2017 } }, data));
  });
  it('reverse: value $lt number', function () {
    assert(!checkDepends({ from: { $lt: 2015 } }, data));
  });
  it('reverse: null $lt null', function () {
    assert(!checkDepends({ null: { $lt: null } }, data));
  });
  it('reverse: 0 $lt null', function () {
    assert(!checkDepends({ bugs: { $lt: null } }, data));
  });
  it('reverse: false $lt null', function () {
    assert(!checkDepends({ no: { $lt: null } }, data));
  });
  it('reverse: undefined $lt null', function () {
    assert(!checkDepends({ undefined: { $lt: null } }, data));
  });
  it('reverse: not exist $lt null', function () {
    assert(!checkDepends({ noExist: { $lt: null } }, data));
  });
  it('reverse: number $lt false', function () {
    assert(!checkDepends({ from: { $lt: false } }, data));
  });
  it('reverse: 0 $lt false', function () {
    assert(!checkDepends({ bugs: { $lt: false } }, data));
  });
  it('false $lt true', function () {
    assert(checkDepends({ no: { $lt: true } }, data));
  });
  it('reverse: 0 $lt true', function () {
    assert(!checkDepends({ bugs: { $lt: true } }, data));
  });
  it('reverse: number $lt string number', function () {
    assert(!checkDepends({ from: { $lt: '2017' } }, data));
  });
  it('reverse: 0 $lt false', function () {
    assert(!checkDepends({ bugs: { $lt: false } }, data));
  });
  it('reverse: false $lt empty string', function () {
    assert(!checkDepends({ no: { $lt: '' } }, data));
  });
  it('reverse: 0 $lt empty string', function () {
    assert(!checkDepends({ bugs: { $lt: '' } }, data));
  });
  it('objectid $lt objectid', function () {
    assert(checkDepends({ objectid: { $lt: new ObjectID('5eec088b6032cb16eb2418bb') } }, data));
  });
  it('reverse: objectid $lt objectid', function () {
    assert(!checkDepends({ objectid: { $lt: new ObjectID('5eec088b6032cb16eb2418b0') } }, data));
  });
});
