const BaseModel = require('./BaseModel')

/**
 * @swagger
 * definitions:
 *   ProductModel:
 *     description: |
 *       ProductModel is the base of all that a seller can sell.
 *       It has a general name, price, and props a buyer can view.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - name
 *       - description
 *       - imageUrl
 *       - price
 *       - basePrice
 *       - props
 *       - totalInStock
 *       - originAddressId
 *       - vendorId
 *       - createdAt
 *       - deletedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique product ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the product
 *           example: NOMAD 26
 *         description:
 *           type: string
 *           description: Long UI description of the product
 *           example: Outdoor activities were never so close
 *         imageUrl:
 *           type: string
 *           description: URL of the product image
 *           example: https://www.dimibike.com/images/products/large/cross-nomad-26-inch.jpg
 *         price:
 *           type: number
 *           description: The price Buyer pays when buys the product
 *           example: 199
 *         basePrice:
 *           type: number
 *           description: The price Seller pays to produce the product
 *           example: 75
 *         props:
 *           type: object
 *           description: JSON list of product specific props, such as color, size, volume, km/h, etc.
 *           example: {"color": "Red"}
 *         totalInStock:
 *           type: number
 *           description: How many of these products we have in the store
 *           example: 11
 *         originAddressId:
 *           type: string
 *           format: uuid
 *           description: Reference to the `AddressModel`
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         vendorId:
 *           type: string
 *           format: uuid
 *           description: Reference to the `VendorModel`
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that product was created
 *           example: 2020-04-30T00:00:00.000Z
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: DateTime indicating when that product was marked as deleted
 *           example: 2021-04-30T00:00:00.000Z
 */
class Product extends BaseModel {
  static tableName = 'product'

  static relationMappings = {
    stores: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Store',
      join: {
        from: 'product.id',
        through: {
          from: 'storeToProduct.productId',
          to: 'storeToProduct.storeId',
        },
        to: 'store.id',
      },
    },

    vendor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Vendor',
      join: {
        from: 'product.vendorId',
        to: 'vendor.id',
      },
    },

    originAddress: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Address',
      join: {
        from: 'product.originAddressId',
        to: 'address.id',
      },
    },

    orders: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Order',
      join: {
        from: 'product.id',
        through: {
          from: 'orderItem.productId',
          to: 'orderItem.orderId',
        },
        to: 'order.id',
      },
    },

    orderItems: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'OrderItem',
      join: {
        from: 'product.id',
        to: 'orderItem.productId',
      },
    },

    categories: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Category',
      join: {
        from: 'product.id',
        through: {
          from: 'categoryToProduct.productId',
          to: 'categoryToProduct.categoryId',
        },
        to: 'category.id',
      },
    },
  }
}


// const ProductModel = sequelize.define('product', {
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

//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   price: {
//     type: DataTypes.DECIMAL(15, 4),
//     allowNull: false,
//   },

//   basePrice: {
//     type: DataTypes.DECIMAL(15, 4),
//     allowNull: false,
//   },

//   props: {
//     type: DataTypes.JSONB,
//     allowNull: false,
//   },

//   totalInStock: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },

//   originAddressId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: 'address',
//       key: 'id',
//     },
//   },

//   vendorId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: 'vendor',
//       key: 'id',
//     },
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


module.exports = Product
