/**
 * @flow
 * @prettier
 */

import schema from './schema'
import { ApolloServer } from 'apollo-server-express'
import { type GraphQLContext } from './GraphQLContext'
import projectDir from '../projectDir'

export default new ApolloServer({
  schema,
  context: ({
    projectDir,
  }: GraphQLContext),
})
