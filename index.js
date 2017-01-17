/**
 * @copyright Maichong Software Ltd. 2017 http://maichong.it
 * @date 2017-01-17
 * @author Liang <liang@maichong.it>
 */

var _ = require('lodash');

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
    var found = _.find(depends.$or, function (d) {
      return checkDepends(d, data);
    });

    if (depends[0] === '!') {
      return !found;
    } else {
      return found;
    }
  }
  return _.every(depends, function (v, k) {
    if (_.isArray(v)) {
      if (k[0] === '!') {
        k = k.substr(1);
        return v.indexOf(data[k]) === -1;
      }
      return v.indexOf(data[k]) > -1;
    }
    if (k[0] === '!') {
      k = k.substr(1);
      return data[k] != v;
    }
    if (k[0] === '>') {
      k = k.substr(1);
      if (k[0] === '=') {
        k = k.substr(1);
        return data[k] >= v;
      }
      return data[k] > v;
    }
    if (k[0] === '<') {
      k = k.substr(1);
      if (k[0] === '=') {
        k = k.substr(1);
        return data[k] <= v;
      }
      return data[k] < v;
    }
    return data[k] == v;
  });
}

module.exports = checkDepends;
