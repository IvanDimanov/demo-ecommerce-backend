const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   StoreToProductModel:
 *     description: |
 *       Relation model that makes the many-to-many mapping between `StoreModel` and `ProductModel`.
 *       This models shows which product belongs to which store.
 *     allOf:
 *     - type: object
 *       required:
 *       - storeId
 *       - productId
 *       properties:
 *         storeId:
 *           type: string
 *           format: uuid
 *           description: Store ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 */
const StoreToProductModel = sequelize.define('storeToProduct', {
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'store',
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


module.exports = StoreToProductModel
