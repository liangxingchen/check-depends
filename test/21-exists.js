/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const data = require('./data');

describe('test $exists', function () {
  it('value $exists string', function () {
    assert(checkDepends({ license: { $exists: true } }, data));
  });
  it('value $exists null', function () {
    assert(checkDepends({ others: { $exists: true } }, data));
  });
  it('value not $exists undefined', function () {
    assert(checkDepends({ undefined: { $exists: false } }, data));
  });
  it('reverse: value $exists noExist', function () {
    assert(!checkDepends({ noExist: { $exists: true } }, data));
  });
  it('value $exists not exist', function () {
    assert(checkDepends({ noExist: { $exists: false } }, data));
  });
  it('reverse: value not $exists string', function () {
    assert(!checkDepends({ license: { $exists: false } }, data));
  });
});
