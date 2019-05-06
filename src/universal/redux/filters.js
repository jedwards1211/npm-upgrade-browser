// @flow
import { createReducer } from 'mindfront-redux-utils'
import semver from 'semver'

export type Filters = {
  prerelease: boolean,
  minor: boolean,
}

export const initFilters = {
  prerelease: false,
  minor: true,
}

export const SET_FILTERS = 'SET_FILTERS'

export type SetFiltersAction = {
  type: 'SET_FILTERS',
  payload: $Shape<Filters>,
}

export const setFilters = (payload: $Shape<Filters>): SetFiltersAction => ({
  type: SET_FILTERS,
  payload,
})

export const setPrereleaseFilter = (prerelease: boolean): SetFiltersAction =>
  setFilters({ prerelease })
export const setMinorFilter = (minor: boolean): SetFiltersAction =>
  setFilters({ minor })

export const filtersReducer = createReducer(initFilters, {
  [SET_FILTERS]: (filters: Filters, { payload }: SetFiltersAction) => ({
    ...filters,
    ...payload,
  }),
})

export const releaseFilter = (filters: Filters) => ({
  version,
}: {
  version: string,
}): boolean => {
  if (!filters.prerelease && semver.prerelease(version)) return false
  if (
    !filters.minor &&
    ((semver.major(version) && semver.minor(version)) || semver.patch(version))
  )
    return false
  return true
}
