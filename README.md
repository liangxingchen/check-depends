# check-depends


数据对象检查、验证，灵感来自于 MongoDB 查询语法。


## 用法

```js
const checkDepends = require('check-depends');

const data = {
  name: 'CheckDepends',
  license: 'MIT',
  author: 'Liang',
  tags: ['web', 'app'],
  numbers: [0, 15, 20],
  empty: [],
  obj: {},
  object: { attr: 1, foo: 'bar' },
  regexp: '/check/',
  from: 2016,
  awesome: true,
  bugs: 0,
  zero: 0,
  one: 1,
  no: false,
  null: null,
  undefined: undefined
};

checkDepends('name', data); // true
checkDepends('!name', data); // false
checkDepends('null', data); // false
checkDepends({ name: 'CheckDepends' }, data); // true
checkDepends({ 'name.length': 6 }, data); // true
checkDepends({ name: ':regexp' }, data); // true
checkDepends({ from: { $gt: 2015 } }, data); // true
checkDepends({ tags: /web/ }, data); // true
checkDepends({ obj: {} }, data); // true
checkDepends({ object: { attr: 1, foo: 'bar' } }, data); // true
checkDepends({ 'object.foo': 'bar' }, data); // true
checkDepends({ numbers: { $all: [15, 20] } }, data); // true
checkDepends({ 'tags.length': 2 }, data); // true
checkDepends({ $or: [{ name: '/check/i' }, { no: true }] }, data); // true
checkDepends({ $jsonSchema: {} }); //true
checkDepends({ $jsonSchema: { properties: { name: { type: 'number' } } } }); //false
```



已支持的MongoDB查询操作：

- [$eq](https://docs.mongodb.com/manual/reference/operator/query/eq/)
- [$ne](https://docs.mongodb.com/manual/reference/operator/query/ne/)
- [$gt](https://docs.mongodb.com/manual/reference/operator/query/gt/)
- [$gte](https://docs.mongodb.com/manual/reference/operator/query/gte/)
- [$lt](https://docs.mongodb.com/manual/reference/operator/query/lt/)
- [$lte](https://docs.mongodb.com/manual/reference/operator/query/lte/)
- [$in](https://docs.mongodb.com/manual/reference/operator/query/in/)
- [$nin](https://docs.mongodb.com/manual/reference/operator/query/nin/)
- [$not](https://docs.mongodb.com/manual/reference/operator/query/not/)
- [$and](https://docs.mongodb.com/manual/reference/operator/query/and/)
- [$or](https://docs.mongodb.com/manual/reference/operator/query/or/)
- [$nor](https://docs.mongodb.com/manual/reference/operator/query/nor/)
- [$exists](https://docs.mongodb.com/manual/reference/operator/query/exists/)
- [$jsonSchema](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/)
- [$regex](https://docs.mongodb.com/manual/reference/operator/query/regex/)
- [$all](https://docs.mongodb.com/manual/reference/operator/query/all/)
- [$elemMatch](https://docs.mongodb.com/manual/reference/operator/query/elemMatch/)
- [$size](https://docs.mongodb.com/manual/reference/operator/query/size/)




## 和MongoDB的差异

- check-depends 中可以用字符串表示正则
- MongoDB支持JSON Schema draft 4，check-depends 使用AJV验证JSON Schema
- check-depends 中`:`开头的字符串 `:key`，代表data值引用
- check-depends 支持 string.length 和 array.length 查询

差异举例：

| Exp                                 | MongoDB                         | check-depends      |
| ----------------------------------- | ------------------------------- | ------------------ |
| `"/abc/i"`                          | string                          | RegExp             |
| $jsonSchema: {name:{type:'number'}} | Error(' Unknown keyword: name') | true               |



## 和纯JS的差异

为了尽可能贴近MongoDB，0.8版本进行了重构，主要在两个方面：

- 不同类型间进行大小对比始终返回false，比如 `0 < true` 在JS中为真，在MongoDB和check-depends中为假
- undefined被视作null
