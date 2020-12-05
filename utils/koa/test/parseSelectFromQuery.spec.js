const parseSelectFromQuery = require('../parseSelectFromQuery')

describe('/koa/parseSelectFromQuery', () => {
  it('should be a {Function}', () => {
    expect(parseSelectFromQuery).to.be.a('function')
  })


  it('should set `ctx.request.query.select` to a valid JSON', () => {
    const ctx = { request: { query: { select: 11 } } }

    parseSelectFromQuery(ctx)

    expect(ctx.request.query.select).to.deep.equal(11)
  })


  it('should parse `ctx.request.query.select` as a valid JSON', () => {
    const ctx = { request: { query: { select: '{"test": 11}' } } }

    parseSelectFromQuery(ctx)

    expect(ctx.request.query.select).to.deep.equal({ test: 11 })
  })


  it('should parse `ctx.request.query.select` as a valid JSON5', () => {
    const ctx = { request: { query: { select: `
      {
        name: '',
        createdAt: '',
        $limit: 1,
      
        userStoreRoles: {
          storeRoleCode: '',
          $where: {
            storeRoleCode: "sellerOwner"
          },
      
          store: {
            name: '',
            products: {
              price: ''
            }
          }
        }
      }
    ` } } }

    parseSelectFromQuery(ctx)

    expect(ctx.request.query.select).to.deep.equal({
      $limit: 1,
      createdAt: '',
      name: '',
      userStoreRoles: {
        $where: {
          storeRoleCode: 'sellerOwner',
        },
        store: {
          name: '',
          products: {
            price: '',
          },
        },
        storeRoleCode: '',
      },
    })
  })


  it('should set `ctx.request.query.select` to a valid JSON even if parsing fails', () => {
    const ctx = { request: { query: { select: 'invalid JSON' } } }

    parseSelectFromQuery(ctx)

    expect(ctx.request.query.select).to.deep.equal({})
  })
})
