import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

/**
 * `pg` module experience difficulties using BigInt values:
 * https://github.com/knex/knex/issues/387#issuecomment-51554522
 * https://github.com/sequelize/sequelize/issues/1774#issuecomment-44318978
 * so we need to set custom parsers for all "out of range" values
 * otherwise the values will be converted to {String}
 */
import pg from 'pg'

/**
 * List of all codes can be found here:
 * https://github.com/brianc/node-pg-types/blob/master/lib/builtins.js#L12
 */
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.INT2, (value: string) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.INT4, (value: string) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.FLOAT4, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.FLOAT8, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.OID, (value: string) => value)


import knexModule from 'knex'
import objection, { Model } from 'objection'
// @ts-ignore
import objectionSoftDelete from 'objection-softdelete'

objectionSoftDelete.register(objection)

import { FromSchema } from 'json-schema-to-ts'
import { envVarSchema, envConfigKey } from 'plugins/fastifyEnv'


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  const {
    DB_URL,
    DB_CONNECTION_POOL_MIN,
    DB_CONNECTION_POOL_MAX,
    DB_LOGGING,
  } = (fastify as unknown as { [envConfigKey]: FromSchema<typeof envVarSchema> })[envConfigKey]

  const knex = knexModule({
    client: 'postgres',
    connection: DB_URL,
    pool: {
      min: DB_CONNECTION_POOL_MIN,
      max: DB_CONNECTION_POOL_MAX,
    },
    debug: DB_LOGGING,
  })

  Model.knex(knex)


  fastify.addHook('onClose', (
    fastify: FastifyInstance,
    done: () => void,
  ) => {
    knex.destroy()
    done()
  })


  done()
})


export default plugin
