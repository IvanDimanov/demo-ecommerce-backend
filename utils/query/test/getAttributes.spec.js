const getAttributes = require('../getAttributes')

describe('/query/getAttributes', () => {
  it('should return `undefined` when called with empty object', () => {
    expect(
      getAttributes()
    ).to.equal(undefined)

    expect(
      getAttributes(7)
    ).to.equal(undefined)

    expect(
      getAttributes({})
    ).to.equal(undefined)
  })


  it('should return attributes related only to the root object', () => {
    expect(
      getAttributes({
        id: '',
        code: '',
        wrong: '11',
        childObject: {},
      })
    ).to.deep.equal(
      ['id', 'code']
    )
  })


  it('should return asterisk attributes when root object has no requested attributes', () => {
    expect(
      getAttributes({
        childObject: {},
      })
    ).to.deep.equal(
      ['*']
    )
  })
})
