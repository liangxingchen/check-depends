/**
 * @copyright Maichong Software Ltd. 2017 http://maichong.it
 * @date 2017-01-17
 * @author Liang <liang@maichong.it>
 */

var _ = require('lodash');

function endsWith(string, ends) {
  return string.substr(string.length - ends.length) === ends;
}

function trimEnds(string, size) {
  return string.substr(0, string.length - size);
}

/**
 * 检查依赖
 * @param {string|object} depends
 * @param {object} data
 * @returns {boolean}
 */
function checkDepends(depends, data) {
  if (!depends) return true;
  if (typeof depends === 'string') {
    if (depends[0] === '!') {
      //反向
      depends = depends.substr(1);
      return !data[depends];
    }
    return !!data[depends];
  }
  if (depends.$or) {
    return _.find(depends.$or, function (d) {
      return checkDepends(d, data);
    });
  }
  return _.every(depends, function (v, k) {
    // 值是数组
    if (_.isArray(v)) {
      if (endsWith(k, '!=')) {
        k = trimEnds(k, 2);
        return v.indexOf(data[k]) === -1;
      }
      return v.indexOf(data[k]) > -1;
    }

    // 值是引用
    if (typeof v === 'string' && v[0] === ':') {
      v = data[v.substr(1)];
    }

    // 大于
    if (endsWith(k, '>')) {
      k = trimEnds(k, 1);
      return data[k] > v;
    }
    // 大于等于
    if (endsWith(k, '>=')) {
      k = trimEnds(k, 2);
      return data[k] >= v;
    }
    // 小于
    if (endsWith(k, '<')) {
      k = trimEnds(k, 1);
      return data[k] < v;
    }
    // 小于等于
    if (endsWith(k, '<=')) {
      k = trimEnds(k, 2);
      return data[k] <= v;
    }
    // 精确相等
    if (endsWith(k, '===')) {
      k = trimEnds(k, 3);
      return data[k] === v;
    }
    // 精确不等
    if (endsWith(k, '!==')) {
      k = trimEnds(k, 3);
      return data[k] !== v;
    }
    // 不等
    if (endsWith(k, '!=')) {
      k = trimEnds(k, 2);
      return data[k] != v;
    }

    // 相等
    return data[k] == v;
  });
}

module.exports = checkDepends;
