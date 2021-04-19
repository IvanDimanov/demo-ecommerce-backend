const BaseModel = require('./BaseModel')

/**
 * @swagger
 * definitions:
 *   OrderModel:
 *     description: |
 *       OrderModel is the base of all that a seller can sell.
 *       It has a general name, price, and props a buyer can view.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - shippingAddressId
 *       - customerName
 *       - customerEmail
 *       - customerPhone
 *       - price
 *       - status
 *       - createdAt
 *       - deletedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique product ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         shippingAddressId:
 *           type: string
 *           format: uuid
 *           description: Reference to the `AddressModel`
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         customerName:
 *           type: string
 *           description: Name of the Customer
 *           example: John Smith
 *         customerEmail:
 *           type: string
 *           description: Email of the Customer
 *           example: john@smith.com
 *         customerPhone:
 *           type: string
 *           description: Phone number of the Customer
 *           example: 555-1234567
 *         status:
 *           type: string
 *           description: Where this orders stands in term of progress toward our customer
 *           example: draft
 *         price:
 *           type: number
 *           description: How much the total order cost the Customer, including coupons or additional shipping expenses
 *           example: 199
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that order was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that order was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
class Order extends BaseModel {
  static tableName = 'order'

  static relationMappings = {
    shippingAddress: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Address',
      join: {
        from: 'order.shippingAddressId',
        to: 'address.id',
      },
    },

    products: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Product',
      join: {
        from: 'order.id',
        through: {
          from: 'orderItem.orderId',
          to: 'orderItem.productId',
        },
        to: 'product.id',
      },
    },

    orderItems: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'OrderItem',
      join: {
        from: 'order.id',
        to: 'orderItem.orderId',
      },
    },
  }
}


// const OrderModel = sequelize.define('order', {
//   id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },

//   shippingAddressId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: 'address',
//       key: 'id',
//     },
//   },

//   customerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   customerEmail: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   customerPhone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   status: {
//     allowNull: false,
//     type: DataTypes.ENUM(
//       'draft',
//       'submitted',
//       'processing',
//       'shipped',
//       'received',
//       'rejected',
//     ),
//     defaultValue: 'draft',
//   },

//   price: {
//     type: DataTypes.DECIMAL(15, 4),
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


module.exports = Order
