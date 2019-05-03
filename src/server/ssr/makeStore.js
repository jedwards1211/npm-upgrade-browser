/* @flow */

import { createStore } from 'redux'
import reducer from '../../universal/redux/reducer'
import type { State, Store } from '../../universal/redux/types'

export default (initialState?: State): Store => {
  return createStore(reducer, initialState)
}
