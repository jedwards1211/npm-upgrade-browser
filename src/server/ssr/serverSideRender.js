// @flow

import * as React from 'react'
import fs from 'fs'
import path from 'path'
import type { $Request, $Response } from 'express'
import { renderToString } from 'react-dom/server'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getDataFromTree } from 'react-apollo'
import { SchemaLink } from 'apollo-link-schema'
import schema from '../graphql/schema'
import Html from './Html'
import dataIdFromObject from '../../universal/apollo/dataIdFromObject'
import { type Store } from '../../universal/redux/types'
import makeStore from './makeStore'

const rootDir = path.resolve(__dirname, '..', '..')

let assets

const serverSideRender = async (req: $Request, res: $Response) => {
  try {
    if (process.env.NODE_ENV === 'production' && !assets) {
      assets = JSON.parse(
        fs.readFileSync(path.join(rootDir, 'assets.json'), 'utf8')
      )
    }

    const headers: Object = {}
    const cookie = req.header('Cookie')
    if (cookie) headers.cookie = cookie

    const apolloClient = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({ schema }),
      cache: new InMemoryCache({ dataIdFromObject }),
    })

    const store: Store = makeStore()

    const routerContext = {}

    const app = (
      <Html
        title="what-broke-ui"
        assets={assets}
        apolloClient={apolloClient}
        location={req.url}
        store={store}
        routerContext={routerContext}
        disableStylesGeneration
      />
    )

    await getDataFromTree(app)

    const html = renderToString(
      React.cloneElement(app, {
        disableStylesGeneration: false,
        extractApolloState: true,
      })
    )

    res.status(200)
    res.write('<!DOCTYPE html>\n')
    res.write(html)
    res.end()
  } catch (error) {
    console.error(error.stack) // eslint-disable-line no-console
    res.status(500).send(`<pre>${error.stack}</pre>`)
  }
}

export default serverSideRender
