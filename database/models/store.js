const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   StoreModel:
 *     description: |
 *       StoreModel serves as presentational for all Seller products.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - name
 *       - description
 *       - createdAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique store ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the store
 *           example: Alo-Alo
 *         description:
 *           type: string
 *           description: Long UI description of the store
 *           example: Store dedicated on selling only phones
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that store was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that store was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
const StoreModel = sequelize.define('store', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: true,
})


StoreModel.aliases = [
  'ownStore', 'ownStores',
  'manageStore', 'manageStores',
  'advertiseStore', 'advertiseStores',
]


StoreModel.associate = ({ user, storeRole, product }) => {
  StoreModel.belongsToMany(user, {
    as: 'users',
    through: 'userStoreRole',
    foreignKey: 'storeId',
    otherKey: 'userId',
  })

  StoreModel.belongsToMany(storeRole, {
    as: 'storeRoles',
    through: 'userStoreRole',
    foreignKey: 'storeId',
    otherKey: 'storeRoleId',
  })

  StoreModel.belongsToMany(product, {
    as: 'products',
    through: 'storeToProduct',
    foreignKey: 'storeId',
    otherKey: 'productId',
  })
}


module.exports = StoreModel
