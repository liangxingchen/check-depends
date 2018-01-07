/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const data = require('./data');

describe('test $nor', function () {
  it('reverse: test plain object all matched', function () {
    assert(!checkDepends({ $nor: [{ name: 'Alaska' }, { from: 2016 }] }, data));
  });
  it('reverse: test plain object', function () {
    assert(!checkDepends({ $nor: [{ name: 'Alaska' }, { from: 2018 }] }, data));
  });
  it('test plain object', function () {
    assert(checkDepends({ $nor: [{ name: 'Koa' }, { from: 2017 }] }, data));
  });
  it('reverse: test $gt $nor $lt all matched', function () {
    assert(!checkDepends({ $nor: [{ from: { $gt: 2012 } }, { from: { $lt: 2017 } }] }, data));
  });
  it('reverse: test $gt $nor $lt', function () {
    assert(!checkDepends({ $nor: [{ from: { $gt: 2018 } }, { from: { $lt: 2017 } }] }, data));
  });
  it('test $gt $nor $lt', function () {
    assert(checkDepends({ $nor: [{ from: { $gt: 2018 } }, { from: { $lt: 2016 } }] }, data));
  });
});
