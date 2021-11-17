const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $regex', function () {
  it('test $regex string', function () {
    assert(checkDepends({ name: { $regex: 'CheckDepends' } }, data));
  });
  it('reverse: test $regex string', function () {
    assert(!checkDepends({ name: { $regex: 'checkdepends' } }, data));
  });
  it('test $regex RegExp', function () {
    assert(checkDepends({ name: { $regex: /CheckDepends/ } }, data));
  });
  it('reverse: test $regex RegExp', function () {
    assert(!checkDepends({ name: { $regex: /checkdepends/ } }, data));
  });
  it('test $regex RegExp with options', function () {
    assert(checkDepends({ name: { $regex: /checkdepends/i } }, data));
  });
  it('test $regex RegExp & $options', function () {
    assert(checkDepends({ name: { $regex: /checkdepends/, $options: 'i' } }, data));
  });
  it('test $regex RegExp with options & $options', function () {
    assert(checkDepends({ name: { $regex: /checkdepends/m, $options: 'i' } }, data));
  });
  it('reverse: test $regex RegExp with options & $options', function () {
    assert(!checkDepends({ name: { $regex: /checkdepends/i, $options: 'm' } }, data));
  });
  it('test $regex string & $options', function () {
    assert(checkDepends({ name: { $regex: 'checkdepends', $options: 'i' } }, data));
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
      checkDepends({ $regex: { name: /CheckDepends/ } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
  it('reverse: test $regex incorrect grammar $or', function () {
    try {
      checkDepends({ name: { $regex: { $or: [/CheckDepends/] } } }, data);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
});
