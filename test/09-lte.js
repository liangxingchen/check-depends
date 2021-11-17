const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $lte', function () {
  it('value $lte string', function () {
    assert(checkDepends({ license: { $lte: 'ZZZ' } }, data));
  });
  it('reverse: value $lte empty string', function () {
    assert(!checkDepends({ license: { $lte: '' } }, data));
  });
  it('value $lte number', function () {
    assert(checkDepends({ from: { $lte: 2017 } }, data));
  });
  it('reverse: value $lte number', function () {
    assert(!checkDepends({ from: { $lte: 2015 } }, data));
  });
  it('null $lte null', function () {
    assert(checkDepends({ null: { $lte: null } }, data));
  });
  it('undefined $lte null', function () {
    assert(checkDepends({ undefined: { $lte: null } }, data));
  });
  it('not exist $lte null', function () {
    assert(checkDepends({ noExist: { $lte: null } }, data));
  });
  it('reverse: 0 $lte null', function () {
    assert(!checkDepends({ bugs: { $lte: null } }, data));
  });
  it('reverse: false $lte null', function () {
    assert(!checkDepends({ no: { $lte: null } }, data));
  });
  it('false $lte true', function () {
    assert(checkDepends({ no: { $lte: true } }, data));
  });
  it('reverse: number $lte false', function () {
    assert(!checkDepends({ from: { $lte: false } }, data));
  });
  it('reverse: 0 $lte false', function () {
    assert(!checkDepends({ bugs: { $lte: false } }, data));
  });
  it('reverse: 0 $lte true', function () {
    assert(!checkDepends({ bugs: { $lte: true } }, data));
  });
  it('reverse: number $lte string number', function () {
    assert(!checkDepends({ from: { $lte: '2017' } }, data));
  });
  it('reverse: false $lte empty string', function () {
    assert(!checkDepends({ no: { $lte: '' } }, data));
  });
  it('reverse: 0 $lte empty string', function () {
    assert(!checkDepends({ bugs: { $lte: '' } }, data));
  });
  it('reverse: null $lte empty string', function () {
    assert(!checkDepends({ null: { $lte: '' } }, data));
  });
  it('reverse: undefined $lte empty string', function () {
    assert(!checkDepends({ undefined: { $lte: '' } }, data));
  });
  it('reverse: not exist $lte empty string', function () {
    assert(!checkDepends({ noExist: { $lte: '' } }, data));
  });
});
