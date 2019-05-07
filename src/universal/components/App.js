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
import Navbar from './Navbar'

import UpgradesView from './UpgradesView'

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
    flex: '0 0 320px',
    position: 'relative',
    backgroundColor: theme.palette.grey[100],
    zIndex: theme.zIndex.drawer,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  body: {
    position: 'relative',
    padding: theme.spacing.unit * 3,
    flex: 1,
    overflowY: 'auto',
  },
})

const AppStyles = createStyled<Theme, typeof appStyles>(appStyles, {
  name: 'App',
})

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
          <Navbar />
          <div className={classes.body}>
            <Switch>
              <Route path="/upgrades" component={UpgradesView} />
              <Route
                path="/package/*"
                render={({
                  match: {
                    // $FlowFixMe
                    params: { [0]: pkg },
                  },
                }) =>
                  pkg ? (
                    <PackageDetails key={pkg} pkg={pkg} />
                  ) : (
                    <React.Fragment />
                  )
                }
              />
            </Switch>
          </div>
        </div>
      </div>
    )}
  </AppStyles>
)

export default App
