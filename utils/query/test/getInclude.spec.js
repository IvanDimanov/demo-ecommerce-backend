const getInclude = require('../getInclude')

describe('/query/getInclude', () => {
  it('should return `undefined` when called with select that has no includes', () => {
    expect(
      getInclude()
    ).to.equal(undefined)

    expect(
      getInclude(7)
    ).to.equal(undefined)

    expect(
      getInclude({})
    ).to.equal(undefined)

    expect(
      getInclude({
        id: '',
      })
    ).to.equal(undefined)
  })


  it('should return include prop for chid object', () => {
    expect(
      getInclude(
        {
          id: '',
          code: '',
          childObject: {},
        },
        {},
        () => {},
        () => 'childObjectModel',
      )
    ).to.deep.equal(
      [{
        model: 'childObjectModel',
        as: 'childObject',
        required: true,
        duplicating: false,
        through: {
          attributes: [],
        },
      }]
    )
  })
})
