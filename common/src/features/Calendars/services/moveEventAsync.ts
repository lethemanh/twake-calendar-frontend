import { moveEvent } from '@common/features/Events/EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Calendar } from '@common/types/CalendarTypes'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const moveEventAsync = createAsyncThunk<
  { calId: string },
  { cal: Calendar; newEvent: CalendarEvent; newURL: string },
  { rejectValue: RejectedError }
>(
  'calendars/moveEvent',
  async ({ cal, newEvent, newURL }, { rejectWithValue }) => {
    try {
      await moveEvent(newEvent, newURL)

      return {
        calId: cal.id
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
