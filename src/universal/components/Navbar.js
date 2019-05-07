/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import PackageTitle from './PackageTitle'
import { Route, Switch } from 'react-router-dom'
import selectNumUpgrades from '../selectors/selectNumUpgrades'
import { useSelector } from 'react-redux'
import UpgradesLinkButton from './UpgradesLinkButton'
import UpgradesTitle from './UpgradesTitle'

export type Props = {}

const navbarStyles = (theme: Theme) => ({
  root: {
    flex: '0 0 64px',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const NavbarStyles = createStyled(navbarStyles, { name: 'Navbar' })

const Navbar = (props: Props): React.Node => {
  const numUpgrades = useSelector(selectNumUpgrades)
  return (
    <NavbarStyles>
      {({ classes }: { classes: Classes<typeof navbarStyles> }) => (
        <AppBar className={classes.root} position="relative" color="default">
          <Toolbar className={classes.toolbar}>
            <Switch>
              <Route path="/upgrades" component={UpgradesTitle} />
              <Route
                path="/package/*"
                render={({
                  match: {
                    // $FlowFixMe
                    params: { [0]: pkg },
                  },
                }) =>
                  pkg ? (
                    <PackageTitle key={pkg} package={pkg} />
                  ) : (
                    <React.Fragment />
                  )
                }
              />
            </Switch>
            <Route path="/upgrades">
              {({ match }) =>
                !match && numUpgrades > 0 && <UpgradesLinkButton />
              }
            </Route>
          </Toolbar>
        </AppBar>
      )}
    </NavbarStyles>
  )
}

export default Navbar
