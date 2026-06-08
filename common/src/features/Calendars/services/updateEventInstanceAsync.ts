import {
  fetchAllRecurrentVevents,
  putEvent
} from '@common/features/Events/EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'
import { makeEventWithOverrides } from '@common/features/Events/transformers/makeEventWithOverrides'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Calendar } from '@common/types/CalendarTypes'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const updateEventInstanceAsync = createAsyncThunk<
  { calId: string; event: CalendarEvent },
  { cal: Calendar; event: CalendarEvent },
  { rejectValue: RejectedError }
>(
  'calendars/updateEventInstance',
  async ({ cal, event }, { rejectWithValue }) => {
    try {
      const vevents = await fetchAllRecurrentVevents(event)
      const jCal = makeEventWithOverrides(
        event,
        vevents,
        cal.owner?.emails?.[0]
      )
      await putEvent(event, jCal)

      return { calId: cal.id, event }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
