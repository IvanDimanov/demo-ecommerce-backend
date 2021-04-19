const BaseModel = require('./BaseModel')

/**
 * @swagger
 * definitions:
 *   RoleModel:
 *     description: |
 *       `RoleModel` is a list of all available User roles, such as "admin" and "seller".
 *       Specific "store" roles (such as "owner", "manager") are arranged in `StoreRoleModel`.
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
 *           description: Unique role ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the role
 *           example: Admin
 *         code:
 *           type: string
 *           description: Unique enumeration of the role used in the programming code
 *           example: admin
 *         description:
 *           type: string
 *           description: Long UI description of the role
 *           example: User that maintains all stores in the system
 */
class Role extends BaseModel {
  static tableName = 'role'

  static relationMappings = {
    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
      join: {
        from: 'role.id',
        through: {
          from: 'userToRole.roleId',
          to: 'userToRole.userId',
        },
        to: 'user.id',
      },
    },
  }
}


// const RoleModel = sequelize.define('role', {
//   id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },

//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   code: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   freezeTableName: true,
//   timestamps: false,
//   paranoid: false,
// })


module.exports = Role
