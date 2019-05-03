#!/usr/bin/env node
// @flow

import path from 'path'
import express, { type $Request, type $Response } from 'express'
import apolloServer from './graphql/apolloServer'
import portscanner from 'portscanner'
import open from 'open'
import { promisify } from 'util'

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

async function start(): Promise<void> {
  const port =
    parseInt(process.env.PORT) ||
    (await promisify(cb =>
      portscanner.findAPortNotInUse(3000, 4000, '127.0.0.1', cb)
    )())
  app.listen(port)
  console.log(`what-broke-ui is running on port ${port}`) // eslint-disable-line no-console

  if (process.env.NODE_ENV !== 'development') open(`http://localhost:${port}`)
}

start().catch((error: Error) => {
  console.error(error.stack) // eslint-disable-line no-console
  process.exit(1)
})
