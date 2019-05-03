/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import ViewPanel from './ViewPanel'
import ErrorAlert from './ErrorAlert'
import Gutters from './Gutters'

export type Props = {
  children: React.Node,
}

const ErrorPanel = ({ children }: Props): React.Node => (
  <ViewPanel>
    <Gutters>
      <ErrorAlert>{children}</ErrorAlert>
    </Gutters>
  </ViewPanel>
)

export default ErrorPanel
