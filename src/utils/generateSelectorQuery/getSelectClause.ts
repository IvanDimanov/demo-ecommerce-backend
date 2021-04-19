const getSelectClause = (selector = '', prefix = ''): string[] => `id, ${selector}`
  .split(',')
  .map((key) => key.replace('\n', ''))
  .map((key) => key.trim())
  .filter(Boolean)
  .filter((key, index, keys) => keys.indexOf(key) === index)
  .map((key) => prefix ? `${prefix}.${key}` : key)

export default getSelectClause
