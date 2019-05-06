// @flow

import * as redux from 'redux'
import {
  type SelectedUpgrades,
  type SelectUpgradeAction,
  type ClearSelectedUpgradesAction,
} from './selectedUpgrades'
import { type Filters, type SetFiltersAction } from './filters'

export type State = {
  selectedUpgrades: SelectedUpgrades,
  filters: Filters,
}

export type Action =
  | SelectUpgradeAction
  | ClearSelectedUpgradesAction
  | SetFiltersAction

export type Dispatch = redux.Dispatch<Action>
export type MiddlewareAPI = redux.MiddlewareAPI<State, Action>
export type Middleware = redux.Middleware<State, Action>
export type Reducer = redux.Reducer<State, Action>
export type Store = redux.Store<State, Action>
