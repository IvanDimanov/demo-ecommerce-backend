const getWhere = require('../getWhere')

describe('/query/getWhere', () => {
  it('should "echo" the `where` when called with invalid object', () => {
    expect(
        getWhere()
    ).to.equal(undefined)

    expect(
        getWhere(7)
    ).to.equal(7)

    expect(
        getWhere({})
    ).to.deep.equal({})

    expect(
        getWhere({
          id: '',
        })
    ).to.deep.equal({
      id: '',
    })
  })


  it('should return where prop for single chid object', () => {
    expect(
        getWhere(
            {
              test: {
                '$eq': 11,
              },
            },
            { eq: '===' },
        )
    ).to.deep.equal({
      test: {
        '===': 11,
      },
    })
  })


  it('should return where prop for nested children objects', () => {
    expect(
        getWhere(
            [
              {
                test: {
                  '$eq': 11,
                },
              },
              {
                test: {
                  '$and': [
                    { '$gt': 10 },
                    { '$lt': 20 },
                  ],
                },
              },
            ],
            {
              eq: '===',
              and: '&&',
              gt: '>',
              lt: '<',
            },
        )
    ).to.deep.equal([
      {
        test: {
          '===': 11,
        },
      },
      {
        test: {
          '&&': [
            { '>': 10 },
            { '<': 20 },
          ],
        },
      },
    ])
  })
})
