/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import type { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import App from '../universal/components/App'
import { JssProvider } from 'react-jss'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createJss from '../universal/jss/createJss'
import theme from '../universal/theme'
import StandardErrorBoundary from '../universal/components/StandardErrorBoundary'

const jss = createJss()

type Props = {
  client: ApolloClient<any>,
}

const Root = ({ client }: Props) => (
  <StandardErrorBoundary>
    <JssProvider jss={jss}>
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <Router>
            <App />
          </Router>
        </ApolloProvider>
      </MuiThemeProvider>
    </JssProvider>
  </StandardErrorBoundary>
)

export default Root
