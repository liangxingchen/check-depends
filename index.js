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

function getRef(test, parent, top, root) {
  if (typeof test === 'string' && test[0] === ':') {
    test = test.substr(1);
    return get(test, root, parent, top);
  }
  return test;
}

function get(key, data, parent, top) {
  if (key.startsWith('&.')) {
    key = key.substr(2);
    data = parent;
  } else if (key.startsWith('&&.')) {
    key = key.substr(3);
    data = top;
  }
  return _.get(data, key);
}

/**
 * 检查值是否存在于数组中，支持正则数组匹配字符串值
 * @param {any} val
 * @param {Array<any>} array
 * @param {Object} parent
 * @param {Object} top
 * @param {Object} root
 * @returns {boolean}
 */
function inArray(val, array, parent, top, root) {
  var valueIsObjectId = isObjectId(val);
  for (var i in array) {
    var v = array[i];
    v = getRef(v, parent, top, root);
    if (valueIsObjectId) {
      if (isObjectId(v) && v.toHexString() === val.toHexString()) return true;
      continue;
    }
    v = checkRegExp(v);
    if (typeof val === 'string' && v && v instanceof RegExp) {
      if (v.test(val)) return true;
    } else {
      if (eq(val, v)) return true;
    }
  }
  return false;
}

/**
 *
 * @param {Array<any>|any} array 数组或数据
 * @param {any|RegExp} test
 * @param {Object} parent
 * @param {Object} top
 * @param {Object} root
 * @returns {boolean}
 */
function findArrayElement(array, test, parent, top, root) {
  test = getRef(test, parent, top, root);
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

function eq(value, other) {
  if (value === undefined) value = null;
  if (other === undefined) other = null;
  if (value === other) return true;
  if (!value || !other || typeof value !== 'object' || typeof other !== 'object') return false;
  if (_.isArray(value)) {
    if (!_.isArray(other)) return false;
    if (value.length !== other.length) return false;
    return _.every(value, function (v, i) {
      return eq(v, other[i]);
    });
  }
  if (isObjectId(value)) {
    return isObjectId(other) && String(value) === String(other);
  }
  var keys = Object.keys(value);
  for (var i in keys) {
    var key = keys[i];
    if (!eq(value[key], other[key])) return false;
  }
  return Object.keys(other).every(function (key) {
    return keys.includes(key) || other[key] === null || other[key] === null;
  });
}

function gt(a, b) {
  return a > b && typeof a === typeof b;
}

function lt(a, b) {
  return a < b && typeof a === typeof b;
}

/**
 * 检查数据
 * @param {string} value 值
 * @param {Object} test 表达式
 * @param {Object} parent
 * @param {Object} top
 * @param {Object} root
 */
function checkExpression(value, test, parent, top, root) {
  var _value = value;
  if (value === undefined) value = null;
  return _.every(test, function (val, operator) {
    val = getRef(val, parent, top, root);
    if (val === undefined) val = null;
    if (operator === '$eq') {
      if (_.isArray(value) && !_.isArray(val)) {
        return value.indexOf(val) > -1;
      }
      return eq(value, val);
    }
    if (operator === '$ne') {
      return !eq(value, val);
    }
    if (operator === '$gt') {
      return gt(value, val);
    }
    if (operator === '$gte') {
      return eq(value, val) || gt(value, val);
    }
    if (operator === '$lt') {
      return lt(value, val);
    }
    if (operator === '$lte') {
      return eq(value, val) || lt(value, val);
    }
    if (operator === '$in') {
      if (!_.isArray(val)) {
        throw new Error('$in must be an array');
      }
      if (_.isArray(value)) {
        return !!_.find(value, function (v) {
          return inArray(v, val, parent, top, root);
        });
      }
      return inArray(value, val, parent, top, root);
    }
    if (operator === '$nin') {
      if (!_.isArray(val)) {
        throw new Error('$nin must be an array');
      }
      if (_.isArray(value)) {
        return _.every(value, function (v) {
          return !inArray(v, val, parent, top, root);
        });
      }
      return !inArray(value, val, parent, top, root);
    }
    if (operator === '$not') {
      if (typeof val === 'string') {
        val = checkRegExp(val);
      }
      if (val instanceof RegExp) {
        return !(typeof value === 'string' && val.test(value));
      } else if (isExpression(val)) {
        return !checkExpression(value, val, parent, top, root);
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
          return eq(el, value);
        }
        if (isExpression(el)) {
          if (!el.$elemMatch) {
            throw new Error('no $ expressions in $all');
          }
          // $all with $elemMatch
          return _.find(value, function (v) {
            return checkDepends(el.$elemMatch, v, parent, top, root);
          });
        }
        if (!findArrayElement(value, el, parent, top, root)) {
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
          return checkExpression(v, val, parent, top, root);
        });
      }
      // Object
      return _.find(value, function (v) {
        return checkDepends(val, v, parent, top, root);
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
      var res = _value === undefined;
      return val ? !res : res;
    }
    throw new Error('unsupported comparison operator: ' + operator);
  });
}

/**
 * 检查依赖
 * @param {undefined|null|boolean|string|Object} query
 * @param {Object} data
 * @param {Object} [parent]
 * @param {Object} [top]
 * @param {Object} [root]
 * @returns {boolean}
 */
function checkDepends(query, data, parent, top, root) {
  if (query === undefined || data === undefined) return false;
  if (query === null) return false;
  if (query === '') return false;
  if (typeof query === 'boolean') return query;
  top = top || parent || data;
  root = root || data;
  if (typeof query === 'string') {
    var reverse;
    if (query[0] === '!') {
      //反向
      reverse = true;
      query = query.substr(1);
    }
    var res = get(query, data, parent, top);
    return reverse ? !res : !!res;
  }
  return _.every(query, function (test, key) {
    key = getRef(key, parent, top, root);
    test = getRef(test, parent, top, root);
    if (test === undefined) test = null;
    if (key === '$and') {
      if (!_.isArray(test)) {
        throw new Error('$and must be an array');
      }
      return _.every(test, function (v) {
        return checkDepends(v, data, parent, top, root);
      });
    } else if (key === '$or') {
      if (!_.isArray(test)) {
        throw new Error('$or must be an array');
      }
      return _.find(test, function (v) {
        return checkDepends(v, data, parent, top, root);
      });
    } else if (key === '$nor') {
      if (!_.isArray(test)) {
        throw new Error('$nor must be an array');
      }
      return !_.find(test, function (v) {
        return checkDepends(v, data, parent, top, root);
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
    var value = get(key, data, parent, top);

    if (isExpression(test)) {
      // 表达式对象
      return checkExpression(value, test, parent, top, root);
    }

    if (_.isArray(value) && !_.isArray(test)) {
      return findArrayElement(value, test, parent, top, root);
    }

    if (typeof value === 'string' && test instanceof RegExp) {
      return test.test(value);
    }

    return eq(test, value);
  });
}

module.exports = checkDepends;
