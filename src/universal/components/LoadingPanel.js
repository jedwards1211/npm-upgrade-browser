/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import ViewPanel from './ViewPanel'
import LoadingAlert from './LoadingAlert'

import Gutters from './Gutters'

export type Props = {
  children: React.Node,
}

const LoadingPanel = ({ children }: Props): React.Node => (
  <ViewPanel>
    <Gutters>
      <LoadingAlert>{children}</LoadingAlert>
    </Gutters>
  </ViewPanel>
)

export default LoadingPanel
