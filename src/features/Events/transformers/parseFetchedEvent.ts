import { convertEventDateTimeToISO, resolveTimezoneId } from '@/utils/timezone'
import ICAL from 'ical.js'
import moment from 'moment-timezone'
import { Calendar } from '../../Calendars/CalendarTypes'
import {
  VCalComponent,
  VObjectProperty
} from '../../Calendars/types/CalendarData'
import { CalendarEvent } from '../EventsTypes'
import { parseCalendarEvent } from '../utils'

function filterComponents(
  eventical: VCalComponent,
  componentName: string
): VCalComponent[] {
  return (eventical[2] ?? []).filter(
    ([name]) => name.toLowerCase() === componentName
  )
}

function normalizeRecurrenceId(id: string): string {
  if (!id) return ''
  return id
    .replace(/\.\d+/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
}

function parseRecurrenceIdToMs(
  id: string,
  defaultTimezone: string
): number | null {
  if (!id) return null
  try {
    const isUtc = id.toLowerCase().endsWith('z')
    if (isUtc) {
      const parsed = moment.utc(id)
      if (parsed.isValid()) return parsed.valueOf()
    } else {
      const parsed = moment.tz(id, defaultTimezone)
      if (parsed.isValid()) return parsed.valueOf()
    }
  } catch (e) {
    // Ignore parsing errors and return null
  }
  return null
}

function selectTargetVevent(
  vevents: VCalComponent[],
  isMaster?: boolean,
  recurrenceId?: string,
  defaultTimezone: string = 'UTC'
): VCalComponent | undefined {
  if (isMaster) {
    const master = vevents.find(
      ([, props]) =>
        !(props as VObjectProperty[]).find(
          ([k]) => k.toLowerCase() === 'recurrence-id'
        )
    )
    return master ?? vevents[0]
  }

  if (recurrenceId) {
    // 1. Timezone-aware timestamp matching
    const targetMs = parseRecurrenceIdToMs(recurrenceId, defaultTimezone)
    if (targetMs !== null) {
      const target = vevents.find(([, props]) => {
        const recProp = (props as VObjectProperty[]).find(
          ([k]) => k.toLowerCase() === 'recurrence-id'
        )
        if (!recProp) return false
        const recValue = recProp[3]
        if (typeof recValue !== 'string') return false
        const recParams = recProp[1] as Record<string, string> | undefined
        const tzid =
          resolveTimezoneId(getTimeZone(recParams)) ?? defaultTimezone
        const recMs = parseRecurrenceIdToMs(recValue, tzid)
        return recMs === targetMs
      })
      if (target) {
        return target
      }
    }

    // 2. String-based normalization fallback
    const normalizedTarget = normalizeRecurrenceId(recurrenceId)
    const target = vevents.find(([, props]) => {
      const recProp = (props as VObjectProperty[]).find(
        ([k]) => k.toLowerCase() === 'recurrence-id'
      )
      if (!recProp) return false
      const recValue = recProp[3]
      if (typeof recValue !== 'string') return false
      return normalizeRecurrenceId(recValue) === normalizedTarget
    })
    if (target) {
      return target
    }
  }

  const master = vevents.find(
    ([, props]) =>
      !(props as VObjectProperty[]).find(
        ([k]) => k.toLowerCase() === 'recurrence-id'
      )
  )
  return master ?? vevents[0]
}

function resolveTimezoneFromVTimezone(
  vtimezones: VCalComponent[]
): string | undefined {
  if (vtimezones.length === 0) {
    return undefined
  }
  const tzidProp = (vtimezones[0][1] as VObjectProperty[]).find(
    ([k]) => k.toLowerCase() === 'tzid'
  )
  if (!tzidProp?.[3]) {
    return undefined
  }
  return resolveTimezoneId(tzidProp[3] as string) ?? undefined
}

function resolveTimezoneFromDtstart(
  targetVevent: VCalComponent
): string | undefined {
  const dtstartProp = (targetVevent[1] as VObjectProperty[]).find(
    ([k]) => k.toLowerCase() === 'dtstart'
  )
  const dtstartParams = dtstartProp?.[1] as Record<string, string> | undefined
  const dtstartValue = dtstartProp?.[3]

  const tzParam = getTimeZone(dtstartParams)

  const resolved = resolveTimezoneId(tzParam)
  if (resolved) {
    return resolved
  }
  if (typeof dtstartValue === 'string' && dtstartValue.endsWith('Z')) {
    return 'UTC'
  }
  return undefined
}

function getTimeZone(
  dtstartParams: Record<string, string> | undefined
): string | undefined {
  return (
    dtstartParams?.['tzid'] ??
    dtstartParams?.['TZID'] ??
    dtstartParams?.['Tzid'] ??
    dtstartParams?.['tZid'] ??
    dtstartParams?.['tzId']
  )
}

function applyTimezoneToDateFields(
  eventjson: CalendarEvent,
  timezone: string
): void {
  if (eventjson.allday) {
    return
  }
  const startISO = convertEventDateTimeToISO(eventjson.start, timezone)
  const endISO = convertEventDateTimeToISO(eventjson.end, timezone)

  if (startISO) {
    eventjson.start = startISO
  }
  if (endISO) {
    eventjson.end = endISO
  }
}

export function parseFetchedEvent(
  event: CalendarEvent,
  eventData: string,
  isMaster?: boolean
): CalendarEvent {
  const eventical = ICAL.parse(eventData) as VCalComponent
  const vevents = filterComponents(eventical, 'vevent')
  const vtimezones = filterComponents(eventical, 'vtimezone')

  const recurrenceId =
    event.recurrenceId ??
    (event.uid?.includes('/') ? event.uid.split('/')[1] : undefined)

  const timezoneFromVTimezone = resolveTimezoneFromVTimezone(vtimezones)
  const masterVevent = vevents.find(
    ([, props]) =>
      !(props as VObjectProperty[]).find(
        ([k]) => k.toLowerCase() === 'recurrence-id'
      )
  )
  const timezoneFromDtstart = masterVevent
    ? resolveTimezoneFromDtstart(masterVevent)
    : undefined
  const defaultTimezone =
    timezoneFromVTimezone ?? timezoneFromDtstart ?? event.timezone ?? 'UTC'

  const targetVevent = selectTargetVevent(
    vevents,
    isMaster,
    recurrenceId,
    defaultTimezone
  )
  if (!targetVevent) {
    return event
  }

  const targetTimezoneFromDtstart = resolveTimezoneFromDtstart(targetVevent)

  const eventjson = parseCalendarEvent(
    targetVevent[1] as VObjectProperty[],
    event.color ?? {},
    { id: event?.calId } as Calendar,
    event.URL
  )

  const finalTimezone =
    timezoneFromVTimezone ??
    targetTimezoneFromDtstart ??
    eventjson.timezone ??
    'UTC'

  eventjson.timezone = finalTimezone
  applyTimezoneToDateFields(eventjson, finalTimezone)

  const mergedEvent = { ...event, ...eventjson, timezone: finalTimezone }
  if (event.uid?.includes('/')) {
    mergedEvent.uid = event.uid
    mergedEvent.recurrenceId = event.recurrenceId ?? event.uid.split('/')[1]
  }
  return mergedEvent
}
