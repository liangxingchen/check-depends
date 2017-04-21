/**
 * @copyright Maichong Software Ltd. 2017 http://maichong.it
 * @date 2017-01-17
 * @author Liang <liang@maichong.it>
 */

'use strict';

const assert = require('assert');
const checkDepends = require('../');

const data = {
  name: 'Alaska',
  license: 'MIT',
  author: 'Liang',
  from: 2016,
  awesome: true,
  bugs: 0,
  zero: 0,
  no: false,
  others: null
};

describe('string', function () {
  it('string', function () {
    assert(checkDepends('name', data));
  });
  it('!string', function () {
    assert(!checkDepends('!name', data));
  });
  it('boolean', function () {
    assert(checkDepends('awesome', data));
  });
  it('!boolean', function () {
    assert(!checkDepends('!awesome', data));
  });
  it('number', function () {
    assert(checkDepends('from', data));
  });
  it('!number!', function () {
    assert(!checkDepends('!from', data));
  });
  it('number 0', function () {
    assert(!checkDepends('bugs', data));
  });
  it('!number 0', function () {
    assert(checkDepends('!bugs', data));
  });
  it('null', function () {
    assert(!checkDepends('others', data));
  });
  it('!null', function () {
    assert(checkDepends('!others', data));
  });
  it('undefined', function () {
    assert(!checkDepends('undefined', data));
  });
  it('!undefined', function () {
    assert(checkDepends('!undefined', data));
  });
});

describe('object', function () {
  it('string', function () {
    assert(checkDepends({ 'license': 'MIT' }, data));
  });
  it('string!=', function () {
    assert(!checkDepends({ 'license!=': 'MIT' }, data));
  });
  it('string neq', function () {
    assert(!checkDepends({ 'license': 'Apache' }, data));
  });
  it('string!= neq', function () {
    assert(checkDepends({ 'license!=': 'Apache' }, data));
  });
  it('number', function () {
    assert(checkDepends({ 'from': 2016 }, data));
  });
  it('number!=', function () {
    assert(!checkDepends({ 'from!=': 2016 }, data));
  });
  it('number neq', function () {
    assert(!checkDepends({ 'from': 2017 }, data));
  });
  it('number!= neq', function () {
    assert(checkDepends({ 'from!=': 2017 }, data));
  });
  it('number >', function () {
    assert(checkDepends({ 'from>': 2015 }, data));
  });
  it('number >=', function () {
    assert(checkDepends({ 'from>=': 2016 }, data));
  });
  it('number <', function () {
    assert(checkDepends({ 'from<': 2017 }, data));
  });
  it('number <=', function () {
    assert(checkDepends({ 'from<=': 2016 }, data));
  });
  it('boolean', function () {
    assert(checkDepends({ 'awesome': true }, data));
  });
  it('boolean!=', function () {
    assert(!checkDepends({ 'awesome!=': true }, data));
  });
  it('boolean false', function () {
    assert(!checkDepends({ 'awesome': false }, data));
  });
  it('boolean!= false', function () {
    assert(checkDepends({ 'awesome!=': false }, data));
  });
  it('boolean 1', function () {
    assert(checkDepends({ 'awesome': 1 }, data));
  });
  it('boolean!= 1', function () {
    assert(!checkDepends({ 'awesome!=': 1 }, data));
  });
  it('boolean null', function () {
    assert(!checkDepends({ 'others': true }, data));
  });
  it('string in array', function () {
    assert(checkDepends({ 'license': ['MIT', 'Apache', 'BSD'] }, data));
  });
  it('string!= in array', function () {
    assert(!checkDepends({ 'license!=': ['MIT', 'Apache', 'BSD'] }, data));
  });
  it('string in array not found', function () {
    assert(!checkDepends({ 'name': ['MIT', 'Apache', 'BSD'] }, data));
  });
  it('string!= in array not found', function () {
    assert(checkDepends({ 'name!=': ['MIT', 'Apache', 'BSD'] }, data));
  });
  it('number = :ref', function () {
    assert(checkDepends({ 'bugs': ':zero' }, data));
  });
  it('number > :ref', function () {
    assert(checkDepends({ 'from>': ':zero' }, data));
  });
  it('number <= :ref', function () {
    assert(checkDepends({ 'bugs<=': ':zero' }, data));
  });
  it('string > :ref', function () {
    assert(checkDepends({ 'license>': ':name' }, data));
  });
  it('0 === false', function () {
    assert(!checkDepends({ 'no===': ':zero' }, data));
  });
  it('0 !== false', function () {
    assert(checkDepends({ 'no!==': ':zero' }, data));
  });

  it('assembly', function () {
    assert(checkDepends({
      'license': ['MIT', 'Apache', 'BSD'],
      'from': 2016,
      'bugs': 0,
      'undefined!=': 1
    }, data));
  });

  it('$or', function () {
    assert(checkDepends({
      $or: [{
        'license': ['MIT', 'Apache', 'BSD'],
        'from': 2017,
        'bugs': 0,
        'undefined!=': 1
      }, {
        'from': 2016
      }]
    }, data));
  });

});
