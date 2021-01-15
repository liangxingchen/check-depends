/**
 * @copyright Maichong Software Ltd. 2018 http://maichong.it
 * @date 2018-01-07
 * @author Liang <liang@maichong.it>
 */

const assert = require('assert');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $jsonSchema', function () {
  it('query empty $jsonSchema', function () {
    assert(checkDepends({ $jsonSchema: {} }, data));
  });
  it('query $jsonSchema', function () {
    assert(
      checkDepends(
        {
          $jsonSchema: {
            properties: {
              name: {
                type: 'string'
              }
            }
          }
        },
        data
      )
    );
  });
  it('reverse: query $jsonSchema', function () {
    assert(
      !checkDepends(
        {
          $jsonSchema: {
            properties: {
              name: {
                type: 'number'
              }
            }
          }
        },
        data
      )
    );
  });
  // Ajv 不会报错
  // it('reverse: query $jsonSchema', function () {
  //   assert(!checkDepends({
  //     $jsonSchema: {
  //       name: {
  //         type: 'number'
  //       }
  //     }
  //   }, data));
  // });
  it('reverse: query $jsonSchema', function () {
    assert(
      !checkDepends(
        {
          $jsonSchema: {
            enum: ['MIT', 'GPL']
          }
        },
        data
      )
    );
  });
});
