/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import queryBoilerplate, { type DefinedRenderProps } from './queryBoilerplate'
import Markdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import ErrorAlert from './ErrorAlert'
import SuccessAlert from './SuccessAlert'

// @graphql-to-flow extract-types: Release
const query = gql`
  query PackageDetails($package: String!) {
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
type QueryData = { changelog: Array<Release> }

// @graphql-to-flow auto-generated
type QueryVariables = { package: string }

// @graphql-to-flow auto-generated
type Release = {
  id: string,
  version: string,
  header: string,
  date: any,
  body: ?string,
  error: ?string,
}

export type Props = {
  pkg: string,
}

const packageDetailsStyles = (theme: Theme) => ({
  packageName: {
    marginBottom: theme.spacing.unit * 4,
  },
})

const PackageDetailsStyles = createStyled(packageDetailsStyles, {
  name: 'PackageDetails',
})

const PackageDetails = ({ pkg }: Props): React.Node => (
  <PackageDetailsStyles>
    {({ classes }: { classes: Classes<typeof packageDetailsStyles> }) => (
      <Query
        fetchPolicy="cache-first"
        query={query}
        variables={
          ({
            package: pkg,
          }: QueryVariables)
        }
        errorPolicy="all"
      >
        {queryBoilerplate(
          ({
            data: { changelog },
          }: DefinedRenderProps<QueryData>): React.Node => (
            <React.Fragment>
              <Typography variant="h2" className={classes.packageName}>
                {pkg}
              </Typography>
              {changelog &&
                changelog.map(
                  ({ id, version, header, body, error }: Release) => (
                    <div key={id}>
                      <Markdown source={`${header}\n\n${body || ''}`} />
                      {error && <ErrorAlert>{error}</ErrorAlert>}
                    </div>
                  )
                )}
              {changelog && !changelog.length && (
                <SuccessAlert>Up to date!</SuccessAlert>
              )}
            </React.Fragment>
          ),
          { what: 'package details' }
        )}
      </Query>
    )}
  </PackageDetailsStyles>
)

export default PackageDetails
