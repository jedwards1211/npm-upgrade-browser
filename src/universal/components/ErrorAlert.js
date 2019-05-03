/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import ErrorIcon from '@material-ui/icons/Error'
import type { Theme } from '../theme'

import classNames from 'classnames'

const styles = ({ palette, spacing }: Theme) => ({
  root: {
    color: palette.error.A400,
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
  },
  errorIcon: {
    fontSize: '1.7em',
    marginRight: spacing.unit,
  },
  errorMessage: {
    flexGrow: 1,
  },
})

export type Props = {
  className?: ?string,
  classes?: $Shape<Classes<typeof styles>>,
  children: React.Node,
}

const ErrorAlertStyles = createStyled(styles, { name: 'ErrorAlert' })

const ErrorAlert = ({
  classes,
  children,
  className,
  ...props
}: Props): React.Node => (
  <ErrorAlertStyles classes={classes}>
    {({ classes }) => (
      <div
        className={classNames(classes.root, className)}
        {...props}
        data-component="ErrorAlert"
      >
        <ErrorIcon className={classes.errorIcon} />
        <span className={classes.errorMessage}>{children}</span>
      </div>
    )}
  </ErrorAlertStyles>
)

export default ErrorAlert
