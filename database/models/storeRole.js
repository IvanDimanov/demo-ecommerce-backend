const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   StoreRoleModel:
 *     description: |
 *       `StoreRoleModel` which Seller user is related to which Store and as what role.
 *       Possible Sore roles can be "owner", "manager", etc.
 *       General User roles (such as "admin" and "seller") are arranged in `RoleModel`.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - name
 *       - code
 *       - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique Store role ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the role
 *           example: Owner
 *         code:
 *           type: string
 *           description: Unique enumeration of the store role used in the programming code
 *           example: owner
 *         description:
 *           type: string
 *           description: Long UI description of the store role
 *           example: Seller that has full access to all of his stores
 */
const StoreRoleModel = sequelize.define('storeRole', {
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

  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
})


StoreRoleModel.associate = ({ user, store }) => {
  StoreRoleModel.belongsToMany(user, {
    as: 'users',
    through: 'userStoreRole',
    foreignKey: 'storeRoleId',
    otherKey: 'userId',
  })

  StoreRoleModel.belongsToMany(store, {
    as: 'stores',
    through: 'userStoreRole',
    foreignKey: 'storeRoleId',
    otherKey: 'storeId',
  })
}


module.exports = StoreRoleModel
