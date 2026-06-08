import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { calendarAction } from '@common/features/Calendars/CalendarDAO'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const removeCalendarAsync = createAsyncThunk<
  {
    calId: string
  },
  {
    calId: string
    calLink: string
  },
  { rejectValue: RejectedError }
>(
  'calendars/removeCalendar',
  async ({ calId, calLink }, { rejectWithValue }) => {
    try {
      await calendarAction('DELETE', calLink)
      return {
        calId
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
