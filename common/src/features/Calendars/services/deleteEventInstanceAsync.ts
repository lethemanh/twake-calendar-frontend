import { CalendarEvent } from '@common/types/EventsTypes'
import { formatReduxError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'
import { Calendar } from '@common/types/CalendarTypes'
import {
  fetchAllRecurrentVevents,
  putEvent
} from '@common/features/Events/EventDao'
import { makeDeleteEventInstanceJCal } from '@common/features/Events/transformers/makeDeleteEventInstanceJCal'

export const deleteEventInstanceAsync = createAsyncThunk<
  { calId: string; eventId: string },
  { cal: Calendar; event: CalendarEvent },
  { rejectValue: RejectedError }
>('calendars/delEventInstance', async ({ cal, event }, { rejectWithValue }) => {
  try {
    const vevents = await fetchAllRecurrentVevents(event)
    const newJCal = makeDeleteEventInstanceJCal(vevents, event)
    await putEvent(event, newJCal)

    return { calId: cal.id, eventId: event.uid }
  } catch (err) {
    const error = err as { response?: { status?: number } }
    return rejectWithValue({
      message: formatReduxError(err),
      status: error.response?.status
    })
  }
})
