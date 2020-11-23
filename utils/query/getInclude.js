const getModelByName = require('./getModelByName')


const isParentRelatedToChildUsingThroughTable = (parentModel, model, modelName) => {
  if (!parentModel) {
    return false
  }

  const associations = parentModel.getAssociations( model )
  const association = associations.find(({ as }) => as === modelName) || associations[0]

  return Boolean(association?.throughModel)
}


const getInclude = ({ select, parentModel }) => {
  if (!select || !Object.keys(select)) {
    return undefined
  }

  const relatedModels = Object.keys(select)
    .filter((key) => !key.startsWith('$')) // Used for keys like '$where'
    .filter((key) => typeof select[key] === 'object')

  if (!relatedModels.length) {
    return undefined
  }

  return relatedModels
    .map((modelName) => {
      const model = getModelByName(modelName)

      /**
       * Using `require('./getFindOptions')` instead of declaring `const getFindOptions = require('./getFindOptions')`
       * in the beginning of the file
       * in order to avoid circular dependencies.
       */
      const options = require('./getFindOptions')({ select: select[modelName], parentModel: model })

      const updatedOptions = {
        model,
        as: modelName,
        required: true,

        /**
         * If the top `select` wants to use `$limit`
         * then we need to `duplicating: false` as described here:
         * https://github.com/sequelize/sequelize/issues/4446#issuecomment-138288921
         */
        duplicating: false,

        ...options,
      }

      /**
       * When you perform eager loading on a model with a Belongs-to-Many relationship, Sequelize will fetch the junction table data as well, by default.
       * However, you can specify which attributes you want fetched. This is done with the attributes option applied inside the through option of the include.
       * https://sequelize.org/master/manual/eager-loading.html#eager-loading-with-many-to-many-relationships
       */
      if (isParentRelatedToChildUsingThroughTable(parentModel, model, modelName)) {
        /**
         * In case of "TypeError: Cannot read property 'getTableName' of undefined"
         * check `updatedOptions.through` and try to remove it if necessary
         */
        updatedOptions.through = {
          attributes: [],
          ...(updatedOptions?.through || {}),
        }
      }

      return updatedOptions
    })
}


module.exports = getInclude
