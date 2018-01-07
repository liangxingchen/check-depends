# check-depends
数据对象检查、验证，灵感来自于 MongoDB 查询语法。



## 用法

```js
const checkDepends = require('check-depends');

const data = {
  name: 'Alaska',
  license: 'MIT',
  author: 'Liang',
  tags: ['web', 'app'],
  numbers: [0, 15, 20],
  empty: [],
  obj: {},
  object: { attr: 1 },
  regexp: '/Alaska/',
  from: 2016,
  awesome: true,
  bugs: 0,
  zero: 0,
  one: 1,
  no: false,
  others: null,
  undefined: undefined
};

checkDepends('name',data); // true
checkDepends('!name',data); // false
checkDepends('others',data); // false
checkDepends({name:'Alaska'},data); // true
checkDepends({ name: ':regexp' }, data); // true
checkDepends({from:{ $gt: 2015 }},data); // true
checkDepends({tags:/web/ },data); // true
checkDepends({obj:{} },data); // true
checkDepends({object:{attr:1} },data); // true
checkDepends({numbers:{ $all:[15,20] } },data); // true
checkDepends({ $or: [{name: '/alaska/i'}, { no: true }] },data); // true
checkDepends({ $jsonSchema: {} }); //true
checkDepends({ $jsonSchema: { properties: {name:{ type:'number' }}} }); //false
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

- MongoDB中一般不同类型比较会返回false，而JS则会类型转换，但是undefined不会转换
- MongoDB中不存在的值可以用null匹配，而JS中不存在的值只能用undefined匹配
- MongoDB中undefined等于null，而JS中undefined不等于null
- MongoDB中不能查询undefined
- check-depends 中可以用字符串表示正则
- MongoDB支持JSON Schema draft 4，check-depends 使用AJV验证JSON Schema
- check-depends 中`:`开头的字符串 `:key`，代表data值引用 

差异举例：

| Exp                                 | MongoDB                         | check-depends (JS) |
| ----------------------------------- | ------------------------------- | ------------------ |
| 1 > false                           | false                           | true               |
| 0 >= null                           | false                           | true               |
| false >= null                       | false                           | true               |
| 1 >= null                           | false                           | true               |
| 0 >= false                          | false                           | true               |
| 1 >= false                          | false                           | true               |
| 1 >= true                           | false                           | true               |
| 0 >= ''                             | false                           | true               |
| undefined = null                    | true                            | false              |
| undefined >= null                   | true                            | false              |
| undefined <= null                   | true                            | false              |
| undefined >=0                       | false                           | false              |
| `"/abc/i"`                          | string                          | RegExp             |
| $jsonSchema: {name:{type:'number'}} | Error(' Unknown keyword: name') | true               |

