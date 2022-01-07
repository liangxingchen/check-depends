const { ObjectID } = require('bson');

exports.data = {
  name: 'CheckDepends',
  company: 'MM',
  license: 'MIT',
  author: 'Liang',
  nodejs: true,
  lang: 'nodejs',
  tags: ['web', 'app'],
  numbers: [0, 15, 20],
  empty: [],
  contributors: [{ name: 'Liang', url: 'https://github.com/liangxingchen' }],
  obj: {},
  object: { attr: 1, foo: 'bar' },
  regexp: '/CheckDepends/',
  from: 2016,
  awesome: true,
  bugs: 0,
  zero: 0,
  one: 1,
  no: false,
  null: null,
  undefined: undefined,
  id: '5eec088b6032cb16eb2418ba',
  objectid: new ObjectID('5eec088b6032cb16eb2418ba'),
  ids: [new ObjectID('5eec088b6032cb16eb2418ba'), new ObjectID('5eec088b6032cb16eb2418bb')]
};

exports.parent = {
  platform: 'nodejs',
  products: [exports.data]
};

exports.top = {
  name: 'MM',
  address: 'Zhengzhou',
  since: 2013,
  platforms: [exports.parent]
};
