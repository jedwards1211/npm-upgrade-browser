// @flow

import { createSelector } from 'reselect'
import { type SelectedUpgrades } from '../redux/selectedUpgrades'
import { type State } from '../redux/types'
import { size } from 'lodash'

export default createSelector(
  (state: State) => state.selectedUpgrades,
  (selectedUpgrades: SelectedUpgrades) => size(selectedUpgrades)
)
