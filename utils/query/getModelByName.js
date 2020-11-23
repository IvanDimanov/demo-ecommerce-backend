const { models } = require('../../database')

/**
 * TODO: This array of names can be calculated and returned from here:
 * database/config/sequelize-pool.js
 *
 * like:
 *  module.exports = {
 *    Sequelize,
 *    getInstance,
 *    getModelByName,   // <= Newly added
 *  };
 */
const nameToModel = Object.keys(models)
  .map((key) => models[key])
  .filter(({ options: { name } = {} }) => name)

  .map((model) => ({
    model,
    names: [
      ...(model?.aliases || []),
      model.options.name.plural,
      model.options.name.singular,
    ],
  }))

  .reduce((map, { model, names }) => ({
    ...map,
    ...names.reduce((map, name) => ({
      ...map,
      [name]: model,
    }), {}),
  }), {})

const getModelByName = (name) => nameToModel[name]

module.exports = getModelByName
