// @flow

import * as redux from 'redux'

import {
  type SelectedUpgrades,
  type SelectUpgradeAction,
} from './selectedUpgrades'

export type State = {
  selectedUpgrades: SelectedUpgrades,
}

export type Action = SelectUpgradeAction

export type Dispatch = redux.Dispatch<Action>
export type MiddlewareAPI = redux.MiddlewareAPI<State, Action>
export type Middleware = redux.Middleware<State, Action>
export type Reducer = redux.Reducer<State, Action>
export type Store = redux.Store<State, Action>
