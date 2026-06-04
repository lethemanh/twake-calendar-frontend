import { putEvent } from '@common/features/Events/EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'
import { calendarEventToJCal } from '@common/features/Events/utils'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Calendar } from '@common/types/CalendarTypes'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const putEventAsync = createAsyncThunk<
  { calId: string; calType?: 'temp' },
  { cal: Calendar; newEvent: CalendarEvent; calType?: 'temp' },
  { rejectValue: RejectedError }
>(
  'calendars/putEvent',
  async ({ cal, newEvent, calType }, { rejectWithValue }) => {
    try {
      const jCal = calendarEventToJCal(
        newEvent,
        cal.owner?.emails ? cal.owner.emails[0] : undefined
      )
      await putEvent(newEvent, jCal)

      return {
        calId: cal.id,
        calType
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
