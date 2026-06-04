import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { updateDelegationCalendar } from '@common/features/Calendars/CalendarDAO'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const updateDelegationCalendarAsync = createAsyncThunk<
  {
    calId: string
    calLink: string
  },
  {
    calId: string
    calLink: string
    share: {
      set: { [x: string]: string | boolean; 'dav:href': string }[]
      remove: { [x: string]: string | boolean; 'dav:href': string }[]
    }
  },
  { rejectValue: RejectedError }
>(
  'calendars/patchDelegationCalendar',
  async ({ calId, calLink, share }, { rejectWithValue }) => {
    try {
      await updateDelegationCalendar(calLink, share)
      return {
        calId,
        calLink
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
