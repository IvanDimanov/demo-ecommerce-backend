const getFindOptions = require('../getFindOptions')

describe('/query/getFindOptions', () => {
  it('should return empty options when called with empty object', () => {
    expect(
      getFindOptions({
        Op: {},
        getModelByName: () => '',
      })
    ).to.deep.equal({})
  })


  it('should return simple find options when called with simple object', () => {
    expect(
      getFindOptions({
        select: {
          id: '',
          name: '',
        },
        Op: {},
        getModelByName: () => '',
      })
    ).to.deep.equal({
      attributes: ['id', 'name'],
    })
  })


  it('should return "offset" and "limit" when the `select` object request them', () => {
    expect(
      getFindOptions({
        select: {
          'id': '',
          'name': '',
          '$offset': 14,
          '$limit': 11,
        },
        Op: {},
        getModelByName: () => '',
      })
    ).to.deep.equal({
      attributes: ['id', 'name'],
      offset: 14,
      limit: 11,
    })
  })


  it('should return complex find options when called with complex "$where" object', () => {
    expect(
      getFindOptions({
        select: {
          id: '',
          name: '',
          test: {
            'code': '',
            '$where': {
              test: {
                '$eq': 11,
              },
            },
          },
        },
        Op: {
          'eq': '===',
        },
        getModelByName: () => 'testModel',
      })
    ).to.deep.equal({
      attributes: ['id', 'name'],
      include: [{
        model: 'testModel',
        as: 'test',
        attributes: ['code'],
        required: 1,
        duplicating: false,
        through: {
          attributes: [],
        },
        where: {
          test: {
            '===': 11,
          },
        },
      }],
    })
  })


  it('should return complex find options when called with complex "$order" object', () => {
    expect(
      getFindOptions({
        select: {
          'id': '',
          'name': '',
          'test': {
            'code': '',
          },
          '$order': [
            ['name', 'asc'],
            ['test.code', 'desc'],
          ],
        },
        Op: {},
        getModelByName: () => 'testModel',
      })
    ).to.deep.equal({
      attributes: ['id', 'name'],
      include: [{
        model: 'testModel',
        as: 'test',
        required: true,
        duplicating: false,
        attributes: ['code'],
        through: {
          attributes: [],
        },
      }],
      order: [
        ['name', 'asc'],
        [
          {
            model: 'testModel',
            as: 'test',
          },
          'code',
          'desc',
        ],
      ],
    })
  })
})
