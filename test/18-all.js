const assert = require('assert');
const { ObjectID } = require('bson');
const checkDepends = require('../');
const { data } = require('./data');

describe('test $all', function () {
  it('test $all on string', function () {
    assert(checkDepends({ license: { $all: ['MIT'] } }, data));
  });
  it('reverse: test $all on string', function () {
    assert(!checkDepends({ license: { $all: ['MIT', 'GPL'] } }, data));
  });
  it('test $all slice', function () {
    assert(checkDepends({ tags: { $all: ['web'] } }, data));
  });
  it('test $all full array', function () {
    assert(checkDepends({ tags: { $all: ['web', 'app'] } }, data));
  });
  it('reverse: test $all', function () {
    assert(!checkDepends({ tags: { $all: ['web', 'app', 'desktop'] } }, data));
  });
  it('test $all objectid', function () {
    assert(
      checkDepends(
        {
          ids: { $all: [new ObjectID('5eec088b6032cb16eb2418ba'), new ObjectID('5eec088b6032cb16eb2418bb')] }
        },
        data
      )
    );
  });
  it('query objectid $all string', function () {
    assert(
      checkDepends(
        {
          ids: { $all: ['5eec088b6032cb16eb2418ba', '5eec088b6032cb16eb2418bb'] }
        },
        data
      )
    );
  });
  it('query objectid $all objectid/string', function () {
    assert(
      checkDepends(
        {
          ids: { $all: [new ObjectID('5eec088b6032cb16eb2418ba'), '5eec088b6032cb16eb2418bb'] }
        },
        data
      )
    );
  });
  it('test $all nest array', function () {
    assert(checkDepends({ tags: { $all: [['web', 'app']] } }, data));
  });
  it('reverse: test $all nest array', function () {
    assert(!checkDepends({ tags: { $all: [['web']] } }, data));
  });
  it('test $all RegExp on string', function () {
    assert(checkDepends({ name: { $all: [/CheckDepends/] } }, data));
  });
  it('test $all ref RegExp string on string', function () {
    assert(checkDepends({ name: { $all: [':name'] } }, data));
  });
  it('reverse: test $all RegExp on string', function () {
    assert(!checkDepends({ name: { $all: [/checkdepends/] } }, data));
  });
  it('test $all RegExp', function () {
    assert(checkDepends({ tags: { $all: [/web/] } }, data));
  });
  it('test $all string RegExp', function () {
    assert(checkDepends({ tags: { $all: ['/web/'] } }, data));
  });
  it('reverse: test $all RegExp', function () {
    assert(!checkDepends({ tags: { $all: [/desktop/] } }, data));
  });
  it('test $all on number', function () {
    assert(checkDepends({ from: { $all: [2016] } }, data));
  });
  it('reverse: test $all on number', function () {
    assert(!checkDepends({ from: { $all: [2016, 2018] } }, data));
  });
  it('test $all on number array', function () {
    assert(checkDepends({ numbers: { $all: [15, 20] } }, data));
  });
  it('reverse: empty array', function () {
    assert(!checkDepends({ numbers: { $all: [] } }, data));
  });
  it('test null', function () {
    assert(checkDepends({ null: { $all: [null] } }, data));
  });
  it('test $all with $elemMatch', function () {
    assert(
      checkDepends(
        {
          contributors: {
            $all: [
              {
                $elemMatch: {
                  name: 'Liang'
                }
              }
            ]
          }
        },
        data
      )
    );
  });
  it('test $all with $elemMatch', function () {
    assert(
      checkDepends(
        {
          contributors: {
            $all: [
              {
                $elemMatch: {
                  name: /Liang/
                }
              }
            ]
          }
        },
        data
      )
    );
  });
  it('test $all with $elemMatch', function () {
    assert(
      checkDepends(
        {
          contributors: {
            $all: [
              {
                $elemMatch: {
                  name: {
                    $regex: 'liang',
                    $options: 'i'
                  }
                }
              }
            ]
          }
        },
        data
      )
    );
  });
  it('reverse: test $all with $elemMatch', function () {
    assert(
      !checkDepends(
        {
          contributors: {
            $all: [
              {
                $elemMatch: {
                  name: {
                    $regex: 'liang',
                    $options: 'i'
                  },
                  url: {
                    $regex: 'Liang'
                  }
                }
              }
            ]
          }
        },
        data
      )
    );
  });
});
