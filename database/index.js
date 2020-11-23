const fs = require('fs')
const path = require('path')

const Sequelize = require('sequelize')
const { getInstance } = require('./config/sequelize-pool')
const sequelizeInstance = getInstance()

/**
 * Requiring all DB Models here
 * so they can get registered in Sequelize
 * and be available as `sequelizeInstance.models`
 */
const modelsFolderPath = path.join(__dirname, './models')
fs.readdirSync(modelsFolderPath)
    .filter((file) => file.indexOf('.')) // Use only files and not folders
    .map((file) => require( path.join(modelsFolderPath, file) ))
    .forEach((model) => {
      /**
       * Resolve model-to-model interdependency here with a custom `associate` function
       * in order to avoid cyclic `require()` calls.
       */
      if (typeof model.associate === 'function') {
        model.associate(sequelizeInstance.models)
      }
    })

module.exports = {
  Sequelize,
  sequelizeInstance,
  models: sequelizeInstance.models,
}
