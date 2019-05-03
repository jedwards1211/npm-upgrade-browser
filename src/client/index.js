/* eslint-env browser, commonjs */

import * as React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import client from './apollo/client'
import makeStore from './redux/makeStore'

let reloads = 0
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root not found')

const store = makeStore(window.__INITIAL_STATE__)

function mount(Root) {
  ReactDOM.render(
    <Root key={++reloads} client={client} store={store} />,
    rootElement
  )
}

if (module.hot instanceof Object) {
  module.hot.accept('./Root', () => {
    mount(require('./Root').default)
  })
}

mount(Root)
