import { fetchEvent } from '@common/features/Events/EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'
import { parseFetchedEvent } from '@common/features/Events/transformers/parseFetchedEvent'
import { formatReduxError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const getEventAsync = createAsyncThunk<
  { calId: string; event: CalendarEvent },
  CalendarEvent,
  { rejectValue: RejectedError }
>('calendars/getEvent', async (event, { rejectWithValue }) => {
  try {
    const response = await fetchEvent(event)
    const fetchedEvent = parseFetchedEvent(event, response)

    return {
      calId: event.calId,
      event: fetchedEvent
    }
  } catch (err) {
    const error = err as { response?: { status?: number } }
    return rejectWithValue({
      message: formatReduxError(err),
      status: error.response?.status
    })
  }
})
