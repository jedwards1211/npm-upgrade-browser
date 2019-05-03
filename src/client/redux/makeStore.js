/* @flow */

import { createStore, compose, applyMiddleware } from 'redux'
import { composeMiddleware } from 'mindfront-redux-utils'
import reducer from '../../universal/redux/reducer'
import {
  type State,
  type Middleware,
  type Store,
} from '../../universal/redux/types'

export default (initialState: State): Store => {
  const middlewares: Array<Middleware> = []

  // istanbul ignore next
  if (
    process.env.LOG_REDUX_ACTIONS ||
    (!window.devToolsExtension &&
      process.env.NODE_ENV !== 'production' &&
      process.env.BABEL_ENV !== 'test')
  ) {
    // We don't have the Redux extension in the browser, show the Redux logger
    const { createLogger } = require('redux-logger')
    middlewares.push(
      createLogger({
        level: 'info',
        collapsed: (getState, action, logEntry) => !logEntry.error,
      })
    )
  }

  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    const store = createStore(
      reducer,
      initialState,
      compose(
        // composeMiddleware improves efficiency
        applyMiddleware(composeMiddleware(...middlewares))
      )
    )
    if ((module: any).hot instanceof Object) {
      ;(module: any).hot.accept(
        '../../universal/redux/reducer',
        (require: Function) => {
          const newReducer = require('../../universal/redux/reducer')
          store.replaceReducer(newReducer)
        }
      )
    }
    return store
  }

  // composeMiddleware improves efficiency
  return createStore(
    reducer,
    initialState,
    applyMiddleware(composeMiddleware(...middlewares))
  )
}
