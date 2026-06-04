import { RootState } from '@common/app/store'
import { Calendar } from '@common/types/CalendarTypes'

export function findCalendarById(
  state: Partial<RootState>,
  calendarId: string
): { calendar: Calendar; type?: 'temp' } | undefined {
  if (calendarId.length === 0) {
    return
  }
  if (state.calendars?.templist?.[calendarId]) {
    return { calendar: state.calendars.templist[calendarId], type: 'temp' }
  }
  if (state.calendars?.list?.[calendarId]) {
    return { calendar: state.calendars.list[calendarId] }
  }
}
