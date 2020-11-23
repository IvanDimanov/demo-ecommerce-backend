const Router = require('koa-router')
const router = new Router()

/**
 * @swagger
 * /api/v1/status/ping:
 *   get:
 *     tags:
 *       - Status
 *     summary: Checks latency between the client and API server
 *     description: |
 *       Common ping test to check if `BackEnd Accounts` is still alive.
 *     operationId: getServiceStatus
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: General info about the Server.
 *         properties:
 *           name:
 *             type: string
 *             example: BackEnd Accounts
 *             description: A distinctive name of the current server.
 *           serverTime:
 *             type: string
 *             example: 2019-09-24T17:43:21.142Z
 *             description: Server ISO time.
 *       500:
 *         $ref: '#/responses/AppNotFound'
 */
router.get('/api/v1/status/ping',
  async (ctx) => {
    const sequelizeInstance = ctx.database.sequelizeInstance
    let isDbConnected = true

    try {
      await sequelizeInstance.authenticate()
    } catch (error) {
      isDbConnected = false
    }

    ctx.body = {
      name: 'BackEnd Accounts',
      serverTime: new Date().toISOString(),
      isDbConnected,
    }
  }
)

module.exports = router
