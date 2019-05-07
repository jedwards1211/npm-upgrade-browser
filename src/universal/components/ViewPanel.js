// @flow

import * as React from 'react'
import classNames from 'classnames'
import createStyled from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import Paper from '@material-ui/core/Paper'
import Gutters from './Gutters'

const viewPanelPadding = {
  vertical: 16,
}

const styles = (theme: Theme) => ({
  root: {
    maxWidth: 600,
    margin: `${theme.spacing.unit * 2}px auto`,
    ...theme.mixins.clearfix,
  },
})

type ExtractClasses = <T: Object>(
  styles: (theme: Theme) => T
) => { [name: $Keys<T>]: string }
type Classes = $Call<ExtractClasses, typeof styles>

export type Props = {
  classes?: Classes,
  className?: ?string,
  children?: React.Node,
}

const ViewPanelStyles = createStyled<Theme, typeof styles>(styles, {
  name: 'ViewPanel',
})

const ViewPanel = ({ classes, className, ...props }: Props) => (
  <ViewPanelStyles classes={classes}>
    {({ classes }) => (
      <Paper className={classNames(classes.root, className)} {...props} />
    )}
  </ViewPanelStyles>
)

export default ViewPanel

const viewPanelBodyStyles = (theme: Theme) => ({
  root: {
    padding: {
      top: viewPanelPadding.vertical,
      bottom: viewPanelPadding.vertical,
    },
  },
  noVerticalPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})

type ViewPanelBodyClasses = $Call<ExtractClasses, typeof viewPanelBodyStyles>

export type ViewPanelBodyProps = {
  classes?: ViewPanelBodyClasses,
  children?: React.Node,
  noVerticalPadding?: boolean,
}

const ViewPanelBodyStyles = createStyled<Theme, typeof viewPanelBodyStyles>(
  viewPanelBodyStyles,
  {
    name: 'ViewPanelBody',
  }
)

export const ViewPanelBody = ({
  classes,
  noVerticalPadding,
  ...props
}: ViewPanelBodyProps) => (
  <ViewPanelBodyStyles classes={classes}>
    {({ classes }) => (
      <Gutters>
        <div
          className={classNames(classes.root, {
            [classes.noVerticalPadding]: noVerticalPadding,
          })}
          {...props}
        />
      </Gutters>
    )}
  </ViewPanelBodyStyles>
)
