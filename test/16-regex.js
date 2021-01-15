/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $regex', function () {
  it('test $regex string', function () {
    assert(checkDepends({ name: { $regex: 'Alaska' } }, data));
  });
  it('reverse: test $regex string', function () {
    assert(!checkDepends({ name: { $regex: 'alaska' } }, data));
  });
  it('test $regex RegExp', function () {
    assert(checkDepends({ name: { $regex: /Alaska/ } }, data));
  });
  it('reverse: test $regex RegExp', function () {
    assert(!checkDepends({ name: { $regex: /alaska/ } }, data));
  });
  it('test $regex RegExp with options', function () {
    assert(checkDepends({ name: { $regex: /alaska/i } }, data));
  });
  it('test $regex RegExp & $options', function () {
    assert(checkDepends({ name: { $regex: /alaska/, $options: 'i' } }, data));
  });
  it('test $regex RegExp with options & $options', function () {
    assert(checkDepends({ name: { $regex: /alaska/m, $options: 'i' } }, data));
  });
  it('reverse: test $regex RegExp with options & $options', function () {
    assert(!checkDepends({ name: { $regex: /alaska/i, $options: 'm' } }, data));
  });
  it('test $regex string & $options', function () {
    assert(checkDepends({ name: { $regex: 'alaska', $options: 'i' } }, data));
  });
  it('reverse: test $regex incorrect grammar', function () {
    try {
      assert(checkDepends({ bugs: { $regex: { $eq: 1 } } }, data));
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('reverse: test $regex incorrect grammar', function () {
    try {
      checkDepends({ $regex: { name: /Alaska/ } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('reverse: test $regex incorrect grammar $or', function () {
    try {
      checkDepends({ name: { $regex: { $or: [/Alaska/] } } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
});
