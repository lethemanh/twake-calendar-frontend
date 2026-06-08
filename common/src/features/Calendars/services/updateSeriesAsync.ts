import { makeSeriesJCal } from '@common/features/Events/transformers/makeSeriesJCal'
import { CalendarEvent } from '@common/types/EventsTypes'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Calendar } from '@common/types/CalendarTypes'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'
import {
  fetchAllRecurrentVevents,
  putEvent
} from '@common/features/Events/EventDao'

export const updateSeriesAsync = createAsyncThunk<
  void,
  {
    cal: Calendar
    event: CalendarEvent
    removeOverrides?: boolean
    sourceRecurrenceId?: string
  },
  { rejectValue: RejectedError }
>(
  'calendars/updateSeries',
  async (
    { cal, event, removeOverrides = true, sourceRecurrenceId },
    { rejectWithValue }
  ) => {
    try {
      const vevents = await fetchAllRecurrentVevents(event)
      const jCal = makeSeriesJCal(vevents, event, {
        calOwnerEmail: cal.owner?.emails?.[0],
        removeOverrides,
        sourceRecurrenceId
      })

      await putEvent(event, jCal)
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
