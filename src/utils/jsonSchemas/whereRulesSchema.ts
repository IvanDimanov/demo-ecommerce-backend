const whereRulesSchema = {
  type: 'object',
  description: '',
  properties: {
    where: {
      type: 'array',
      description: 'An array of `where` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `where` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          operation: {
            type: 'string',
            description: 'What kind of filtering we want: =, >, <, like, etc.',
            example: '=',
          },
          value: {
            type: ['string', 'number'],
            description: 'What is the value we use for filtering',
            example: 20,
          },
        },
        required: ['column', 'operation', 'value'],
      },
    },
    whereNot: {
      type: 'array',
      description: 'An array of `whereNot` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `whereNot` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          operation: {
            type: 'string',
            description: 'What kind of filtering we want: =, >, <, like, etc.',
            example: '=',
          },
          value: {
            type: ['string', 'number'],
            description: 'What is the value we use for filtering',
            example: 20,
          },
        },
        required: ['column', 'operation', 'value'],
      },
    },
    whereIn: {
      type: 'array',
      description: 'An array of `whereIn` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `whereIn` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          value: {
            type: 'array',
            description: 'What are the values we use for filtering',
            example: [1, 2, 3],
            items: {
              type: ['string', 'number'],
            },
          },
        },
        required: ['column', 'value'],
      },
    },
    whereNotIn: {
      type: 'array',
      description: 'An array of `whereNotIn` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `whereNotIn` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          value: {
            type: 'array',
            description: 'What are the values we use for filtering',
            example: [1, 2, 3],
            items: {
              type: ['string', 'number'],
            },
          },
        },
        required: ['column', 'value'],
      },
    },
    whereBetween: {
      type: 'array',
      description: 'An array of `whereBetween` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `whereBetween` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          value: {
            type: 'array',
            description: 'What are the values we use for range filtering',
            example: [1, 2],
            items: {
              type: ['string', 'number'],
            },
          },
        },
        required: ['column', 'value'],
      },
    },
    whereNotBetween: {
      type: 'array',
      description: 'An array of `whereNotBetween` clauses we want to use for filtering',
      items: {
        type: 'object',
        description: 'Single `whereNotBetween` clause',
        properties: {
          column: {
            type: 'string',
            description: 'DB column name we want to use for filtering',
            example: 'price',
          },
          value: {
            type: 'array',
            description: 'What are the values we use for range filtering',
            example: [1, 2],
            items: {
              type: ['string', 'number'],
            },
          },
        },
        required: ['column', 'value'],
      },
    },
  },
} as const


export default whereRulesSchema
