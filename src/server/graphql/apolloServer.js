/**
 * @flow
 * @prettier
 */

import schema from './schema'
import { ApolloServer } from 'apollo-server-express'
import { type GraphQLContext } from './GraphQLContext'

export default new ApolloServer({
  schema,
  context: ({
    projectDir: process.argv[2] || process.cwd(),
  }: GraphQLContext),
})
