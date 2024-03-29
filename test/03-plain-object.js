const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('query plain object', function () {
  it('value is string', function () {
    assert(checkDepends({ license: 'MIT' }, data));
  });
  it('reverse: value is string', function () {
    assert(!checkDepends({ license: 'GPL' }, data));
  });

  it('query string.length', function () {
    assert(checkDepends({ 'license.length': 3 }, data));
  });

  it('value is number', function () {
    assert(checkDepends({ from: 2016 }, data));
  });
  it('reverse: value is number', function () {
    assert(!checkDepends({ from: 2018 }, data));
  });

  it('value is true', function () {
    assert(checkDepends({ awesome: true }, data));
  });
  it('reverse: value is true', function () {
    assert(!checkDepends({ awesome: false }, data));
  });

  it('reverse: query 1 & value is true', function () {
    assert(!checkDepends({ awesome: 1 }, data));
  });
  it('reverse: query 0 & value is false', function () {
    assert(!checkDepends({ no: 0 }, data));
  });
  it('reverse: query null & value is false', function () {
    assert(!checkDepends({ no: null }, data));
  });
  it('reverse: query undefined & value is false', function () {
    assert(!checkDepends({ no: undefined }, data));
  });

  it('value is null', function () {
    assert(checkDepends({ null: null }, data));
  });
  it('reverse: query 0 & value is null', function () {
    assert(!checkDepends({ null: 0 }, data));
  });
  it('reverse: query false & value is null', function () {
    assert(!checkDepends({ null: false }, data));
  });
  it('reverse: query undefined & value is null', function () {
    assert(checkDepends({ null: undefined }, data));
  });

  it('value is undefined', function () {
    assert(checkDepends({ undefined: undefined }, data));
  });
  it('reverse: query 0 & value is undefined', function () {
    assert(!checkDepends({ undefined: 0 }, data));
  });
  it('reverse: query false & value is undefined', function () {
    assert(!checkDepends({ undefined: false }, data));
  });
  it('reverse: query null & value is undefined', function () {
    assert(checkDepends({ undefined: null }, data));
  });
  it('query null & value is not exist', function () {
    assert(checkDepends({ noExist: null }, data));
  });

  it('value is not exist', function () {
    assert(checkDepends({ noExist: undefined }, data));
  });
  it('reverse: query 0 & value is not exist', function () {
    assert(!checkDepends({ noExist: 0 }, data));
  });
  it('reverse: query false & value is not exist', function () {
    assert(!checkDepends({ noExist: false }, data));
  });

  it('reverse: query {} & value is string', function () {
    assert(!checkDepends({ license: {} }, data));
  });

  it('reverse: query {} & value is null', function () {
    assert(!checkDepends({ null: {} }, data));
  });

  it('query {} & value is {}', function () {
    assert(checkDepends({ obj: {} }, data));
  });

  it('reverse: query {} & value is {...}', function () {
    assert(!checkDepends({ object: {} }, data));
  });

  it('query {...} & value is {...}', function () {
    assert(checkDepends({ object: { attr: 1, foo: 'bar' } }, data));
  });

  it('reverse: query {...} & value is {...}', function () {
    assert(!checkDepends({ object: { attr: 1, $gt: 0 } }, data));
  });

  it('query string & value is ObjectId', function () {
    assert(checkDepends({ objectid: '5eec088b6032cb16eb2418ba' }, data));
  });

  it('reverse: query string & value is ObjectId', function () {
    assert(!checkDepends({ objectid: '5eec088b6032cb16eb2418b0' }, data));
  });

  it('query ObjectId & value is string', function () {
    assert(checkDepends({ id: new ObjectID('5eec088b6032cb16eb2418ba') }, data));
  });

  it('reverse: query ObjectId & value is string', function () {
    assert(!checkDepends({ id: new ObjectID('5eec088b6032cb16eb2418b0') }, data));
  });

  it('query object.key', function () {
    assert(checkDepends({ 'object.foo': 'bar' }, data));
  });

  it('query string & value is string array', function () {
    assert(checkDepends({ tags: 'web' }, data));
  });

  it('query RegExp & value is string array', function () {
    assert(checkDepends({ tags: /web/ }, data));
  });

  it('query RegExp & value is string array', function () {
    assert(checkDepends({ tags: '/web/' }, data));
  });

  it('query number & value is number array', function () {
    assert(checkDepends({ numbers: 15 }, data));
  });

  it('query [] & value is []', function () {
    assert(checkDepends({ empty: [] }, data));
  });

  it('query string[] & value is string[]', function () {
    assert(checkDepends({ tags: ['web', 'app'] }, data));
  });

  it('reverse: query string[] & value is string[]', function () {
    assert(!checkDepends({ tags: ['web'] }, data));
  });

  it('reverse: query string[] & value is string[]', function () {
    assert(!checkDepends({ tags: ['app', 'web'] }, data));
  });

  it('query array.length $gte', function () {
    assert(checkDepends({ 'empty.length': 0 }, data));
  });

  it('query array.length', function () {
    assert(checkDepends({ 'tags.length': { $gt: 1 } }, data));
  });

  it('value = :ref', function () {
    assert(checkDepends({ bugs: ':zero' }, data));
  });
  it('value = ref RegExp', function () {
    assert(checkDepends({ name: ':regexp' }, data));
  });
  it('key is ref', function () {
    assert(checkDepends({ ':lang': true }, data));
  });
  it('key is ref', function () {
    assert(checkDepends({ ':lang': ':awesome' }, data));
  });

  it('assembly', function () {
    assert(
      checkDepends(
        {
          license: 'MIT',
          from: 2016,
          bugs: 0,
          awesome: true,
          no: false,
          null: null,
          undefined: null
        },
        data
      )
    );
  });
  it('reverse: assembly', function () {
    assert(
      !checkDepends(
        {
          license: 'MIT',
          from: 2016,
          bugs: 0,
          awesome: true,
          no: false,
          null: null,
          undefined: false
        },
        data
      )
    );
  });
});
