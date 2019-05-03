// @flow

import path from 'path'
import express, { type $Request, type $Response } from 'express'
import apolloServer from './graphql/apolloServer'
import requireEnv from '@jcoreio/require-env'

const port = requireEnv('PORT')

const app = express()

const GRAPHQL_PATH = '/graphql'

apolloServer.applyMiddleware({
  app,
  path: GRAPHQL_PATH,
})

app.use(
  '/assets',
  express.static(path.resolve(__dirname, '..', '..', 'assets'))
)

// server-side rendering
app.get('*', (req: $Request, res: $Response) => {
  require('./ssr/serverSideRender').default(req, res)
})

// preload this instead of waiting for the first request
// (the require weirdness here is to enable server-side hot-reloading)
require('./ssr/serverSideRender')

app.listen(port)
console.log(`app is listening on port ${port}`) // eslint-disable-line no-console
