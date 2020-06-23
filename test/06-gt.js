/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-06
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const data = require('./data');

describe('test $gt', function () {
  it('value $gt string', function () {
    assert(checkDepends({ license: { $gt: '' } }, data));
  });
  it('reverse: value $gt string', function () {
    assert(!checkDepends({ license: { $gt: 'ZZZ' } }, data));
  });
  it('value $gt number', function () {
    assert(checkDepends({ from: { $gt: 2015 } }, data));
  });
  it('reverse: value $gt number', function () {
    assert(!checkDepends({ from: { $gt: 2017 } }, data));
  });
  it('reverse: null $gt null', function () {
    assert(!checkDepends({ others: { $gt: null } }, data));
  });
  it('reverse: 0 $gt null', function () {
    assert(!checkDepends({ bugs: { $gt: null } }, data));
  });
  it('reverse: false $gt null', function () {
    assert(!checkDepends({ no: { $gt: null } }, data));
  });
  it('reverse: undefined $gt null', function () {
    assert(!checkDepends({ undefined: { $gt: null } }, data));
  });
  it('reverse: not exist $gt null', function () {
    assert(!checkDepends({ noExist: { $gt: null } }, data));
  });
  it('number $gt false', function () {
    assert(checkDepends({ from: { $gt: false } }, data));
  });
  it('number $gt true', function () {
    assert(checkDepends({ from: { $gt: true } }, data));
  });
  it('number $gt empty string', function () {
    assert(checkDepends({ from: { $gt: '' } }, data));
  });
  it('number $gt string number', function () {
    assert(checkDepends({ from: { $gt: '5' } }, data));
  });
  it('reverse: 0 $gt false', function () {
    assert(!checkDepends({ bugs: { $gt: false } }, data));
  });
  it('reverse: false $gt empty string', function () {
    assert(!checkDepends({ no: { $gt: '' } }, data));
  });
  it('reverse: 0 $gt empty string', function () {
    assert(!checkDepends({ bugs: { $gt: '' } }, data));
  });
  it('value $gt :ref', function () {
    assert(checkDepends({ from: { $gt: ':zero' } }, data));
  });
  it('value $gt objectid', function () {
    assert(checkDepends({ objectid: { $gt: new ObjectID('5eec088b6032cb16eb240000') } }, data));
  });
});
