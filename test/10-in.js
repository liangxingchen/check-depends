const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $in', function () {
  it('query string $in string array', function () {
    assert(checkDepends({ license: { $in: ['MIT', 'GPL'] } }, data));
  });
  it('reverse: query string $in string array', function () {
    assert(!checkDepends({ license: { $in: ['GPL'] } }, data));
  });
  it('reverse: query string $in number array', function () {
    assert(!checkDepends({ license: { $in: [12, 45] } }, data));
  });
  it('query number $in number array', function () {
    assert(checkDepends({ from: { $in: [2016, 2018] } }, data));
  });
  it('reverse: query number $in number array', function () {
    assert(!checkDepends({ from: { $in: [2012, 2018] } }, data));
  });
  it('reverse: query number $in string number array', function () {
    assert(!checkDepends({ from: { $in: ['2016', '2018'] } }, data));
  });
  it('query string array $in string array', function () {
    assert(checkDepends({ tags: { $in: ['web', 'log'] } }, data));
  });
  it('reverse: query string array $in string array', function () {
    assert(!checkDepends({ tags: { $in: ['desktop', 'log'] } }, data));
  });
  it('query true $in mixed array', function () {
    assert(checkDepends({ awesome: { $in: [0, true, 'GPL'] } }, data));
  });
  it('query string $in RegExp array', function () {
    assert(checkDepends({ license: { $in: [/^M/, /^Open/] } }, data));
  });
  it('query string array $in RegExp array', function () {
    assert(checkDepends({ tags: { $in: [/^w/, /log/] } }, data));
  });
  it('query string array $in string RegExp array', function () {
    assert(checkDepends({ tags: { $in: ['/^w/'] } }, data));
  });
  it('query string array $in string ref RegExp array', function () {
    assert(checkDepends({ name: { $in: [':regexp'] } }, data));
  });
  it('reverse: query boolean $in RegExp array', function () {
    assert(!checkDepends({ awesome: { $in: [/true/, /log/] } }, data));
  });
  it('reverse: query number $in RegExp array', function () {
    assert(!checkDepends({ from: { $in: [/1/] } }, data));
  });
  it('$in objectid array', function () {
    assert(checkDepends({ objectid: { $in: [new ObjectID('5eec088b6032cb16eb2418ba')] } }, data));
  });
  it('query objectid $in string array', function () {
    assert(checkDepends({ objectid: { $in: ['5eec088b6032cb16eb2418ba'] } }, data));
  });
  it('reverse: query objectid $in string array', function () {
    assert(!checkDepends({ objectid: { $in: ['5eec088b6032cb16eb2418b0'] } }, data));
  });
  it('query string $in objectid array', function () {
    assert(checkDepends({ id: { $in: [new ObjectID('5eec088b6032cb16eb2418ba')] } }, data));
  });
  it('reverse: query string $in objectid array', function () {
    assert(!checkDepends({ id: { $in: [new ObjectID('5eec088b6032cb16eb2418b0')] } }, data));
  });
  it('null $in null array', function () {
    assert(checkDepends({ null: { $in: [true, false, null] } }, data));
  });
  it('undefined $in null array', function () {
    assert(checkDepends({ undefined: { $in: [true, false, null] } }, data));
  });
  it('noExist $in null array', function () {
    assert(checkDepends({ noExist: { $in: [true, false, null] } }, data));
  });
});
