const pageSchema = {
  type: 'object',
  description: '',
  default: { pageIndex: 0, pageSize: 10 },
  example: { pageIndex: 0, pageSize: 10 },
  properties: {
    pageIndex: {
      type: 'integer',
      min: 0,
      max: 1_000_000,
      description: 'The index of the page to return. The index of the first page is 0.',
      default: 0,
    },
    pageSize: {
      type: 'integer',
      min: 1,
      max: 1_000_000,
      description: 'How many results we need to return per a single page.',
      default: 10,
    },
  },
} as const


export default pageSchema
