const totalResultsSchema = {
  type: 'integer',
  description: 'How many results match the requested `where` and `page` rules',
  example: 1,
} as const


export default totalResultsSchema
