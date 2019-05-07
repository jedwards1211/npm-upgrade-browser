/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import gql from 'graphql-tag'
import { Query, ApolloConsumer } from 'react-apollo'
import queryBoilerplate, { type DefinedRenderProps } from './queryBoilerplate'
import Typography from '@material-ui/core/Typography'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import Spinner from './Spinner'
import ErrorIcon from '@material-ui/icons/Error'
import Badge from '@material-ui/core/Badge'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { setFilters } from '../redux/filters'
import ChangelogQuery, { type ChangelogChildrenData } from './ChangelogQuery'
import UpdateIcon from '@material-ui/icons/Update'

import { type State } from '../redux/types'

// @graphql-to-flow extract-types: InstalledPackage
const query = gql`
  query PackageList {
    installedPackages {
      id
      name
      version
      isDev
    }
  }
`

// @graphql-to-flow auto-generated
type InstalledPackage = {
  id: string,
  name: string,
  version: string,
  isDev: boolean,
}

// @graphql-to-flow auto-generated
type QueryData = { installedPackages: Array<InstalledPackage> }

export type Props = {}

const packageListStyles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filters: {
    padding: theme.spacing.unit,
    flex: '0 0 auto',
    '& > :not(:first-child)': {
      marginLeft: theme.spacing.unit,
    },
  },
  list: {
    flex: 1,
    overflowY: 'auto',
  },
})

const PackageListStyles = createStyled(packageListStyles, {
  name: 'PackageList',
})

const PackageList = (props: Props): React.Node => (
  <PackageListStyles>
    {({ classes }: { classes: Classes<typeof packageListStyles> }) => (
      <ApolloConsumer>
        {(client): React.Node => (
          <Query query={query} errorPolicy="all">
            {queryBoilerplate(
              ({
                data: { installedPackages },
              }: DefinedRenderProps<QueryData>): React.Node => (
                <div className={classes.root}>
                  <div className={classes.filters}>
                    <FilterButtons />
                  </div>
                  <List className={classes.list}>
                    {installedPackages.map((pkg, key) => (
                      <PackageListItem pkg={pkg} key={key} />
                    ))}
                  </List>
                </div>
              ),
              { what: 'package list', variant: 'alerts' }
            )}
          </Query>
        )}
      </ApolloConsumer>
    )}
  </PackageListStyles>
)

export default PackageList

export type PackageListItemProps = { pkg: InstalledPackage }

const packagePanelStyles = (theme: Theme) => ({
  heading: {
    display: 'flex',
    flex: 1,
  },
  packageName: {
    fontWeight: 'bold',
    flex: 1,
  },
  versions: {
    marginLeft: theme.spacing.unit,
    textAlign: 'right',
  },
  version: {},
  latestVersion: {},
  updateIcon: {
    verticalAlign: 'middle',
  },
  details: {
    display: 'block',
  },
  active: {
    backgroundColor: theme.palette.grey[200],
  },
})

const PackageListItemStyles = createStyled(packagePanelStyles, {
  name: 'PackageListItem',
})

const PackageListItem = ({
  pkg: { name, version },
}: PackageListItemProps): React.Node => {
  const selectedVersion = useSelector(
    (state: State) => state.selectedUpgrades[name]
  )
  const showAll = useSelector((state: State) => state.filters.all)
  return (
    <PackageListItemStyles>
      {({ classes }: { classes: Classes<typeof packagePanelStyles> }) => (
        <ChangelogQuery package={name}>
          {({
            loading,
            error,
            changelog,
          }: ChangelogChildrenData): React.Node => {
            if (
              !loading &&
              !error &&
              changelog &&
              !changelog.length &&
              !showAll
            ) {
              return <React.Fragment />
            }
            return (
              <ListItem
                button
                component={NavLink}
                to={`/package/${name}`}
                activeClassName={classes.active}
              >
                <ListItemText className={classes.packageName}>
                  {name}
                </ListItemText>
                {loading && <Spinner />}
                {error && <ErrorIcon />}
                <div className={classes.versions}>
                  <Typography variant="body1" className={classes.version}>
                    {version}
                  </Typography>
                  <Typography variant="body1" className={classes.latestVersion}>
                    {(selectedVersion ||
                      (changelog && changelog.length > 0)) && (
                      <React.Fragment>
                        {selectedVersion && (
                          <UpdateIcon className={classes.updateIcon} />
                        )}
                        {changelog ? (
                          <Badge
                            color="primary"
                            badgeContent={changelog.length}
                          >
                            {selectedVersion
                              ? selectedVersion
                              : changelog[changelog.length - 1].version}
                          </Badge>
                        ) : (
                          selectedVersion
                        )}
                      </React.Fragment>
                    )}
                  </Typography>
                </div>
              </ListItem>
            )
          }}
        </ChangelogQuery>
      )}
    </PackageListItemStyles>
  )
}

export type FilterButtonsProps = {}

const FilterButtons = (props: FilterButtonsProps): React.Node => {
  const filters = useSelector(state => state.filters)
  const dispatch = useDispatch()

  return (
    <React.Fragment>
      {Object.keys(filters).map(key => (
        <Button
          key={key}
          color={filters[key] ? 'primary' : 'default'}
          variant={filters[key] ? 'contained' : 'text'}
          onClick={() => dispatch(setFilters({ [key]: !filters[key] }))}
        >
          {key}
        </Button>
      ))}
    </React.Fragment>
  )
}
