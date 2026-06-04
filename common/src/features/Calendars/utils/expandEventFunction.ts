import { reportEvent } from '@common/features/Events/EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'
import { formatDateToYYYYMMDDTHHMMSS } from '@common/utils/dateUtils'
import { Calendar } from '@common/types/CalendarTypes'
import { extractCalendarEvents } from './extractCalendarEvents'

export function expandEventFunction(
  calendarRange: { start: Date; end: Date },
  calendar: Calendar
): (item: string) => Promise<CalendarEvent[] | undefined> {
  return async eventUrl => {
    try {
      const item = await reportEvent({ URL: eventUrl } as CalendarEvent, {
        start: formatDateToYYYYMMDDTHHMMSS(calendarRange.start),
        end: formatDateToYYYYMMDDTHHMMSS(calendarRange.end)
      })
      const events: CalendarEvent[] = extractCalendarEvents(item, {
        cal: calendar,
        color: calendar.color
      })
      return events
    } catch (err) {
      console.error('Failed to fetch event', eventUrl, err)
      return undefined
    }
  }
}
