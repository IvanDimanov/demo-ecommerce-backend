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


const knex = require('knex')({
  client: process.env.DB_DIALECT,
  connection: process.env.DB_URL,
  pool: {
    max: process.env.DB_CONNECTION_POOL_MAX,
    min: process.env.DB_CONNECTION_POOL_MIN,
  },
  debug: process.env.DB_LOGGING,
})

const { Model } = require('objection')
Model.knex(knex)


const fs = require('fs')
const path = require('path')


const modelsFolderPath = path.join(__dirname, './models')
const models = fs.readdirSync(modelsFolderPath)
  .filter((file) => file.indexOf('.')) // Use only files and not folders

  .map((file) => ({
    key: path.parse(file).name,
    value: require( path.join(modelsFolderPath, file) ),
  }))

  .reduce((map, { key, value }) => ({
    ...map,
    [key]: value,
  }), {})


module.exports = {
  models,
}
