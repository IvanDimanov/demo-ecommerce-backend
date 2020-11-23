const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   OrderItemModel:
 *     description: |
 *       OrderItemModel represents one thing that the Customer wants to buy.
 *       All order items are grouped within the `OrderModel` so we can give all items
 *       the same shipping details or group/coupon discount.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - orderId
 *       - productId
 *       - props
 *       - quantity
 *       - price
 *       - createdAt
 *       - deletedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique product ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Reference to the `OrderModel`
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Reference to the `ProductModel`
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         props:
 *           type: object
 *           description: JSON list of selected product specific props, such as color, size, volume, km/h, etc.
 *           example: {"color": "Red"}
 *         quantity:
 *           type: number
 *           description: How many of the selected product a buyer wants to buy
 *           example: 7
 *         price:
 *           type: number
 *           description: The price Buyer pays when buys the product
 *           example: 199
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that order item was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that order item was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
const OrderItemModel = sequelize.define('orderItem', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'order',
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

  props: {
    type: DataTypes.JSONB,
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(15, 4),
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


OrderItemModel.associate = ({ order, product }) => {
  OrderItemModel.hasOne(order, {
    as: 'order',
    sourceKey: 'orderId',
    foreignKey: 'id',
  })

  OrderItemModel.hasOne(product, {
    as: 'product',
    sourceKey: 'productId',
    foreignKey: 'id',
  })
}


module.exports = OrderItemModel
