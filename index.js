var _ = require('lodash');
var Ajv = require('ajv');

var ajv = new Ajv();

/**
 * 将字符串转换为正则
 * @param {any} test
 * @returns {*|RegExp}
 */
function checkRegExp(test) {
  if (typeof test === 'string' && test[0] === '/') {
    var matchs = test.match(/^\/(.+)\/([igm]*)$/);
    if (matchs) {
      test = new RegExp(matchs[1], matchs[2]);
    }
  }
  return test;
}

function isObjectId(val) {
  return val && typeof val === 'object' && typeof val.toHexString === 'function';
}

function getRef(test, topData) {
  if (typeof test === 'string' && test[0] === ':') {
    var key = test.substr(1);
    return _.get(topData, key);
  }
  return test;
}

/**
 * 检查值是否存在于数组中，支持正则数组匹配字符串值
 * @param {any} val
 * @param {Array<any>} array
 * @param {Object} topData
 * @returns {boolean}
 */
function inArray(val, array, topData) {
  var valueIsObjectId = isObjectId(val);
  for (var i in array) {
    var v = array[i];
    v = getRef(v, topData);
    if (valueIsObjectId) {
      if (isObjectId(v) && v.toHexString() === val.toHexString()) return true;
      continue;
    }
    v = checkRegExp(v);
    if (typeof val === 'string' && v && v instanceof RegExp) {
      if (v.test(val)) return true;
    } else {
      if (val === v) return true;
    }
  }
  return false;
}

/**
 *
 * @param {Array<any>|any} array 数组或数据
 * @param {any|RegExp} test
 * @param {Object} topData
 * @returns {boolean}
 */
function findArrayElement(array, test, topData) {
  test = getRef(test, topData);
  test = checkRegExp(test);
  if (test instanceof RegExp) {
    if (typeof array === 'string') {
      return test.test(array);
    } else if (_.isArray(array)) {
      return _.find(array, function (el) {
        return typeof el === 'string' && test.test(el);
      });
    } else {
      return false;
    }
  }

  if (_.isArray(array)) {
    if (isObjectId(test))
      return !!_.find(array, function (v) {
        return isObjectId(v) && v.toHexString() === test.toHexString();
      });
    return array.indexOf(test) > -1;
  }

  return array === test;
}

/**
 * 检查对象是否是合法表达式对象
 * @param {Object} exp
 * @returns {boolean}
 */
function isExpression(exp) {
  if (exp && typeof exp === 'object' && !_.isArray(exp)) {
    // 对象
    var keys = _.keys(exp);
    if (
      keys.length &&
      _.every(keys, function (key) {
        return key && key[0] === '$';
      })
    ) {
      // 表达式对象
      return true;
    }
  }
  return false;
}

/**
 * 检查数据
 * @param {string} value 值
 * @param {Object} test 表达式
 * @param {Object} topData
 */
function checkValue(value, test, topData) {
  return _.every(test, function (val, operator) {
    val = getRef(val, topData);
    if (operator === '$eq') {
      if (_.isArray(value) && !_.isArray(val)) {
        return value.indexOf(val) > -1;
      }
      return _.isEqual(value, val);
    }
    if (operator === '$ne') {
      return !_.isEqual(value, val);
    }
    if (operator === '$gt') {
      return value > val;
    }
    if (operator === '$gte') {
      return value >= val;
    }
    if (operator === '$lt') {
      return value < val;
    }
    if (operator === '$lte') {
      return value <= val;
    }
    if (operator === '$in') {
      if (!_.isArray(val)) {
        throw new Error('$in must be an array');
      }
      if (_.isArray(value)) {
        return !!_.find(value, function (v) {
          return inArray(v, val, topData);
        });
      }
      return inArray(value, val, topData);
    }
    if (operator === '$nin') {
      if (!_.isArray(val)) {
        throw new Error('$nin must be an array');
      }
      if (_.isArray(value)) {
        return _.every(value, function (v) {
          return !inArray(v, val, topData);
        });
      }
      return !inArray(value, val, topData);
    }
    if (operator === '$not') {
      if (typeof val === 'string') {
        val = checkRegExp(val);
      }
      if (val instanceof RegExp) {
        return !(typeof value === 'string' && val.test(value));
      } else if (isExpression(val)) {
        return !checkValue(value, val, topData);
      } else {
        throw new Error('$not needs a regex or a document');
      }
    }
    if (operator === '$regex') {
      if (test.$options !== undefined && typeof test.$options !== 'string') {
        throw new Error('$options has to be a string');
      }
      if (typeof val === 'string') {
        val = new RegExp(val, test.$options);
      } else if (val instanceof RegExp) {
        if (test.$options) {
          val.compile(val.source, test.$options);
        }
      } else {
        throw new Error('$regex has to be a string or RegExp');
      }
      if (typeof value === 'string') {
        return val.test(value);
      }
      return false;
    }
    if (operator === '$options') {
      if (!test.$regex) {
        throw new Error('$options needs a $regex');
      }
      return true;
    }

    if (operator === '$all') {
      if (!_.isArray(val)) {
        throw new Error('$all has to be an array');
      }
      if (!val.length) return false;
      for (var i in val) {
        var el = val[i];
        if (_.isArray(el)) {
          return _.isEqual(el, value);
        }
        if (isExpression(el)) {
          if (!el.$elemMatch) {
            throw new Error('no $ expressions in $all');
          }
          // $all with $elemMatch
          return _.find(value, function (v) {
            return checkDepends(el.$elemMatch, v, topData);
          });
        }
        if (!findArrayElement(value, el, topData)) {
          return false;
        }
      }
      return true;
    }

    if (operator === '$elemMatch') {
      if (!operator || typeof val !== 'object') {
        throw new Error('$elemMatch needs an Object');
      }
      if (!_.isArray(value)) return false;
      if (isExpression(val)) {
        return _.find(value, function (v) {
          return checkValue(v, val, topData);
        });
      }
      // Object
      return _.find(value, function (v) {
        return checkDepends(val, v, topData);
      });
    }

    if (operator === '$size') {
      if (typeof val !== 'number') {
        throw new Error('$size needs an number');
      }
      return _.isArray(value) && value.length === val;
    }

    if (operator === '$exists') {
      if (typeof val !== 'boolean') {
        throw new Error('$exists needs a boolean');
      }
      var res = value === undefined;
      return val ? !res : res;
    }
    throw new Error('unsupported comparison operator: ' + operator);
  });
}

/**
 * 检查依赖
 * @param {undefined|null|boolean|string|Object} query
 * @param {Object} data
 * @param {Object} [topData]
 * @returns {boolean}
 */
function checkDepends(query, data, topData) {
  if (query === undefined || data === undefined) return false;
  if (query === null) return false;
  if (query === '') return false;
  if (typeof query === 'boolean') return query;
  if (typeof query === 'string') {
    if (query[0] === '!') {
      //反向
      query = query.substr(1);
      return !data[query];
    }
    return !!data[query];
  }
  topData = topData || data;
  return _.every(query, function (test, key) {
    // 值是引用
    test = getRef(test, topData);

    if (key === '$and') {
      if (!_.isArray(test)) {
        throw new Error('$and must be an array');
      }
      return _.every(test, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$or') {
      if (!_.isArray(test)) {
        throw new Error('$or must be an array');
      }
      return _.find(test, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$nor') {
      if (!_.isArray(test)) {
        throw new Error('$nor must be an array');
      }
      return !_.find(test, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$jsonSchema') {
      if (!test || typeof test !== 'object' || _.isArray(test)) {
        throw new Error('$jsonSchema must be an object');
      }
      return ajv.validate(test, data);
    } else if (key[0] === '$') {
      throw new Error('unsupported top level operator: ' + key);
    }

    test = checkRegExp(test);
    var value = _.get(data, key);

    if (isExpression(test)) {
      // 表达式对象
      return checkValue(value, test, topData);
    }

    if (_.isArray(value) && !_.isArray(test)) {
      return findArrayElement(value, test, topData);
    }

    if (typeof value === 'string' && test instanceof RegExp) {
      return test.test(value);
    }

    return _.isEqual(test, value);
  });
}

module.exports = checkDepends;
