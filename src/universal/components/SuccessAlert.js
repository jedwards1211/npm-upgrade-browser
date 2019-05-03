/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import Check from '@material-ui/icons/Check'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import classNames from 'classnames'

const styles = ({ palette, spacing }: Theme) => ({
  root: {
    color: palette.success.main,
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
  },
  icon: {
    fontSize: '1.7em',
    marginRight: spacing.unit,
  },
  message: {
    flexGrow: 1,
  },
})

export type Props = {
  classes?: $Shape<Classes<typeof styles>>,
  children: React.Node,
  className?: ?string,
}

const SuccessAlertStyles = createStyled(styles, { name: 'SuccessAlert' })

const SuccessAlert = ({
  classes,
  children,
  className,
  ...props
}: Props): React.Node => (
  <SuccessAlertStyles classes={classes}>
    {({ classes }) => (
      <div
        className={classNames(classes.root, className)}
        {...props}
        data-component="SuccessAlert"
      >
        <Check className={classes.icon} />
        <span className={classes.message}>{children}</span>
      </div>
    )}
  </SuccessAlertStyles>
)

export default SuccessAlert
