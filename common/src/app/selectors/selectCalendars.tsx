import { RootState } from '@common/app/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectCalendars = createSelector(
  (state: RootState) => state.calendars.list,
  list => Object.values(list || {})
)
