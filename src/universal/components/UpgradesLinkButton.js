/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'
import selectNumUpgrades from '../selectors/selectNumUpgrades'
import { useSelector } from 'react-redux'

export type Props = {}

const UpgradesLinkButton = (props: Props): React.Node => {
  const numUpgrades = useSelector(selectNumUpgrades)
  return (
    <Button variant="outlined" component={Link} to="/upgrades">
      <Badge color="primary" badgeContent={numUpgrades}>
        Apply Upgrades
      </Badge>
    </Button>
  )
}

export default UpgradesLinkButton
