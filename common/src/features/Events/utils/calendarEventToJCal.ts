import { TIMEZONES } from '@common/utils/timezone-data'
import { CalendarEvent } from '@common/types/EventsTypes'
import { makeVevent } from './makeVevent'
import { makeTimezone } from './makeTimezone'
import { VcalendarProperties } from '@common/features/Calendars/types/VcalendarProperties'

export function calendarEventToJCal(
  event: CalendarEvent,
  calOwnerEmail?: string
) {
  const tzid = event.timezone

  const vevent = makeVevent(event, tzid, calOwnerEmail)

  const timezoneData = TIMEZONES.zones[event.timezone]
  const vtimezone = makeTimezone(timezoneData, event)

  return ['vcalendar', VcalendarProperties, [vevent, vtimezone.component.jCal]]
}
