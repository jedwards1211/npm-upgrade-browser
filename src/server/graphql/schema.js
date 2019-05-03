// @flow

import * as graphql from 'graphql'
import requireGlob from 'require-glob'
import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'
import fs from 'fs'

const defs = (Object.values(requireGlob.sync('./defs/*.js')): any)
const typeDefs = defs.map(def => def.typeDefs).filter(val => val != null)
const resolvers = merge(
  {},
  ...defs.map(def => def.resolvers).filter(val => val != null)
)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
if (process.env.NODE_ENV === 'development') {
  fs.writeFile(
    'schema.graphql',
    graphql.printSchema(schema),
    'utf8',
    (err: ?Error) => {
      if (err) {
        console.error(err.stack) // eslint-disable-line no-console
      } else {
        console.log('wrote schema.graphql') // eslint-disable-line no-console
      }
    }
  )
}
export default schema
