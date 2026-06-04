import { CalendarEvent } from '@common/types/EventsTypes'
import {
  CalendarData,
  CalendarItem
} from '@common/features/Calendars/types/CalendarData'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCalendar } from '@common/features/Calendars/CalendarDAO'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'
import { extractCalendarEvents } from '@common/features/Calendars/utils/extractCalendarEvents'
import { type RootState } from '@common/app/store'

export const getCalendarDetailAsync = createAsyncThunk<
  {
    calId: string
    events: CalendarEvent[]
    calType?: string
    syncToken?: string
  },
  {
    calId: string
    match: { start: string; end: string }
    calType?: string
    signal?: AbortSignal
  },
  { rejectValue: RejectedError }
>(
  'calendars/getCalendarDetails',
  async ({ calId, match, calType, signal }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const calendarStored =
        state.calendars[calType === 'temp' ? 'templist' : 'list'][calId]
      if (!calendarStored) {
        return rejectWithValue(
          toRejectedError(new Error(`Calendar ${calId} not found in store`))
        )
      }
      const calendar = (await fetchCalendar(
        calId,
        match,
        signal
      )) as CalendarData
      const syncToken = calendar._embedded?.['sync-token']

      const items = calendar._embedded?.['dav:item']
      const events: CalendarEvent[] = Array.isArray(items)
        ? items.flatMap((item: CalendarItem) =>
            extractCalendarEvents(item, {
              cal: calendarStored,
              color: calendarStored.color
            })
          )
        : []

      return { calId, events, calType, syncToken }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
