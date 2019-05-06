// @flow

import { createReducer } from 'mindfront-redux-utils'
export const SELECT_UPGRADE = 'SELECT_UPGRADE'
export const CLEAR_SELECTED_UPGRADES = 'CLEAR_SELECTED_UPGRADES'

export type SelectUpgradeAction = {
  type: 'SELECT_UPGRADE',
  payload: ?string,
  meta: { package: string },
}

export const selectUpgrade = (
  pkg: string,
  version: ?string
): SelectUpgradeAction => ({
  type: SELECT_UPGRADE,
  payload: version,
  meta: { package: pkg },
})

export type ClearSelectedUpgradesAction = {
  type: 'CLEAR_SELECTED_UPGRADES',
}

export const clearSelectedUpgrades = () => ({ type: CLEAR_SELECTED_UPGRADES })

export type SelectedUpgrades = { [string]: string }

export const selectedUpgradesReducer = createReducer(
  {},
  {
    [CLEAR_SELECTED_UPGRADES]: () => ({}),
    [SELECT_UPGRADE]: (
      upgrades: SelectedUpgrades,
      { payload, meta: { package: pkg } }: SelectUpgradeAction
    ) => {
      if (!payload) {
        const result = { ...upgrades }
        delete result[pkg]
        return result
      }
      return { ...upgrades, [pkg]: payload }
    },
  }
)
