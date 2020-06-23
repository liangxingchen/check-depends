/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-06
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const data = require('./data');

describe('test $eq', function () {
  it('value $eq string', function () {
    assert(checkDepends({ license: { $eq: 'MIT' } }, data));
  });
  it('reverse: value $eq string', function () {
    assert(!checkDepends({ license: { $eq: 'GPL' } }, data));
  });
  it('reverse: value $eq string RegExp', function () {
    assert(!checkDepends({ license: { $eq: /MIT/ } }, data));
  });
  it('value $eq number', function () {
    assert(checkDepends({ from: { $eq: 2016 } }, data));
  });
  it('reverse: value $eq number', function () {
    assert(!checkDepends({ from: { $eq: 2018 } }, data));
  });
  it('value $eq string array', function () {
    assert(checkDepends({ tags: { $eq: 'web' } }, data));
  });
  it('value $eq number array', function () {
    assert(checkDepends({ numbers: { $eq: 20 } }, data));
  });
  it('value $eq number array', function () {
    assert(checkDepends({ numbers: { $eq: [0, 15, 20] } }, data));
  });
  it('value $eq objectid', function () {
    assert(checkDepends({ objectid: { $eq: new ObjectID('5eec088b6032cb16eb2418ba') } }, data));
  });
});
