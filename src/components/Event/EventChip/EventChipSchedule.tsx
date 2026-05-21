import React from 'react'
import { EventContentArg, EventApi } from '@fullcalendar/core'
import moment from 'moment-timezone'
import { alpha, Box, useTheme } from '@linagora/twake-mui'
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
import { sortEventsByDateTime } from '@/components/Calendar/utils/calendarUtils'

export interface EventChipScheduleProps {
  arg: EventContentArg
  calendars: Record<string, Calendar>
  tempcalendars: Record<string, Calendar>
  timezone: string
  upcommingEventId?: string
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

const getEventInstanceKey = (e: EventApi): string => {
  // Use FullCalendar's internal instanceId (unique per occurrence) when available.
  // This prevents recurring events sharing the same id/calId/start from all
  // matching as the "first" event and showing the day indicator multiple times.
  const instanceId = (e as unknown as { _instance?: { instanceId?: string } })
    ._instance?.instanceId
  if (instanceId) return instanceId
  const ext = e.extendedProps as unknown as CalendarEvent
  return `${e.id}_${ext.calId ?? ''}_${e.start?.getTime() ?? ''}`
}

const buildListDayData = (
  arg: EventContentArg,
  timezone: string
): {
  isFirstRow: boolean
  isToday: boolean
  isInPast: boolean
  dayNum: string
  dayName: string
} => {
  const effectiveDayMoment = getEffectiveDayMoment(arg, timezone)
  const dayKey = effectiveDayMoment.format('YYYY-MM-DD')

  const allEvents = arg.view.calendar.getEvents()
  const sameDayEvents = allEvents
    .filter(e => isEventOnDay(e, dayKey, timezone))
    .sort(sortEventsByDateTime)

  const firstEvent = sameDayEvents[0]

  const isFirstRow = Boolean(
    firstEvent &&
    getEventInstanceKey(firstEvent) === getEventInstanceKey(arg.event)
  )

  const now = moment().tz(timezone)
  const isToday = effectiveDayMoment.isSame(now, 'day')
  const isInPast = effectiveDayMoment.isBefore(now, 'day')

  return {
    isFirstRow,
    isToday,
    isInPast,
    dayNum: effectiveDayMoment.format('D'),
    dayName: effectiveDayMoment.format('ddd')
  }
}

export const EventChipSchedule: React.FC<EventChipScheduleProps> = ({
  arg,
  calendars,
  tempcalendars,
  timezone,
  upcommingEventId
}) => {
  const { t } = useI18n()
  const theme = useTheme()

  const ext = arg.event.extendedProps as CalendarEvent
  const { temp } = arg.event._def.extendedProps
  const isRecurrent = !!ext.repetition
  const videoUrl = ext.x_openpass_videoconference
  const calendarsSource = temp ? tempcalendars : calendars
  const calendar = calendarsSource[ext.calId]
  const calendarColor = calendar?.color?.light ?? defaultColors[0].light

  const dayData = buildListDayData(arg, timezone)

  if (dayData.isInPast) {
    return null
  }

  return (
    <Box
      data-event-id={ext.uid}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        textAlign: 'left',
        width: '100%',
        p: 3,
        backgroundColor:
          upcommingEventId === ext.uid
            ? alpha(theme.palette.grey[200], 0.5)
            : 'transparent'
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
