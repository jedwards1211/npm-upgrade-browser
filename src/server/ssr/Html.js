/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { SheetsRegistry, JssProvider } from 'react-jss'
import type { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import App from '../../universal/components/App'
import createJss from '../../universal/jss/createJss'
import theme from '../../universal/theme'
const jss = createJss()

const postcssInstance = postcss([autoprefixer()])

type Props = {
  title: string,
  assets?: Object,
  apolloClient: ApolloClient<any>,
  extractApolloState?: boolean,
  location: string,
  routerContext: Object,
  disableStylesGeneration?: ?boolean,
}

const staticCss = `
body {
  font-family: Roboto;
  margin: 0;
}
`

const Html = ({
  location,
  routerContext,
  title,
  assets,
  apolloClient,
  extractApolloState,
  disableStylesGeneration,
}: Props): React.Element<any> => {
  const { manifest, app, vendor } = assets || {}
  const sheets = new SheetsRegistry()
  const root = renderToString(
    <JssProvider registry={sheets} jss={jss}>
      <MuiThemeProvider
        theme={theme}
        sheetsManager={new Map()}
        disableStylesGeneration={disableStylesGeneration}
      >
        <ApolloProvider client={apolloClient}>
          <StaticRouter context={routerContext} location={location}>
            <App />
          </StaticRouter>
        </ApolloProvider>
      </MuiThemeProvider>
    </JssProvider>
  )

  const apolloState = extractApolloState
    ? `window.__APOLLO_STATE__=${JSON.stringify(apolloClient.extract()).replace(
        /</g,
        '\\u003c'
      )}`
    : null

  return (
    <html className="default">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          rel="stylesheet"
        />
        {vendor && vendor.css && (
          <link rel="stylesheet" type="text/css" href={vendor.css} />
        )}
        <style type="text/css">{staticCss}</style>
        <style
          type="text/css"
          id="server-side-styles"
          dangerouslySetInnerHTML={{
            __html: postcssInstance.process(sheets.toString()),
          }}
        />
      </head>
      <body>
        {apolloState && (
          <script dangerouslySetInnerHTML={{ __html: apolloState }} />
        )}
        <div id="root" dangerouslySetInnerHTML={{ __html: root }} />
        {manifest && <script src={manifest.js} />}
        {vendor && <script src={vendor.js} />}
        <script src={app ? app.js : '/assets/app.js'} />
      </body>
    </html>
  )
}

export default Html
