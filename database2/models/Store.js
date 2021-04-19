const BaseModel = require('./BaseModel')

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
class Store extends BaseModel {
  static tableName = 'store'

  static relationMappings = {
    products: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Product',
      join: {
        from: 'store.id',
        through: {
          from: 'storeToProduct.storeId',
          to: 'storeToProduct.productId',
        },
        to: 'product.id',
      },
    },

    storeRoles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'StoreRole',
      join: {
        from: 'store.id',
        through: {
          from: 'userStoreRole.storeId',
          to: 'userStoreRole.storeRoleId',
        },
        to: 'storeRole.id',
      },
    },

    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
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


// const StoreModel = sequelize.define('store', {
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

//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
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
// })


// StoreModel.aliases = [
//   'ownStore', 'ownStores',
//   'manageStore', 'manageStores',
//   'advertiseStore', 'advertiseStores',
// ]

module.exports = Store
