// @flow

import { combineReducers } from 'redux'
import { selectedUpgradesReducer as selectedUpgrades } from './selectedUpgrades'

export default combineReducers({
  selectedUpgrades,
})
