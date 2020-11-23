/**
 * `pg` module experience difficulties using BigInt values:
 * https://github.com/knex/knex/issues/387#issuecomment-51554522
 * https://github.com/sequelize/sequelize/issues/1774#issuecomment-44318978
 * so we need to set custom parsers for all "out of range" values
 * otherwise the values will be converted to {String}
 */
const pg = require('pg')

/**
 * List of all codes can be found here:
 * https://github.com/brianc/node-pg-types/blob/master/lib/builtins.js#L12
 */
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.INT2, (value) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.INT4, (value) => Number.parseInt(value, 10))
pg.types.setTypeParser(pg.types.builtins.FLOAT4, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.FLOAT8, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.OID, (value) => value)


const Sequelize = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { getConfig } = require('./config')
const config = getConfig()

Sequelize.formatLogging = (sql) => sql.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ')

const instance = new Sequelize(config.url, config)

instance.id = uuidv4()
instance.types = Sequelize
instance.formatLogging = Sequelize.formatLogging
// Get a new JSON Object with config data just to be sure no one will alter the config inuse
instance.config = getConfig()

const getInstance = () => instance

module.exports = {
  Sequelize,
  getInstance,
}
