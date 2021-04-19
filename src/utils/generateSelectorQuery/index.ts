import JSON5 from 'json5'
import { QueryBuilder } from 'objection'

import BaseModel from 'database/models/Base'
import getSelectClause from './getSelectClause'


export enum JoinOperationEnum {
  join = 'join',
  innerJoin = 'innerJoin',
  leftJoin = 'leftJoin',
  leftOuterJoin = 'leftOuterJoin',
  rightJoin = 'rightJoin',
  rightOuterJoin = 'rightOuterJoin',
  fullOuterJoin = 'fullOuterJoin',
  crossJoin = 'crossJoin',
}

type WhereClause = {
  column: string
  operation: string
  value: unknown
}

type WhereNotClause = {
  column: string
  operation: string
  value: unknown
}

type WhereInClause = {
  column: string
  value: unknown
}

type WhereNotInClause = {
  column: string
  value: unknown
}

type WhereBetweenClause = {
  column: string
  value: unknown[]
}

type WhereNotBetweenClause = {
  column: string
  value: unknown[]
}

type WhereRules = {
  where?: WhereClause[]
  whereNot?: WhereNotClause[]
  whereIn?: WhereInClause[]
  whereNotIn?: WhereNotInClause[]
  whereBetween?: WhereBetweenClause[]
  whereNotBetween?: WhereNotBetweenClause[]
}

type OrderBy = {
  column: string
  order?: 'asc' | 'desc'
}


const betweenBracketsRegExp = new RegExp(/(?<=\()(.*?)(?=\))/g)


const generateSelectorQuery = (
  model: typeof BaseModel,
  selector = '',
  joinOperation = JoinOperationEnum.innerJoin,
  whereRules: WhereRules = {},
  orderBy: OrderBy[] = [],
): QueryBuilder<BaseModel, BaseModel[]> => {
  selector = selector.replace(/\n/g, '')

  const startBracketIndex = selector.indexOf('[')
  const endBracketIndex = selector.lastIndexOf(']') + 1

  let modelsSelector = selector.substring(startBracketIndex, endBracketIndex)
  const selectClauseSelector = selector.replace(modelsSelector, '')
  const selectClause = getSelectClause(selectClauseSelector, model.tableName)


  const matches = modelsSelector.match(betweenBracketsRegExp)
  const modifiers = {}

  if (matches) {
    matches.forEach((match) => {
      let clauses = {}

      try {
        clauses = JSON5.parse(match)
      } catch (error) {
        throw new TypeError(`Invalid model clause: ${match} ${error.message}`)
      }

      const modifierName = `modifier${Object.keys(modifiers).length}`
      modifiers[modifierName] = (builder) => {
        builder
          // @ts-ignore
          .select(getSelectClause(clauses.select))

        // @ts-ignore
        if (Array.isArray(clauses.where)) {
          // @ts-ignore
          clauses.where.forEach((where: WhereClause) => {
            builder.where(where.column, where.operation, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.whereNot)) {
          // @ts-ignore
          clauses.whereNot.forEach((where: WhereNotClause) => {
            builder.whereNot(where.column, where.operation, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.whereIn)) {
          // @ts-ignore
          clauses.whereIn.forEach((where: WhereInClause) => {
            builder.whereIn(where.column, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.whereNotIn)) {
          // @ts-ignore
          clauses.whereNotIn.forEach((where: WhereNotInClause) => {
            builder.whereNotIn(where.column, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.whereBetween)) {
          // @ts-ignore
          clauses.whereBetween.forEach((where: WhereBetweenClause) => {
            builder.whereBetween(where.column, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.whereNotBetween)) {
          // @ts-ignore
          clauses.whereNotBetween.forEach((where: WhereNotBetweenClause) => {
            builder.whereNotBetween(where.column, where.value)
          })
        }

        // @ts-ignore
        if (Array.isArray(clauses.orderBy)) {
          // @ts-ignore
          builder.orderBy(clauses.orderBy)
        }
      }

      modelsSelector = modelsSelector.replace(match, modifierName)
    })
  }


  const query = model
    .query()
    .select(selectClause)


  if (modelsSelector) {
    query.withGraphJoined(
      modelsSelector.replace(/\[/g, '.[').substr(1),
      { joinOperation },
    )
  }

  if (Object.keys(modifiers).length) {
    query.modifiers(modifiers)
  }


  if (whereRules) {
    if (Array.isArray(whereRules.where)) {
      whereRules.where.forEach((where: WhereClause) => {
        // @ts-ignore
        query.where(where.column, where.operation, where.value)
      })
    }

    if (Array.isArray(whereRules.whereNot)) {
      whereRules.whereNot.forEach((where: WhereNotClause) => {
        // @ts-ignore
        query.whereNot(where.column, where.operation, where.value)
      })
    }

    if (Array.isArray(whereRules.whereIn)) {
      whereRules.whereIn.forEach((where: WhereInClause) => {
        // @ts-ignore
        query.whereIn(where.column, where.value)
      })
    }

    if (Array.isArray(whereRules.whereNotIn)) {
      whereRules.whereNotIn.forEach((where: WhereNotInClause) => {
        // @ts-ignore
        query.whereNotIn(where.column, where.value)
      })
    }

    if (Array.isArray(whereRules.whereBetween)) {
      whereRules.whereBetween.forEach((where: WhereBetweenClause) => {
        // @ts-ignore
        query.whereBetween(where.column, where.value)
      })
    }

    if (Array.isArray(whereRules.whereNotBetween)) {
      whereRules.whereNotBetween.forEach((where: WhereNotBetweenClause) => {
        // @ts-ignore
        query.whereNotBetween(where.column, where.value)
      })
    }
  }


  if (orderBy) {
    query.orderBy(orderBy)
  }

  return query
}


export default generateSelectorQuery
