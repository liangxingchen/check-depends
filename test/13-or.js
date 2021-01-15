/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $or', function () {
  it('test plain object all matched', function () {
    assert(checkDepends({ $or: [{ name: 'Alaska' }, { from: 2016 }] }, data));
  });
  it('test plain object', function () {
    assert(checkDepends({ $or: [{ name: 'Alaska' }, { from: 2018 }] }, data));
  });
  it('reverse: test plain object', function () {
    assert(!checkDepends({ $or: [{ name: 'Koa' }, { from: 2017 }] }, data));
  });
  it('test $gt $or $lt all matched', function () {
    assert(checkDepends({ $or: [{ from: { $gt: 2012 } }, { from: { $lt: 2017 } }] }, data));
  });
  it('test $gt $or $lt', function () {
    assert(checkDepends({ $or: [{ from: { $gt: 2018 } }, { from: { $lt: 2017 } }] }, data));
  });
  it('reverse: test $gt $or $lt', function () {
    assert(!checkDepends({ $or: [{ from: { $gt: 2018 } }, { from: { $lt: 2016 } }] }, data));
  });
  it('test RegExp', function () {
    assert(checkDepends({ $or: [{ name: /Alaska/ }, { no: true }] }, data));
  });
  it('test ref string RegExp', function () {
    assert(checkDepends({ $or: [{ name: ':regexp' }, { no: true }] }, data));
  });
});
