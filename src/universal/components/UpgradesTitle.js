/**
 * @flow
 * @prettier
 */

import * as React from 'react'

import Typography from '@material-ui/core/Typography'

import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'

export type Props = {}

const upgradesTitleStyles = (theme: Theme) => ({
  root: {
    flex: 1,
  },
})

const UpgradesTitleStyles = createStyled(upgradesTitleStyles, {
  name: 'UpgradesTitle',
})

const UpgradesTitle = (props: Props): React.Node => (
  <UpgradesTitleStyles>
    {({ classes }: { classes: Classes<typeof upgradesTitleStyles> }) => (
      <Typography
        component="h1"
        variant="h4"
        align="center"
        className={classes.root}
      >
        Apply Upgrades
      </Typography>
    )}
  </UpgradesTitleStyles>
)

export default UpgradesTitle
