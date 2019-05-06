// @flow

import { combineReducers } from 'redux'
import { selectedUpgradesReducer as selectedUpgrades } from './selectedUpgrades'
import { filtersReducer as filters } from './filters'

export default combineReducers({
  selectedUpgrades,
  filters,
})
