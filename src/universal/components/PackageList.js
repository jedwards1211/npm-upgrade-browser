/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import queryBoilerplate, { type DefinedRenderProps } from './queryBoilerplate'
import Typography from '@material-ui/core/Typography'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import type { QueryRenderProps } from 'react-apollo'
import Spinner from './Spinner'
import ErrorIcon from '@material-ui/icons/Error'
import Badge from '@material-ui/core/Badge'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { NavLink } from 'react-router-dom'

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

const PackageList = (props: Props): React.Node => (
  <Query query={query} errorPolicy="all">
    {queryBoilerplate(
      ({
        data: { installedPackages },
      }: DefinedRenderProps<QueryData>): React.Node => (
        <List>
          {installedPackages.map((pkg, key) => (
            <PackageListItem pkg={pkg} key={key} />
          ))}
        </List>
      ),
      { what: 'package list', variant: 'alerts' }
    )}
  </Query>
)

export default PackageList

// @graphql-to-flow extract-types: Release
const changelogQuery = gql`
  query changelog($package: String!) {
    changelog(package: $package) {
      id
      version
      header
      date
      body
      error
    }
  }
`

// @graphql-to-flow auto-generated
type Release = {
  id: string,
  version: string,
  header: string,
  date: any,
  body: ?string,
  error: ?string,
}

// @graphql-to-flow auto-generated
type ChangelogQueryData = { changelog: Array<Release> }

// @graphql-to-flow auto-generated
type ChangelogQueryVariables = { package: string }

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
  version: {
    marginLeft: theme.spacing.unit,
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
}: PackageListItemProps): React.Node => (
  <PackageListItemStyles>
    {({ classes }: { classes: Classes<typeof packagePanelStyles> }) => (
      <Query
        query={changelogQuery}
        variables={({ package: name }: ChangelogQueryVariables)}
        errorPolicy="all"
      >
        {({
          loading,
          error,
          data,
        }: QueryRenderProps<ChangelogQueryData>): React.Node => (
          <ListItem
            button
            component={NavLink}
            to={`/package/${name}`}
            activeClassName={classes.active}
          >
            <ListItemText className={classes.packageName}>{name}</ListItemText>
            {loading && <Spinner />}
            {error && <ErrorIcon />}
            <Typography variant="body1" className={classes.version}>
              {data && data.changelog && data.changelog.length ? (
                <Badge color="primary" badgeContent={data.changelog.length}>
                  {version}
                </Badge>
              ) : (
                version
              )}
            </Typography>
          </ListItem>
        )}
      </Query>
    )}
  </PackageListItemStyles>
)
