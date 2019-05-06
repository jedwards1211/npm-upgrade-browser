/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import gql from 'graphql-tag'
import type { QueryRenderProps } from 'react-apollo'
import { Query, ApolloError } from 'react-apollo'

import { releaseFilter } from '../redux/filters'
import { useSelector } from 'react-redux'

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
type ChangelogQueryData = { changelog: Array<Release> }

// @graphql-to-flow auto-generated
type Release = {
  id: string,
  version: string,
  header: string,
  date: any,
  body: ?string,
  error: ?string,
}

export type ChangelogChildrenData = {
  loading: boolean,
  error: ?ApolloError,
  changelog: ?Array<Release>,
}

type Children = ChangelogChildrenData => React.Node

// @graphql-to-flow auto-generated
type ChangelogQueryVariables = { package: string }

export type Props = {
  package: string,
  children: Children,
}

const ChangelogQuery = ({ package: pkg, children }: Props): React.Node => (
  <Query
    query={changelogQuery}
    variables={({ package: pkg }: ChangelogQueryVariables)}
    errorPolicy="all"
  >
    {(result: QueryRenderProps<ChangelogQueryData>): React.Node => (
      <QueryHandler result={result}>{children}</QueryHandler>
    )}
  </Query>
)

export default ChangelogQuery

export type QueryHandlerProps = {
  result: QueryRenderProps<ChangelogQueryData>,
  children: Children,
}

const QueryHandler = ({
  result: { loading, error, data },
  children,
}: QueryHandlerProps): React.Node => {
  const filter = useSelector(state => releaseFilter(state.filters))
  const changelog = React.useMemo(
    () => data && data.changelog && data.changelog.filter(filter),
    [data, filter]
  )

  return children({
    loading,
    error,
    changelog,
  })
}
