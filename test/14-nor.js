const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $nor', function () {
  it('reverse: test plain object all matched', function () {
    assert(!checkDepends({ $nor: [{ name: 'CheckDepends' }, { from: 2016 }] }, data));
  });
  it('reverse: test plain object', function () {
    assert(!checkDepends({ $nor: [{ name: 'CheckDepends' }, { from: 2018 }] }, data));
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
