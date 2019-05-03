/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import Spinner from './Spinner'
import classNames from 'classnames'

const styles = ({ spacing }: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
  },
  spinner: {
    marginRight: spacing.unit,
  },
  message: {
    flexGrow: 1,
  },
})

export type Props = {
  className?: ?string,
  classes?: $Shape<Classes<typeof styles>>,
  children: React.Node,
}

const LoadingAlertStyles = createStyled(styles, { name: 'LoadingAlert' })

const LoadingAlert = ({
  classes,
  children,
  className,
  ...props
}: Props): React.Node => (
  <LoadingAlertStyles classes={classes}>
    {({ classes }) => (
      <div
        className={classNames(classes.root, className)}
        {...props}
        data-component="LoadingAlert"
      >
        <Spinner className={classes.spinner} />
        <span className={classes.message}>{children}</span>
      </div>
    )}
  </LoadingAlertStyles>
)

export default LoadingAlert
