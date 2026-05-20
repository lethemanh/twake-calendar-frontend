import React from 'react'
import { EventContentArg, EventApi } from '@fullcalendar/core'
import moment from 'moment-timezone'
import { Box } from '@linagora/twake-mui'
import SquareRoundedIcon from '@mui/icons-material/SquareRounded'
import { Calendar } from '@/features/Calendars/CalendarTypes'
import { CalendarEvent } from '@/features/Events/EventsTypes'
import { useI18n } from 'twake-i18n'
import { defaultColors } from '@/utils/defaultColors'
import {
  RenderOrganizer,
  RenderVideoJoin,
  RenderTitle,
  RenderText
} from '@/features/Search/searchResultsComponents'
import {
  RenderDayIndicator,
  RenderListEventTime
} from '@/features/Search/listSearchResultsComponents'

export interface EventChipScheduleProps {
  arg: EventContentArg
  calendars: Record<string, Calendar>
  tempcalendars: Record<string, Calendar>
  timezone: string
}

const getEffectiveDayMoment = (
  arg: EventContentArg,
  timezone: string
): moment.Moment => {
  if (arg.isStart || !arg.event.end) {
    return moment(arg.event.start).tz(timezone)
  }
  if (arg.isEnd) {
    return moment(arg.event.end).tz(timezone)
  }
  return moment(arg.event.start).tz(timezone).add(1, 'day')
}

const isEventOnDay = (
  e: EventApi,
  dayKey: string,
  timezone: string
): boolean => {
  if (!e.start) return false
  const eStartDay = moment(e.start).tz(timezone).format('YYYY-MM-DD')
  if (eStartDay === dayKey) return true
  if (e.end) {
    const eEndInclusiveDay = moment(e.end)
      .tz(timezone)
      .subtract(1, 'millisecond')
      .format('YYYY-MM-DD')
    return eStartDay < dayKey && eEndInclusiveDay >= dayKey
  }
  return false
}

const compareEvents = (a: EventApi, b: EventApi): number => {
  const aStart = a.start?.getTime() ?? 0
  const bStart = b.start?.getTime() ?? 0
  if (aStart !== bStart) return aStart - bStart
  const aEnd = a.end?.getTime() ?? aStart
  const bEnd = b.end?.getTime() ?? bStart
  if (aEnd !== bEnd) return aEnd - bEnd
  const aPriority =
    (a.extendedProps as unknown as { priority?: number }).priority ?? 0
  const bPriority =
    (b.extendedProps as unknown as { priority?: number }).priority ?? 0
  return aPriority - bPriority
}

const getEventCompositeKey = (e: {
  id: string
  extendedProps: Record<string, unknown>
}): string => {
  const ext = e.extendedProps as unknown as CalendarEvent
  return `${e.id}_${ext.calId ?? ''}`
}

const buildListDayData = (
  arg: EventContentArg,
  timezone: string
): {
  isFirstRow: boolean
  isToday: boolean
  dayNum: string
  dayName: string
} => {
  const effectiveDayMoment = getEffectiveDayMoment(arg, timezone)
  const dayKey = effectiveDayMoment.format('YYYY-MM-DD')

  const allEvents = arg.view.calendar.getEvents()
  const sameDayEvents = allEvents
    .filter(e => isEventOnDay(e, dayKey, timezone))
    .sort(compareEvents)

  const firstEvent = sameDayEvents[0]

  const isFirstRow = Boolean(
    firstEvent &&
    getEventCompositeKey(firstEvent) === getEventCompositeKey(arg.event) &&
    firstEvent.start &&
    arg.event.start &&
    firstEvent.start.getTime() === arg.event.start.getTime()
  )

  return {
    isFirstRow,
    isToday: effectiveDayMoment.isSame(moment().tz(timezone), 'day'),
    dayNum: effectiveDayMoment.format('D'),
    dayName: effectiveDayMoment.format('ddd')
  }
}

export const EventChipSchedule: React.FC<EventChipScheduleProps> = ({
  arg,
  calendars,
  tempcalendars,
  timezone
}) => {
  const { t } = useI18n()
  const ext = arg.event.extendedProps as CalendarEvent
  const { temp } = arg.event._def.extendedProps
  const isRecurrent = !!ext.repetition
  const videoUrl = ext.x_openpass_videoconference
  const calendarsSource = temp ? tempcalendars : calendars
  const calendar = calendarsSource[ext.calId]
  const calendarColor = calendar?.color?.light ?? defaultColors[0].light

  const dayData = buildListDayData(arg, timezone)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        textAlign: 'left',
        width: '100%',
        p: 3
      }}
    >
      <RenderDayIndicator {...dayData} />
      <RenderListEventTime
        allDay={arg.event.allDay}
        startDate={arg.event.start || new Date()}
        endDate={arg.event.end || arg.event.start || new Date()}
        timeZone={timezone}
        t={t}
        isStart={arg.isStart}
        isEnd={arg.isEnd}
      />
      <SquareRoundedIcon
        style={{ color: calendarColor, width: 24, height: 24, flexShrink: 0 }}
      />
      <RenderTitle summary={arg.event.title} isRecurrent={isRecurrent} t={t} />
      <RenderOrganizer organizer={ext.organizer} />
      <RenderText text={ext.location} />
      <RenderText text={ext.description} />
      <Box sx={{ ml: 'auto', flexShrink: 0 }}>
        <RenderVideoJoin t={t} url={videoUrl} />
      </Box>
    </Box>
  )
}
