import { JoinOperationEnum } from 'utils/generateSelectorQuery'

const JoinOperationEnumKeys = Object.keys(JoinOperationEnum)
  .filter((key) => Number.isNaN(Number(key)))


const joinOperationSchema = {
  type: 'string',
  enum: JoinOperationEnumKeys,
  description: 'When joining multiple DB model, we can choose if we want to have `null` values or not',
  example: JoinOperationEnumKeys[1],
  default: JoinOperationEnumKeys[1],
} as const


export default joinOperationSchema
