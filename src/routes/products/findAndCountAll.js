const Router = require('koa-router')
const router = new Router()
const {
  parseSelectFromQuery,
  validator,
} = require('../../../utils/koa')

const { SelectSchema } = require('../../validators/params')

const getFindOptions = require('../../../utils/query/getFindOptions')

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Find and count all products
 *     description: |
 *       Returns a list of `ProductModel` items that matched the `select` criteria.
 *     operationId: findAndCountAllProducts
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: select
 *         in: query
 *         type: object
 *         description: Select
 *
 *         default:
 *           name: ''
 *
 *     responses:
 *       200:
 *         description: |
 *           `count` and `rows` response of `UserModel` items that matched the request parameters.
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               format: integer
 *               description: |
 *                 Total number of records that match the `select` criteria.
 *               example: 12
 *             rows:
 *               description: |
 *                 An array of `ProductModel` items that matched the request parameters.
 *               type: 'array'
 *               items:
 *                 $ref: '#/definitions/ProductModel'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/v1/products',
  parseSelectFromQuery,
  validator.query(SelectSchema),

  async (ctx) => {
    const { select } = ctx.request.query
    const { models } = ctx.database

    const findOptions = getFindOptions({ select, parentModel: models.product })
    const products = await models.product.findAndCountAll(findOptions)

    ctx.body = products
    ctx.body = products
  }
)

module.exports = router
