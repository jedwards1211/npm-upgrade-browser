/**
 * @flow
 * @prettier
 */

import schema from './schema'
import { ApolloServer } from 'apollo-server-express'

export default new ApolloServer({ schema })
