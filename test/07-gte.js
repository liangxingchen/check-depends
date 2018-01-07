/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-06
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const data = require('./data');

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
    assert(checkDepends({ others: { $gte: null } }, data));
  });
  it('0 $gte null', function () {
    assert(checkDepends({ bugs: { $gte: null } }, data));
  });
  it('false $gte null', function () {
    assert(checkDepends({ no: { $gte: null } }, data));
  });
  it('reverse: undefined $gte null', function () {
    assert(!checkDepends({ undefined: { $gte: null } }, data));
  });
  it('reverse: not exist $gte null', function () {
    assert(!checkDepends({ noExist: { $gte: null } }, data));
  });
  it('number $gte false', function () {
    assert(checkDepends({ from: { $gte: false } }, data));
    assert(checkDepends({ bugs: { $gte: false } }, data));
  });
  it('number $gte true', function () {
    assert(checkDepends({ from: { $gte: true } }, data));
    assert(checkDepends({ one: { $gte: true } }, data));
  });
  it('0 $gte empty string', function () {
    assert(checkDepends({ bugs: { $gte: '' } }, data));
  });
  it('number $gte string number', function () {
    assert(checkDepends({ from: { $gte: '2016' } }, data));
    assert(checkDepends({ from: { $gte: '2015' } }, data));
  });
  it('0 $gte false', function () {
    assert(checkDepends({ bugs: { $gte: false } }, data));
  });
  it('false $gte empty string', function () {
    assert(checkDepends({ no: { $gte: '' } }, data));
  });
  it('0 $gte empty string', function () {
    assert(checkDepends({ bugs: { $gte: '' } }, data));
  });
});
