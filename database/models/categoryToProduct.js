const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   CategoryToProductModel:
 *     description: |
 *       Relation model that makes the many-to-many mapping between `CategoryModel` and `ProductModel`.
 *       This models shows which product is tagged with which category.
 *     allOf:
 *     - type: object
 *       required:
 *       - categoryId
 *       - productId
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 */
const CategoryToProductModel = sequelize.define('categoryToProduct', {
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'category',
      key: 'id',
    },
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'product',
      key: 'id',
    },
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
})


module.exports = CategoryToProductModel
