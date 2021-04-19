const BaseModel = require('./BaseModel')

/**
 * @swagger
 * definitions:
 *   AddressModel:
 *     description: |
 *       `AddressModel` is a general location description that can be related to a product, order, or other object.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - addressLine1
 *       - addressLine2
 *       - city
 *       - state
 *       - country
 *       - postalCode
 *       - createdAt
 *       - deletedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique address ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         addressLine1:
 *           type: string
 *           description: General street identification
 *           example: 9th ave
 *         addressLine2:
 *           type: string
 *           description: Specific street identification, like street number
 *           example: 10a
 *         city:
 *           type: string
 *           description: City name
 *           example: New York
 *         state:
 *           type: string
 *           description: State or province name
 *           example: New York
 *         country:
 *           type: string
 *           description: Country name
 *           example: USA
 *         postalCode:
 *           type: string
 *           description: Postal or ZIP code
 *           example: 12000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that address was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that address was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
class Address extends BaseModel {
  static tableName = 'address'

  static relationMappings = {
    product: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Product',
      join: {
        from: 'address.id',
        to: 'product.originAddressId',
      },
    },

    order: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Order',
      join: {
        from: 'address.id',
        to: 'order.shippingAddressId',
      },
    },
  }
}


// const AddressModel = sequelize.define('address', {
//   id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },

//   addressLine1: {
//     type: DataTypes.STRING(320),
//     allowNull: false,
//   },

//   addressLine2: {
//     type: DataTypes.STRING(320),
//     allowNull: false,
//   },

//   city: {
//     type: DataTypes.STRING(320),
//     allowNull: false,
//   },

//   state: {
//     type: DataTypes.STRING(320),
//     allowNull: false,
//   },

//   country: {
//     type: DataTypes.STRING(320),
//     allowNull: false,
//   },

//   postalCode: {
//     type: DataTypes.STRING(320),
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
//   paranoid: false,
// })


// AddressModel.aliases = [
//   'originAddress',
//   'shippingAddress',
// ]


module.exports = Address
