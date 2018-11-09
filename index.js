var _ = require('lodash');
var Ajv = require('ajv');

var ajv = new Ajv();

/**
 * 将字符串转换为正则
 * @param {any} value
 * @returns {*|RegExp}
 */
function checkRegExp(value) {
  if (typeof value === 'string' && value[0] === '/') {
    var matchs = value.match(/^\/(.+)\/([igm]*)$/);
    if (matchs) {
      value = new RegExp(matchs[1], matchs[2]);
    }
  }
  return value;
}

function getRef(value, topData) {
  if (typeof value === 'string' && value[0] === ':') {
    var key = value.substr(1);
    if (topData.hasOwnProperty(key)) {
      value = topData[value.substr(1)];
    }
  }
  return value;
}

/**
 * 检查值是否存在于数组中，支持正则数组匹配字符串值
 * @param {any} value
 * @param {Array<any>} array
 * @param {Object} topData
 * @returns {boolean}
 */
function inArray(value, array, topData) {
  for (var i in array) {
    var v = array[i];
    v = getRef(v, topData);
    v = checkRegExp(v);
    if (typeof value === 'string' && v && v instanceof RegExp) {
      if (v.test(value)) return true;
    } else {
      if (value === v) return true;
    }
  }
  return false;
}

/**
 *
 * @param {Array<any>|any} array 数组或数据
 * @param {any|RegExp} element
 * @param {Object} topData
 * @returns {boolean}
 */
function findArrayElement(array, element, topData) {
  element = getRef(element, topData);
  element = checkRegExp(element);
  if (element instanceof RegExp) {
    if (typeof array === 'string') {
      return element.test(array);
    } else if (_.isArray(array)) {
      return _.find(array, function (el) {
        return typeof el === 'string' && element.test(el);
      })
    } else {
      return false;
    }
  }

  if (_.isArray(array)) {
    return array.indexOf(element) > -1;
  }

  return array === element;
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
 * @param {Object} exp 表达式
 * @param {Object} topData
 */
function checkValue(value, exp, topData) {
  return _.every(exp, function (val, operator) {
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
        return _.find(value, function (v) {
          return inArray(v, val, topData);
        })
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
        })
      }
      return !inArray(value, val, topData);
    }
    if (operator === '$not') {
      if (val instanceof RegExp) {
        return !(typeof value === 'string' && val.test(value));
      } else if (isExpression(val)) {
        return !checkValue(value, val, topData);
      } else {
        throw new Error('$not needs a regex or a document');
      }
    }
    if (operator === '$regex') {
      if (exp.$options !== undefined && typeof exp.$options !== 'string') {
        throw new Error('$options has to be a string');
      }
      if (typeof val === 'string') {
        val = new RegExp(val, exp.$options);
      } else if (val instanceof RegExp) {
        if (exp.$options) {
          val.compile(val.source, exp.$options);
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
      if (!exp.$regex) {
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
  })
}

/**
 * 检查依赖
 * @param {undefined|null|boolean|string|Object} query
 * @param {Object} data
 * @param {Object} [topData]
 * @returns {boolean}
 */
function checkDepends(query, data, topData) {
  if (query === undefined) return false;
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
  return _.every(query, function (value, key) {
    // 值是引用
    value = getRef(value, topData);

    if (key === '$and') {
      if (!_.isArray(value)) {
        throw new Error('$and must be an array');
      }
      return _.every(value, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$or') {
      if (!_.isArray(value)) {
        throw new Error('$or must be an array');
      }
      return _.find(value, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$nor') {
      if (!_.isArray(value)) {
        throw new Error('$nor must be an array');
      }
      return !_.find(value, function (v) {
        return checkDepends(v, data, topData);
      });
    } else if (key === '$jsonSchema') {
      if (!value || typeof value !== 'object' || _.isArray(value)) {
        throw new Error('$jsonSchema must be an object');
      }
      return ajv.validate(value, data);
    } else if (key[0] === '$') {
      throw new Error('unsupported top level operator: ' + key);
    }

    value = checkRegExp(value);

    if (isExpression(value)) {
      // 表达式对象
      return checkValue(data[key], value, topData);
    }

    if (_.isArray(data[key]) && !_.isArray(value)) {
      return findArrayElement(data[key], value, topData);
    }

    if (typeof data[key] === 'string' && value instanceof RegExp) {
      return value.test(data[key]);
    }

    return _.isEqual(value, data[key]);
  });
}

module.exports = checkDepends;
