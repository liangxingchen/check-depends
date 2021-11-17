const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test assembly', function () {
  it('assembly', function () {
    assert(
      checkDepends(
        {
          license: { $in: ['MIT', 'Apache', 'BSD'] },
          from: { $gt: 2012, $lt: 2018 },
          bugs: { $lt: 100, $eq: 0, $in: [0, 1] },
          one: { $gt: 0 }
        },
        data
      )
    );
  });

  it('$or', function () {
    assert(
      checkDepends(
        {
          name: 'CheckDepends',
          $or: [
            {
              license: { $in: ['MIT', 'Apache', 'BSD'] },
              from: 2017,
              bugs: 0
            },
            {
              from: 2016
            }
          ]
        },
        data
      )
    );
  });
});
