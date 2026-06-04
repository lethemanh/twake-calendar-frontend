import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { updateCalendarAcl } from '@common/features/Calendars/CalendarDAO'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const patchACLCalendarAsync = createAsyncThunk<
  {
    calId: string
    calLink: string
    request: string
  },
  {
    calId: string
    calLink: string
    request: string
  },
  { rejectValue: RejectedError }
>(
  'calendars/requestACLCalendar',
  async ({ calId, calLink, request }, { rejectWithValue }) => {
    try {
      await updateCalendarAcl(calLink, request)
      return {
        calId,
        calLink,
        request
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
