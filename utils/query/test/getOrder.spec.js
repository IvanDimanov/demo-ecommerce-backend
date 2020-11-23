const getOrder = require('../getOrder')

describe('/query/getOrder', () => {
  context('invalid calls', () => {
    it('should return `undefined` for invalid or missing "$order" object', () => {
      expect(
          getOrder()
      ).to.equal(undefined)

      expect(
          getOrder(7)
      ).to.equal(undefined)

      expect(
          getOrder({})
      ).to.equal(undefined)

      expect(
          getOrder({
            id: '',
          })
      ).to.equal(undefined)
    })


    it('should return `undefined` for empty "$order" object', () => {
      expect(
          getOrder([])
      ).to.equal(undefined)
    })


    it('should "echo" order column with no order direction if no direction is specified', () => {
      expect(
          getOrder([
            ['test'],
          ])
      ).to.deep.equal([
        ['test', ''],
      ])
    })
  })


  context('valid calls', () => {
    it('should return simple order object', () => {
      expect(
          getOrder([
            ['test', 'desc'],
          ])
      ).to.deep.equal([
        ['test', 'desc'],
      ])
    })


    it('should return complex order object with nested models', () => {
      expect(
          getOrder([
            ['test', 'desc'],
            ['test1.test2.test3.name', 'asc'],
          ], (name) => 'model.' + name)
      ).to.deep.equal([
        ['test', 'desc'],
        [
          {
            model: 'model.test1',
            as: 'test1',
          },
          {
            model: 'model.test2',
            as: 'test2',
          },
          {
            model: 'model.test3',
            as: 'test3',
          },
          'name',
          'asc',
        ],
      ])
    })
  })
})
