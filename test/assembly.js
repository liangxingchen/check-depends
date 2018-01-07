/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const data = require('./data');

describe('test assembly', function () {
  it('assembly', function () {
    assert(checkDepends({
      license: { $in: ['MIT', 'Apache', 'BSD'] },
      from: { $gt: 2012, $lt: 2018 },
      bugs: { $gte: false, $eq: 0, $in: [0, 1] },
      undefined: { $ne: 1 },
      one: { $gt: 0 }
    }, data));
  });

  it('$or', function () {
    assert(checkDepends({
      name: 'Alaska',
      $or: [{
        license: { $in: ['MIT', 'Apache', 'BSD'] },
        from: 2017,
        bugs: 0,
        undefined: { $ne: 1 }
      }, {
        from: 2016
      }]
    }, data));
  });
});
