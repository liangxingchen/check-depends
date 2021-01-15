/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $not', function () {
  it('test $not', function () {
    assert(checkDepends({ bugs: { $not: { $eq: 1 } } }, data));
  });
  it('reverse: test $not incorrect grammar', function () {
    try {
      checkDepends({ bugs: { $not: 1 } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('reverse: test $not incorrect grammar', function () {
    try {
      checkDepends({ $not: { bugs: 1 } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('reverse: test $not incorrect grammar $or', function () {
    try {
      checkDepends({ bugs: { $not: { $or: [0, 1, 2] } } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('test $not RegExp', function () {
    assert(checkDepends({ name: { $not: /PHP/ } }, data));
  });
  it('test $not RegExp string', function () {
    assert(checkDepends({ name: { $not: '/PHP/' } }, data));
  });
  it('test $not $not', function () {
    assert(checkDepends({ bugs: { $not: { $not: { $eq: 0 } } } }, data));
  });
  it('test $not $not RegExp', function () {
    assert(checkDepends({ name: { $not: { $not: /Alaska/ } } }, data));
  });
});
