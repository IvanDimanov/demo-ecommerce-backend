import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'


export const schema = {
  description: `\`OrderItemModel\` represents one thing that the Customer wants to buy.
    All order items are grouped within the \`OrderModel\` so we can give all items
    the same shipping details or group/coupon discount.`,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Order Item ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    orderId: {
      type: 'string',
      format: 'uuid',
      description: 'Reference to the `OrderModel`',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    productId: {
      type: 'string',
      format: 'uuid',
      description: 'Reference to the `ProductModel`',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    props: {
      type: 'object',
      description: 'JSON list of selected product specific props, such as color, size, volume, km/h, etc.',
      example: { color: 'Red' },
    },
    quantity: {
      type: 'integer',
      min: 0,
      max: 1_000_000,
      description: 'How many of the selected product a buyer wants to buy',
      example: 7,
    },
    price: {
      type: 'number',
      min: 0,
      max: 1_000_000,
      description: 'The price Buyer pays when buys the product',
      example: 199,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that order item was created',
      example: '2020-04-30T00:00:00.000Z',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that order item was marked as deleted',
      example: '2021-04-30T00:00:00.000Z',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface OrderItemModel extends FromSchema<typeof schema> {}

/**
 * Order Model
 */
class OrderItemModel extends BaseModel {
  static tableName = 'orderItem'

  static relationMappings = {
    order: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Order',
      join: {
        from: 'orderItem.orderId',
        to: 'order.id',
      },
    },

    product: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Product',
      join: {
        from: 'orderItem.productId',
        to: 'product.id',
      },
    },
  }

  /**
   * Enable the soft-delete for this model.
   * More info:
   *   https://github.com/ackerdev/objection-softdelete#enable-soft-delete-for-a-model
   */
  static get softDelete(): true {
    return true
  }
}


export default OrderItemModel
