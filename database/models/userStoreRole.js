const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   UserStoreRoleModel:
 *     description: |
 *       `UserStoreRoleModel` makes the many-to-many mapping between `UserModel`, `StoreModel`, and `StoreRoleModel`.
 *       This triangulation of shows how a user is related to a store. A seller user might be store "owner", "manager", etc.
 *       List of all available store roles can be found in the `StoreRoleModel`.
 *       If a user is "admin" or "seller" is determined in the `UserToRoleModel`.
 *     allOf:
 *     - type: object
 *       required:
 *       - userId
 *       - storeRoleId
 *       - storeId
 *       - storeRoleCode
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         storeRoleId:
 *           type: string
 *           format: uuid
 *           description: StoreRole ID, relation to "owner", "manager"
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         storeId:
 *           type: string
 *           format: uuid
 *           description: Store ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         storeRoleCode:
 *           type: string
 *           description: StoreRole code prop used for quicker query check
 *           example: sellerOwner
 */
const UserStoreRoleModel = sequelize.define('userStoreRole', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },

  storeRoleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'storeRole',
      key: 'id',
    },
  },

  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'store',
      key: 'id',
    },
  },

  storeRoleCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
})


UserStoreRoleModel.associate = ({ user, storeRole, store }) => {
  UserStoreRoleModel.hasOne(user, {
    as: 'user',
    sourceKey: 'userId',
    foreignKey: 'id',
  })

  UserStoreRoleModel.hasOne(storeRole, {
    as: 'storeRole',
    sourceKey: 'storeRoleId',
    foreignKey: 'id',
  })

  UserStoreRoleModel.hasOne(store, {
    as: 'store',
    sourceKey: 'storeId',
    foreignKey: 'id',
  })
}


module.exports = UserStoreRoleModel
