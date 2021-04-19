const orderBySchema = {
  type: 'array',
  description: `We may want to order the list of results by a specific column.
    This prop is an array of all requested orders.`,
  example: [{ column: 'price', order: 'desc' }],
  items: {
    type: 'object',
    description: 'Single results order request',
    properties: {
      column: {
        type: 'string',
        description: 'DB column name we want to sort order to',
        example: 'price',
      },
      order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sorting order direction',
        default: 'asc',
      },
    },
    required: ['column'],
  },
} as const


export default orderBySchema
