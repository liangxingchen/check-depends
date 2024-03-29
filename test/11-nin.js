const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $nin', function () {
  it('query string $nin string array', function () {
    assert(checkDepends({ license: { $nin: ['OpenBSD', 'GPL'] } }, data));
  });
  it('reverse: query string $nin string array', function () {
    assert(!checkDepends({ license: { $nin: ['MIT', 'GPL'] } }, data));
  });
  it('query string $nin number array', function () {
    assert(checkDepends({ license: { $nin: [12, 45] } }, data));
  });
  it('reverse: query number $nin number array', function () {
    assert(!checkDepends({ from: { $nin: [2016, 2018] } }, data));
  });
  it('query number $nin number array', function () {
    assert(checkDepends({ from: { $nin: [2012, 2018] } }, data));
  });
  it('query number $nin string number array', function () {
    assert(checkDepends({ from: { $nin: ['2016', '2018'] } }, data));
  });
  it('reverse: query string array $nin string array', function () {
    assert(!checkDepends({ tags: { $nin: ['web', 'log'] } }, data));
  });
  it('query string array $nin string array', function () {
    assert(checkDepends({ tags: { $nin: ['desktop', 'log'] } }, data));
  });
  it('reverse: query true $nin mixed array', function () {
    assert(!checkDepends({ awesome: { $nin: [0, true, 'GPL'] } }, data));
  });
  it('reverse: query string $nin RegExp array', function () {
    assert(!checkDepends({ license: { $nin: [/^M/, /^Open/] } }, data));
  });
  it('reverse: query string array $nin RegExp array', function () {
    assert(!checkDepends({ tags: { $nin: [/^w/, /log/] } }, data));
  });
  it('query boolean $nin RegExp array', function () {
    assert(checkDepends({ awesome: { $nin: [/true/, /log/] } }, data));
  });
  it('query number $nin RegExp array', function () {
    assert(checkDepends({ from: { $nin: [/1/] } }, data));
  });
  it('query string $nin string array & $in string array', function () {
    assert(checkDepends({ license: { $nin: ['OpenBSD', 'GPL'], $in: ['GPL', 'MIT'] } }, data));
  });
  it('$nin objectid array', function () {
    assert(checkDepends({ objectid: { $nin: [new ObjectID('5eec088b6032cb16eb240000')] } }, data));
  });
  it('reverse: $nin objectid array', function () {
    assert(!checkDepends({ objectid: { $nin: [new ObjectID('5eec088b6032cb16eb2418ba')] } }, data));
  });
  it('query string $nin objectid array', function () {
    assert(checkDepends({ objectid: { $nin: ['5eec088b6032cb16eb240000'] } }, data));
  });
  it('reverse: query string $nin objectid array', function () {
    assert(!checkDepends({ objectid: { $nin: ['5eec088b6032cb16eb2418ba'] } }, data));
  });
});
