/**
 * @flow
 * @prettier
 */

/* eslint-env browser */

import * as React from 'react'

type Props = {
  children: React.Node,
}

type State = {
  error: ?Error,
}

export default class Root extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): $Shape<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    const pathname = window.location.pathname
    const interval = setInterval(() => {
      if (window.location.pathname !== pathname) {
        clearInterval(interval)
        this.setState({ error: null })
      }
    }, 100)
  }

  render(): React.Node {
    const { children } = this.props
    const { error } = this.state
    if (error) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          <pre>{error.stack}</pre>
        </div>
      )
    }

    return children
  }
}
