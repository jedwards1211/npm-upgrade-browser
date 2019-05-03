/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import PackageList from './PackageList'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import Paper from '@material-ui/core/Paper'
import { Switch, Route } from 'react-router-dom'

import PackageDetails from './PackageDetails'

export type Props = {}

const appStyles = (theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'stretch',
  },
  sidebar: {
    borderRadius: 0,
    flex: '0 0 256px',
    overflowY: 'auto',
  },
  content: {
    padding: theme.spacing.unit * 3,
    flex: 1,
    overflowY: 'auto',
  },
})

const AppStyles = createStyled(appStyles, { name: 'App' })

export function parseStringParam(raw: ?string, param: string): string {
  if (!raw || !raw.trim()) {
    throw new Error(`missing ${param} parameter`)
  }
  return decodeURIComponent(raw)
}

const App = (props: Props): React.Node => (
  <AppStyles>
    {({ classes }: { classes: Classes<typeof appStyles> }) => (
      <div className={classes.root}>
        <Paper className={classes.sidebar}>
          <PackageList />
        </Paper>
        <div className={classes.content}>
          <Switch>
            <Route
              path="/package/*"
              render={({
                match: {
                  params: { [0]: pkg },
                },
              }) => <PackageDetails pkg={pkg} />}
            />
          </Switch>
        </div>
      </div>
    )}
  </AppStyles>
)

export default App
