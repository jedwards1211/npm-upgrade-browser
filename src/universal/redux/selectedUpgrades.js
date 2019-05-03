// @flow

import { createReducer } from 'mindfront-redux-utils'
export const SELECT_UPGRADE = 'SELECT_UPGRADE'

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

export type SelectedUpgrades = { [string]: string }

export const selectedUpgradesReducer = createReducer(
  {},
  {
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
