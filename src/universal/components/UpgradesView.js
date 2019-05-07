/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import gql from 'graphql-tag'
import { type DefinedRenderProps } from './queryBoilerplate'
import { Query, Mutation, type MutationResult } from 'react-apollo'
import queryBoilerplate from './queryBoilerplate'
import { map, groupBy, mapValues, sortBy } from 'lodash'
import { type State } from '../redux/types'
import { useSelector, useDispatch } from 'react-redux'
import semver from 'semver'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import Typography from '@material-ui/core/Typography'
import UpdateIcon from '@material-ui/icons/Update'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import {
  selectUpgrade,
  type SelectedUpgrades,
  clearSelectedUpgrades,
} from '../redux/selectedUpgrades'
import type { MutationFunction } from 'react-apollo'
import ErrorAlert from './ErrorAlert'
import LoadingAlert from './LoadingAlert'

import Button from '@material-ui/core/Button'

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'

// @graphql-to-flow extract-types: InstalledPackage
const query = gql`
  query UpgradesView {
    installedPackages {
      id
      name
      version
      isDev
    }
  }
`

// @graphql-to-flow auto-generated
type QueryData = { installedPackages: Array<InstalledPackage> }

// @graphql-to-flow auto-generated
type InstalledPackage = {
  id: string,
  name: string,
  version: string,
  isDev: boolean,
}

const upgradeMutation = gql`
  mutation upgrade($packages: [PackageUpgrade!]!) {
    upgradePackages(packages: $packages) {
      id
      name
      version
      isDev
    }
  }
`

// @graphql-to-flow auto-generated
type UpgradeMutationFunction = MutationFunction<
  UpgradeMutationData,
  UpgradeMutationVariables
>

// @graphql-to-flow auto-generated
type UpgradeMutationData = {
  upgradePackages: Array<{
    id: string,
    name: string,
    version: string,
    isDev: boolean,
  }>,
}

// @graphql-to-flow auto-generated
type UpgradeMutationVariables = {
  packages: Array<{
    name: string,
    version: string,
  }>,
}

export type Props = {}

const UpgradesViewContainer = (props: Props): React.Node => {
  const dispatch = useDispatch()
  const handleUpgradeCompleted = React.useCallback(() =>
    dispatch(clearSelectedUpgrades())
  )
  return (
    <Mutation mutation={upgradeMutation} onCompleted={handleUpgradeCompleted}>
      {(
        upgrade: UpgradeMutationFunction,
        result: MutationResult<UpgradeMutationData>
      ): React.Node => (
        <Query query={query} errorPolicy="all">
          {queryBoilerplate(
            ({ data }: DefinedRenderProps<QueryData>) => (
              <UpgradesView
                installedPackages={data.installedPackages}
                upgrade={upgrade}
                upgradeResult={result}
              />
            ),
            { what: 'Selected Upgrades' }
          )}
        </Query>
      )}
    </Mutation>
  )
}

export default UpgradesViewContainer

export type UpgradesViewProps = {
  installedPackages: Array<InstalledPackage>,
  upgrade: UpgradeMutationFunction,
  upgradeResult: MutationResult<UpgradeMutationData>,
}

const upgradesViewStyles = (theme: Theme) => ({
  root: {
    margin: '0 auto',
    maxWidth: 600,
  },
  status: {
    display: 'flex',
    alignItems: 'baseline',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
  },
  statusText: {
    flex: 1,
  },
})

const UpgradesViewStyles = createStyled(upgradesViewStyles, {
  name: 'UpgradesView',
})

const UpgradesView = ({
  installedPackages,
  upgrade,
  upgradeResult,
}: UpgradesViewProps): React.Node => {
  const selectedUpgrades: SelectedUpgrades = useSelector(
    (state: State) => state.selectedUpgrades
  )
  const packages = React.useMemo(
    () => map(selectedUpgrades, (version, name) => ({ name, version })),
    [selectedUpgrades]
  )
  const { prerelease, major, minor } = useSelector(
    React.useCallback(
      (state: State) => {
        const grouped = groupBy(
          installedPackages,
          (
            pkg: InstalledPackage
          ): 'prerelease' | 'major' | 'minor' | 'ignore' => {
            let selectedVersion = state.selectedUpgrades[pkg.name]
            if (selectedVersion && selectedVersion.startsWith('^')) {
              selectedVersion = selectedVersion.substring(1)
            }
            if (!selectedVersion) return 'ignore'
            if (semver.prerelease(selectedVersion)) return 'prerelease'
            if (!semver.satisfies(selectedVersion, `^${pkg.version}`))
              return 'major'
            return 'minor'
          }
        )
        return mapValues(grouped, packages => sortBy(packages, pkg => pkg.name))
      },
      [installedPackages]
    )
  )
  const hasAnyUpgrades = React.useMemo(
    () => Boolean(prerelease || major || minor),
    [prerelease, major, minor]
  )

  return (
    <UpgradesViewStyles>
      {({ classes }: { classes: Classes<typeof upgradesViewStyles> }) => (
        <div className={classes.root}>
          <div className={classes.status}>
            {!upgradeResult.loading && !upgradeResult.error && (
              <Typography variant="h6" className={classes.statusText}>
                {hasAnyUpgrades
                  ? 'You have selected the following upgrades:'
                  : 'No upgrades selected.'}
              </Typography>
            )}
            {upgradeResult.loading && (
              <LoadingAlert className={classes.statusText}>
                Applying upgrades...
              </LoadingAlert>
            )}
            {upgradeResult.error && (
              <ErrorAlert className={classes.statusText}>
                Failed to upgrade:{' '}
                {upgradeResult.error.message.replace(/graphql error:\s*/i, '')}
              </ErrorAlert>
            )}
            {hasAnyUpgrades && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  upgrade({
                    variables: ({ packages }: UpgradeMutationVariables),
                  })
                }
                disabled={upgradeResult.loading}
              >
                Apply Upgrades
              </Button>
            )}
          </div>
          {prerelease && (
            <UpgradeList title="Pre-release Upgrades" packages={prerelease} />
          )}
          {major && <UpgradeList title="Major Upgrades" packages={major} />}
          {minor && <UpgradeList title="Minor Upgrades" packages={minor} />}
        </div>
      )}
    </UpgradesViewStyles>
  )
}

export type UpgradeListProps = {
  title: React.Node,
  packages: Array<InstalledPackage>,
}

const upgradeListStyles = (theme: Theme) => ({
  title: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
})

const UpgradeListStyles = createStyled(upgradeListStyles, {
  name: 'UpgradeList',
})

const UpgradeList = ({ title, packages }: UpgradeListProps): React.Node => (
  <UpgradeListStyles>
    {({ classes }: { classes: Classes<typeof upgradeListStyles> }) => (
      <React.Fragment>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <List>
          {packages.map(pkg => (
            <PackageItem key={pkg.name} package={pkg} />
          ))}
        </List>
      </React.Fragment>
    )}
  </UpgradeListStyles>
)

export type PackageItemProps = {
  package: InstalledPackage,
}

const packageItemStyles = (theme: Theme) => ({
  packageName: {
    fontWeight: 'bold',
    flex: 1,
  },
  versions: {
    marginLeft: theme.spacing.unit,
    textAlign: 'right',
  },
  version: {},
  arrow: {
    verticalAlign: 'middle',
  },
  latestVersion: {},
  updateIcon: {
    verticalAlign: 'middle',
  },
  iconButton: {
    margin: -12,
    marginLeft: 8,
  },
})

const PackageItemStyles = createStyled(packageItemStyles, {
  name: 'PackageItem',
})

const PackageItem = ({
  package: { name, version },
}: PackageItemProps): React.Node => {
  const selectedVersion = useSelector(
    (state: State) => state.selectedUpgrades[name]
  )
  const dispatch = useDispatch()
  return (
    <PackageItemStyles>
      {({ classes }: { classes: Classes<typeof packageItemStyles> }) => (
        <ListItem button>
          <ListItemText className={classes.packageName}>{name}</ListItemText>
          <div className={classes.versions}>
            <Typography variant="body1" className={classes.version}>
              {version} <ArrowRightAltIcon className={classes.arrow} />{' '}
              {selectedVersion}
            </Typography>
          </div>
          <IconButton
            onClick={() => dispatch(selectUpgrade(name, null))}
            className={classes.iconButton}
          >
            <CloseIcon />
          </IconButton>
        </ListItem>
      )}
    </PackageItemStyles>
  )
}
