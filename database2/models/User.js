const BaseModel = require('./BaseModel')

/**
 * @swagger
 * definitions:
 *   UserModel:
 *     description: |
 *       User can be the administrator that oversee trade.
 *       User can also manage stores.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - name
 *       - email
 *       - hashedPassword
 *       - status
 *       - createdAt
 *       - deletedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique user ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: User name
 *           example: John Smith
 *         email:
 *           type: string
 *           description: User email
 *           example: john@smith.com
 *         hashedPassword:
 *           type: string
 *           description: User password after hashing
 *           example: $argon2i$v=19$m=4096,t=3,p=1$e11PTDcTo+38dPL5QkNDYw$uVU+YbfAsp6PWQWAEKuDkj/u5PtULEEQAWFvreJwkDg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that user was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that user was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
class User extends BaseModel {
  static tableName = 'user'

  static relationMappings = {
    roles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Role',
      join: {
        from: 'user.id',
        through: {
          from: 'userToRole.userId',
          to: 'userToRole.roleId',
        },
        to: 'role.id',
      },
    },

    storeRoles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'StoreRole',
      join: {
        from: 'user.id',
        through: {
          from: 'userStoreRole.userId',
          to: 'userStoreRole.storeRoleId',
        },
        to: 'storeRole.id',
      },
    },

    stores: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Store',
      join: {
        from: 'user.id',
        through: {
          from: 'userStoreRole.userId',
          to: 'userStoreRole.storeId',
          extra: ['storeRoleCode'],
        },
        to: 'store.id',
      },
    },
  }
}


// const UserModel = sequelize.define('user', {
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

//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   hashedPassword: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },

//   status: {
//     allowNull: false,
//     type: DataTypes.ENUM(
//       'pendingValidation',
//       'active',
//       'blocked',
//     ),
//     defaultValue: 'pendingValidation',
//   },

//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },

//   deletedAt: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
// }, {
//   freezeTableName: true,
//   timestamps: false,
//   paranoid: true,

//   hooks: {
//     beforeFind: (user, options) => {
//       console.log(' ')
//       console.log(' ')
//       console.log('Hook: beforeFind')
//       console.log(' ')
//       console.log( user )
//       console.log( user?.include?.[user?.include?.length - 1] )
//       console.log( options )
//       console.log(' ')
//     },
//   },
// })


// UserModel.aliases = [
//   'admin', 'admins',
//   'seller', 'sellers',
//   'owner', 'owners',
//   'manager', 'managers',
//   'advertiser', 'advertisers',
// ]


// UserModel.associate = ({ role, storeRole, userStoreRole, store }) => {

//   UserModel.belongsToMany(storeRole, {
//     as: 'storeRoles',
//     through: 'userStoreRole',
//     foreignKey: 'userId',
//     otherKey: 'storeRoleId',
//   })

//   UserModel.hasMany(userStoreRole, {
//     as: 'userStoreRoles',
//     foreignKey: 'userId',
//   })
// }


module.exports = User
