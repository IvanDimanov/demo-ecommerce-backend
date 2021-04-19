import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export const schema = {
  description: '`CategoryModel` is a list of descriptive tags that can be assigned to a product.',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Category ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      minLength: 0,
      maxLength: 320,
      description: 'Short UI description of the category',
      example: 'Phones',
    },
    description: {
      type: 'string',
      minLength: 0,
      maxLength: 320,
      description: 'Long UI description of the category',
      example: 'Category related to phones',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface CategoryModel extends FromSchema<typeof schema> {}

/**
 * Category Model
 */
class CategoryModel extends BaseModel {
  static tableName = 'category'

  static relationMappings = {
    products: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Product',
      join: {
        from: 'category.id',
        through: {
          from: 'categoryToProduct.categoryId',
          to: 'categoryToProduct.productId',
        },
        to: 'product.id',
      },
    },
  }
}


export default CategoryModel
