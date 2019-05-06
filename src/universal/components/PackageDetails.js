/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import Markdown from 'react-markdown'
import createStyled from 'material-ui-render-props-styles'
import type { Classes } from 'material-ui-render-props-styles'
import type { Theme } from '../theme'
import ErrorAlert from './ErrorAlert'
import SuccessAlert from './SuccessAlert'
import ChangelogQuery, { type ChangelogChildrenData } from './ChangelogQuery'
import LoadingAlert from './LoadingAlert'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { selectUpgrade } from '../redux/selectedUpgrades'

import CloseIcon from '@material-ui/icons/Close'

import UpdateIcon from '@material-ui/icons/Update'

import IconButton from '@material-ui/core/IconButton'

import Typography from '@material-ui/core/Typography'

// @graphql-to-flow auto-generated
type Release = {
  id: string,
  version: string,
  header: string,
  date: any,
  body: ?string,
  error: ?string,
}

export type Props = {
  pkg: string,
}

const packageDetailsStyles = (theme: Theme) => ({
  root: {},
  packageName: {
    marginBottom: theme.spacing.unit * 4,
    flex: '0 0 auto',
  },
  changelog: {},
  changelogEntry: {
    position: 'relative',
  },
  changelogEntrySelected: {},
  updateIcon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing.unit,
  },
  selectVersionButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    visibility: 'hidden',
    '$changelogEntry:hover &': {
      visibility: 'visible',
    },
  },
  versionSelectedSection: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})

const PackageDetailsStyles = createStyled(packageDetailsStyles, {
  name: 'PackageDetails',
})

const PackageDetails = ({ pkg }: Props): React.Node => {
  const selectedVersion = useSelector(state => state.selectedUpgrades[pkg])
  const dispatch = useDispatch()
  return (
    <PackageDetailsStyles>
      {({ classes }: { classes: Classes<typeof packageDetailsStyles> }) => (
        <ChangelogQuery package={pkg}>
          {({
            loading,
            error,
            changelog,
          }: ChangelogChildrenData): React.Node => (
            <div className={classes.root}>
              {loading && <LoadingAlert>Loading changelog...</LoadingAlert>}
              {error && (
                <ErrorAlert>
                  {error.message.replace(/graphql error:\s*/, '')}
                </ErrorAlert>
              )}
              {changelog && !changelog.length && (
                <SuccessAlert>Up to date!</SuccessAlert>
              )}
              {changelog && changelog.length > 0 && (
                <div className={classes.changelog}>
                  {changelog.map(
                    ({ id, version, header, body, error }: Release) => (
                      <div
                        key={id}
                        className={classNames(classes.changelogEntry, {
                          [classes.changelogEntrySelected]:
                            version === selectedVersion,
                        })}
                      >
                        {version === selectedVersion ? (
                          <Typography
                            variant="body1"
                            color="primary"
                            className={classes.versionSelectedSection}
                          >
                            <UpdateIcon className={classes.updateIcon} />
                            Selected{' '}
                            <IconButton
                              onClick={() => dispatch(selectUpgrade(pkg, null))}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Typography>
                        ) : (
                          <Button
                            className={classes.selectVersionButton}
                            variant="text"
                            onClick={() =>
                              dispatch(selectUpgrade(pkg, version))
                            }
                          >
                            <UpdateIcon className={classes.updateIcon} /> Select
                            this Version
                          </Button>
                        )}
                        <Markdown
                          source={`${header}\n\n${body || ''}`}
                          escapeHtml={false}
                        />
                        {error && <ErrorAlert>{error}</ErrorAlert>}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </ChangelogQuery>
      )}
    </PackageDetailsStyles>
  )
}

export default PackageDetails
