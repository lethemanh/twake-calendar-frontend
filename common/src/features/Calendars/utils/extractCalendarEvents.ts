import { CalendarEvent } from '@common/types/EventsTypes'
import { parseCalendarEvent } from '@common/features/Events/utils'
import { defaultColors } from '@common/utils/defaultColors'
import { CalDavItem } from '@common/features/Calendars/types/CalendarApiTypes'
import { Calendar } from '@common/types/CalendarTypes'
import {
  VCalComponent,
  VObjectProperty
} from '@common/features/Calendars/types/CalendarData'

export function extractCalendarEvents(
  item: CalDavItem,
  options: {
    cal: Calendar
    color?: Record<string, string>
  }
): CalendarEvent[] {
  const data = item.data
  if (!Array.isArray(data)) {
    return []
  }

  // VEVENTS are at index 2
  const vevents = data[2]
  if (!Array.isArray(vevents)) {
    return []
  }

  const eventURL = item._links?.self?.href
  if (!eventURL) {
    return []
  }

  return vevents
    .map(vevent => {
      if (!Array.isArray(vevent)) {
        return null
      }

      const eventProps = vevent[1] as VObjectProperty[]
      if (!Array.isArray(eventProps)) {
        return null
      }

      const valarm = extractValarm(vevent as VCalComponent)

      return parseCalendarEvent({
        data: eventProps,
        color: options?.color ?? defaultColors[0],
        calendar: options.cal,
        eventURL,
        valarm
      })
    })
    .filter(Boolean) as CalendarEvent[]
}

function extractValarm(vevent: VCalComponent): VCalComponent | undefined {
  const subComponents = vevent[2]
  if (!Array.isArray(subComponents)) {
    return undefined
  }

  const valarmComponent = subComponents.find(
    component => Array.isArray(component) && component[0] === 'valarm'
  )

  return valarmComponent
}
