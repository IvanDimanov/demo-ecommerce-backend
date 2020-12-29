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
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Find and count all Users
 *     description: |
 *       Returns a list of `UserModel` items that matched the `select` criteria.
 *     operationId: findAndCountAllUsers
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: select
 *         in: query
 *         type: object
 *         description: |
 *           The `select` query object is used to point what data the API need to return.
 *           Adding a property to the `select` object will return the corresponding data.
 *
 *           For example, if you'd like to get a list of all `Users` with their full name, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": ""
 *           }
 *           ```
 *           <br />
 *
 *           Whenever you fee like you want only a slice of the response you can apply pagination via the `$offset` and `$limit` props.
 *           For example, if you'd like to get page **3** of all `Users` with a maximum of **5** rows per page, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": "",
 *             "$offset": 10,
 *             "$limit": 5
 *           }
 *           ```
 *           <br />
 *
 *           Filtration is also supported with the special key of `"$where":{}`. The `$where` object supports all comparison operators
 *           from Sequelize ORM https://sequelize.org/master/manual/model-querying-basics.html#operators. Please note that operations are prefixed, e.g. instead of `Op.eq` => `$eq`.
 *
 *           For example, if you'd like to get a list of all `Users` within the continent of `Africa`, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": "",
 *             "country": {
 *               "name": "",
 *               "continent_name": "",
 *               "$where": {
 *                 "continent_name": {
 *                   "$eq": "Africa"
 *                 }
 *               }
 *             }
 *           }
 *           ```
 *           <br />
 *
 *           Similarly, you can use the `"$order":[]` object to set a specific order of your results. The `$order` object is an array of rules that will be applied starting from the first rule in the array down to the last one.
 *
 *           For example, if you'd like to get a list of `Users` which ordered the most products by country, you can submit this `select`:
 *           ```
 *           {
 *             "full_name": "",
 *             "country": {
 *               "name": ""
 *             },
 *             "orders": {
 *               "id": "",
 *               "order_items": {
 *                 "quantity": ""
 *               }
 *             },
 *             "$order": [
 *               ["orders.order_items.quantity", "desc"],
 *               ["country.name", "asc"]
 *             ]
 *           }
 *           ```
 *           <br />
 *
 *         default:
 *           full_name: ''
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
 *                 An array of `UserModel` items that matched the request parameters.
 *               type: 'array'
 *               items:
 *                 $ref: '#/definitions/UserModel'
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/v1/users',
  parseSelectFromQuery,
  validator.query(SelectSchema),

  async (ctx) => {
    const { select } = ctx.request.query
    const { models } = ctx.database

    const findOptions = getFindOptions({ select, parentModel: models.user })
    const users = await models.user.findAndCountAll(findOptions)

    ctx.body = users
  }
)

module.exports = router
