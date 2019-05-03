// @flow

import * as React from 'react'
import type { QueryRenderProps } from 'react-apollo'
import LoadingPanel from './LoadingPanel'
import ErrorPanel from './ErrorPanel'

import LoadingAlert from './LoadingAlert'

import ErrorAlert from './ErrorAlert'

import {
  ApolloClient,
  type ApolloQueryResult,
  type FetchMoreOptions,
  type FetchMoreQueryOptions,
  type NetworkStatus,
  type SubscribeToMoreOptions,
  ApolloError,
  type QueryRenderPropFunction,
} from 'react-apollo'
import { type DocumentNode } from 'graphql'

export type DefinedRenderProps<TData = any, TVariables = any> = {
  data: TData,
  loading: boolean,
  error?: ApolloError,
  variables: TVariables,
  networkStatus: NetworkStatus,
  refetch: (variables?: TVariables) => Promise<ApolloQueryResult<TData>>,
  fetchMore: ((
    options: FetchMoreOptions<TData, TVariables> &
      FetchMoreQueryOptions<TVariables>
  ) => Promise<ApolloQueryResult<TData>>) &
    (<TData2, TVariables2>(
      options: { query: DocumentNode } & FetchMoreQueryOptions<TVariables2> &
        FetchMoreOptions<TData2, TVariables2>
    ) => Promise<ApolloQueryResult<TData2>>),
  load: () => void,
  startPolling: (interval: number) => void,
  stopPolling: () => void,
  subscribeToMore: (
    options: SubscribeToMoreOptions<TData, any, any>
  ) => () => void,
  updateQuery: (
    mapFn: (previousResult: TData, options: { variables: TVariables }) => TData
  ) => mixed,
  client: ApolloClient<any>,
}

type Options = {
  loadingMessage?: ?React.Node,
  errorMessage?: ?React.Node,
  what?: ?React.Node,
  variant?: ?('alerts' | 'panels'),
}

const queryBoilerplate = <TData, TVariables>(
  render: (result: DefinedRenderProps<TData, TVariables>) => React.Node,
  { loadingMessage, errorMessage, what, variant }: Options = {}
): QueryRenderPropFunction<TData, TVariables> => ({
  loading,
  error,
  data,
  ...rest
}: QueryRenderProps<TData, TVariables>): React.Node => {
  if (loading) {
    const Comp = variant === 'alerts' ? LoadingAlert : LoadingPanel
    return (
      <Comp>
        {loadingMessage || <React.Fragment>Loading {what}...</React.Fragment>}
      </Comp>
    )
  }
  if (error || !data) {
    const Comp = variant === 'alerts' ? ErrorAlert : ErrorPanel
    return (
      <Comp>
        {errorMessage || <React.Fragment>Failed to load {what}</React.Fragment>}
        {error && <div>{error.message}</div>}
      </Comp>
    )
  }
  return render({ loading, error, data: (data: any), ...rest })
}

export default queryBoilerplate
