/**
 * @flow
 * @prettier
 */

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import dataIdFromObject from '../../universal/apollo/dataIdFromObject'

// Create an http link:
const httpLink = new HttpLink({
  // $FlowFixMe
  uri: `${window.location.origin}/graphql`,
})

const cacheOptions = { dataIdFromObject }
const cache = new InMemoryCache(cacheOptions).restore(window.__APOLLO_STATE__)

export default new ApolloClient({
  link: httpLink,
  cache,
})
