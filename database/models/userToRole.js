const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   UserToRoleModel:
 *     description: |
 *       Relation model that makes the many-to-many mapping between `UserModel` and `RoleModel`.
 *       A user can have a role of "admin", "seller" or both.
 *       If you're interested to check "What kind of seller a user is ?" (e.g. "owner", "manager")
 *       then check the relations in `UserStoreRoleModel`.
 *     allOf:
 *     - type: object
 *       required:
 *       - userId
 *       - roleId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: Role ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 */
const UserToRoleModel = sequelize.define('userToRole', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },

  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'role',
      key: 'id',
    },
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
})


module.exports = UserToRoleModel
