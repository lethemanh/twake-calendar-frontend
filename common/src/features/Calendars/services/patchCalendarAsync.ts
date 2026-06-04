import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { calendarAction } from '@common/features/Calendars/CalendarDAO'
import { makeProppatchCalendarBody } from '@common/features/Calendars/transformers'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const patchCalendarAsync = createAsyncThunk<
  {
    calId: string
    calLink: string
    patch: { name: string; desc: string; color: Record<string, string> }
  },
  {
    calId: string
    calLink: string
    patch: { name: string; desc: string; color: Record<string, string> }
  },
  { rejectValue: RejectedError }
>(
  'calendars/patchCalendar',
  async ({ calId, calLink, patch }, { rejectWithValue }) => {
    try {
      const body = makeProppatchCalendarBody(patch)
      await calendarAction('PROPPATCH', calLink, body)
      return {
        calId,
        calLink,
        patch
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
