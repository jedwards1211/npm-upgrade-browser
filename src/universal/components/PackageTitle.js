/**
 * @flow
 * @prettier
 */

import * as React from 'react'

import Typography from '@material-ui/core/Typography'

import { useSelector, useDispatch } from 'react-redux'

import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'

import UpdateIcon from '@material-ui/icons/Update'

import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { selectUpgrade } from '../redux/selectedUpgrades'

export type Props = {
  package: string,
}

const packageTitleStyles = (theme: Theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'baseline',
  },
  selectedVersion: {
    marginLeft: theme.spacing.unit * 3,
  },
  updateIcon: {
    verticalAlign: 'middle',
  },
})

const PackageTitleStyles = createStyled(packageTitleStyles, {
  name: 'PackageTitle',
})

const PackageTitle = ({ package: pkg }: Props): React.Node => {
  const selectedVersion = useSelector(state => state.selectedUpgrades[pkg])
  const dispatch = useDispatch()
  return (
    <PackageTitleStyles>
      {({ classes }: { classes: Classes<typeof packageTitleStyles> }) => (
        <div className={classes.root}>
          <Typography component="h1" variant="h4">
            {pkg}
          </Typography>
          {selectedVersion && (
            <Typography
              variant="h5"
              color="primary"
              className={classes.selectedVersion}
            >
              <UpdateIcon className={classes.updateIcon} /> Selected upgrade:{' '}
              {selectedVersion}
              <IconButton onClick={() => dispatch(selectUpgrade(pkg, null))}>
                <CloseIcon />
              </IconButton>
            </Typography>
          )}
        </div>
      )}
    </PackageTitleStyles>
  )
}

export default PackageTitle
