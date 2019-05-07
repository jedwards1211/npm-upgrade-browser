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
import gql from 'graphql-tag'
import type { QueryRenderProps } from 'react-apollo'
import { Query } from 'react-apollo'
import HomeIcon from '@material-ui/icons/Home'

const query = gql`
  query PackageTitle($package: String!) {
    installedPackage(package: $package) {
      id
      name
      homepage
    }
  }
`

// @graphql-to-flow auto-generated
type QueryData = {
  installedPackage: {
    id: string,
    name: string,
    homepage: ?string,
  },
}

// @graphql-to-flow auto-generated
type QueryVariables = { package: string }

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
        <Query query={query} variables={({ package: pkg }: QueryVariables)}>
          {({ data }: QueryRenderProps<QueryData>): React.Node => (
            <div className={classes.root}>
              <Typography component="h1" variant="h4">
                {pkg}{' '}
                {data &&
                  data.installedPackage &&
                  data.installedPackage.homepage && (
                    <IconButton
                      component="a"
                      href={data.installedPackage.homepage}
                    >
                      <HomeIcon />
                    </IconButton>
                  )}
              </Typography>
              {selectedVersion && (
                <Typography
                  variant="h5"
                  color="primary"
                  className={classes.selectedVersion}
                >
                  <UpdateIcon className={classes.updateIcon} /> Selected
                  upgrade: {selectedVersion}
                  <IconButton
                    onClick={() => dispatch(selectUpgrade(pkg, null))}
                  >
                    <CloseIcon />
                  </IconButton>
                </Typography>
              )}
            </div>
          )}
        </Query>
      )}
    </PackageTitleStyles>
  )
}

export default PackageTitle
