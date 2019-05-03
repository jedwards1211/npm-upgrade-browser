// @flow

import * as React from 'react'
// $FlowFixMe wtf isn't this working??
import type { QueryRenderProps } from 'react-apollo'
import LoadingPanel from './LoadingPanel'
import ErrorPanel from './ErrorPanel'

import LoadingAlert from './LoadingAlert'

import ErrorAlert from './ErrorAlert'

export type DefinedRenderProps<TData, TVariables = any> = $Diff<
  QueryRenderProps<TData, TVariables>,
  { data: any }
> & {
  data: TData,
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
) => ({
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
