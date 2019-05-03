/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { size } from 'lodash'

const styles = (theme: Theme) => ({
  apply: theme.mixins.gutters(),
  bypass: negate(theme.mixins.gutters()),
})

export type Props = {
  +classes: $Shape<Classes<typeof styles>>,
  +className?: ?string,
  /**
   * If neither overlay nor bypass is set, and this component isn't already
   * inside parent gutters, the children will be wrapped in a div with the
   * horizontal gutter padding.
   */
  +children?: ?React.Node,
  /**
   * If given, renders a div that "overlays" any parent gutters with a
   * negative margin (if there are parent gutters) and equal padding, so
   * that the background will extend beyond the parent gutters but the children
   * will not.
   */
  +overlay?: ?boolean,
  /**
   * If given, renders a div that bypasses parent gutters with a negative margin
   * (if inside parent gutters), so that the children will extend beyond the
   * parent gutters.
   */
  +bypass?: ?boolean,
}

const GuttersContext = React.createContext(false)

const Gutters = ({
  classes,
  className: inputClassName,
  children,
  bypass,
  overlay,
  ...props
}: Props): React.Node => {
  const inGutters = React.useContext(GuttersContext)

  const childHasGutters = !bypass
  const className = classNames(inputClassName, {
    [classes.bypass]: (bypass || overlay) && inGutters,
    [classes.apply]: overlay || (!bypass && !inGutters),
  })
  const content =
    className || size(props) ? (
      <div className={className} {...props}>
        {children}
      </div>
    ) : (
      children || <React.Fragment />
    )

  return inGutters !== childHasGutters ? (
    <GuttersContext.Provider value={childHasGutters}>
      {content}
    </GuttersContext.Provider>
  ) : (
    content
  )
}

export default withStyles(styles)(Gutters)

function negate(style: Object): Object {
  const { paddingLeft, paddingRight } = style
  const result = {}
  for (let key in style) {
    if (style[key] instanceof Object) result[key] = negate(style[key])
  }
  if (paddingLeft != null) result.marginLeft = -paddingLeft
  if (paddingRight != null) result.marginRight = -paddingRight
  return result
}
