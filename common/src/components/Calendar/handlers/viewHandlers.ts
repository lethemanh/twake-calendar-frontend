import { EventErrorHandler } from '@common/components/Error/EventErrorHandler'
import { EventChip } from '@common/components/Event/EventChip/EventChip'
import { Calendar } from '@common/types/CalendarTypes'
import { userAttendee } from '@common/features/User/models/attendee'
import {
  CalendarApi,
  DayHeaderContentArg,
  DayHeaderMountArg,
  EventContentArg,
  EventMountArg,
  NowIndicatorContentArg,
  ViewMountArg
} from '@fullcalendar/core'
import { endOfDay } from 'date-fns'
import moment from 'moment-timezone'
import React from 'react'
import { CALENDAR_VIEWS } from '@common/components/Calendar/utils/constants'
import { createMouseHandlers } from './mouseHandlers'
import { EventChipSchedule } from '@common/components/Event/EventChip/EventChipSchedule'

export interface ViewHandlersProps {
  calendarRef: React.RefObject<CalendarApi | null>
  setSelectedDate: (date: Date) => void
  setSelectedMiniDate: (date: Date) => void
  onViewChange?: (view: string) => void
  calendars: Record<string, Calendar>
  tempcalendars: Record<string, Calendar>
  errorHandler: EventErrorHandler
  timezone: string
  isTablet: boolean
  isMobile: boolean
  t: (key: string) => string
  upcommingEventId?: string
}

export interface ViewHandlers {
  handleNowIndicatorContent: (
    arg: NowIndicatorContentArg
  ) => React.ReactElement | undefined
  handleDayHeaderContent: (arg: DayHeaderContentArg) => JSX.Element
  handleDayHeaderDidMount: (arg: DayHeaderMountArg) => void
  handleDayHeaderWillUnmount: (arg: DayHeaderMountArg) => void
  handleViewDidMount: (arg: ViewMountArg) => void
  handleViewWillUnmount: (arg: ViewMountArg) => void
  handleEventContent: (arg: EventContentArg) => React.ReactElement
  handleEventDidMount: (arg: EventMountArg) => void
}

export const createViewHandlers = (props: ViewHandlersProps): ViewHandlers => {
  const {
    calendarRef,
    setSelectedDate,
    setSelectedMiniDate,
    onViewChange,
    calendars,
    tempcalendars,
    errorHandler,
    timezone,
    isTablet,
    isMobile,
    t,
    upcommingEventId
  } = props

  const handleNowIndicatorContent = (
    arg: NowIndicatorContentArg
  ): React.ReactElement | undefined => {
    if (arg.isAxis) {
      return React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center' } },
        React.createElement(
          'div',
          { className: 'now-time-label' },
          new Date().toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: (arg.view.dateEnv as unknown as { timeZone: string })
              .timeZone
          })
        )
      )
    }
    return undefined
  }

  const handleDayHeaderClick = (arg: DayHeaderContentArg): void => {
    const startOfDay = new Date(arg.date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfClickedDay = endOfDay(new Date(arg.date))

    calendarRef.current?.select({
      start: startOfDay,
      end: endOfClickedDay,
      allDay: true
    })
  }

  const handleDayNumberClick = (
    e: React.MouseEvent,
    arg: DayHeaderContentArg
  ): void => {
    e.stopPropagation()
    calendarRef.current?.changeView(CALENDAR_VIEWS.timeGridDay, arg.date)
    setSelectedDate(new Date(arg.date))
    setSelectedMiniDate(new Date(arg.date))
    if (onViewChange) {
      onViewChange(CALENDAR_VIEWS.timeGridDay)
    }
  }

  const handleDayHeaderContent = (arg: DayHeaderContentArg): JSX.Element => {
    const m = moment.tz(arg.date, timezone)
    const date = m.date()
    const weekDay = m
      .toDate()
      .toLocaleDateString(t('locale'), {
        weekday: 'short',
        timeZone: timezone
      })
      .toUpperCase()

    return React.createElement(
      'div',
      {
        className: `fc-daygrid-day-top ${isTablet || isMobile ? 'fc-daygrid-day-top--mobile' : ''}`
      },
      React.createElement('small', null, weekDay),
      arg.view.type !== CALENDAR_VIEWS.dayGridMonth
        ? React.createElement(
            'span',
            {
              className: `fc-daygrid-day-number ${arg.isToday ? 'current-date' : ''}`,
              onClick: (e: React.MouseEvent) => handleDayNumberClick(e, arg)
            },
            date
          )
        : null
    )
  }

  interface ClickableHeaderElement extends HTMLElement {
    __dayHeaderClickHandler?: EventListener
  }

  const handleDayHeaderDidMount = (arg: DayHeaderMountArg): void => {
    if (arg.view.type === CALENDAR_VIEWS.timeGridWeek) {
      const headerEl = arg.el as ClickableHeaderElement

      const handleDayClick = (): void => {
        handleDayHeaderClick(arg)
      }

      headerEl.addEventListener('click', handleDayClick)
      headerEl.__dayHeaderClickHandler = handleDayClick
    }
  }

  const handleDayHeaderWillUnmount = (arg: DayHeaderMountArg): void => {
    const headerEl = arg.el as ClickableHeaderElement
    if (headerEl.__dayHeaderClickHandler) {
      headerEl.removeEventListener('click', headerEl.__dayHeaderClickHandler)
      delete headerEl.__dayHeaderClickHandler
    }
  }

  const handleViewDidMount = (arg: ViewMountArg): void => {
    if (
      arg.view.type === CALENDAR_VIEWS.timeGridWeek ||
      arg.view.type === CALENDAR_VIEWS.timeGridDay
    ) {
      const calendarEl = document.querySelector('.fc') as HTMLElement
      if (calendarEl) {
        const mouseHandlers = createMouseHandlers({ calendarEl })
        mouseHandlers.addMouseEventListeners()
      }
    }
  }

  const handleViewWillUnmount = (arg: ViewMountArg): void => {
    const el = arg.el as HTMLElement & {
      __timeInterval?: ReturnType<typeof setInterval>
      __timeObserver?: { disconnect: () => void }
    }

    if (el.__timeInterval !== undefined) {
      clearInterval(el.__timeInterval)
      delete el.__timeInterval
    }

    if (el.__timeObserver !== undefined) {
      el.__timeObserver.disconnect()
      delete el.__timeObserver
    }

    const calendarEl = document.querySelector('.fc') as HTMLElement
    if (calendarEl) {
      const mouseHandlers = createMouseHandlers({ calendarEl })
      mouseHandlers.removeMouseEventListeners()
    }
  }

  const handleEventContent = (arg: EventContentArg): React.ReactElement => {
    if (arg.view.type === CALENDAR_VIEWS.listWeek) {
      return React.createElement(EventChipSchedule, {
        arg,
        calendars,
        tempcalendars,
        timezone,
        upcommingEventId
      })
    }
    return React.createElement(EventChip, {
      arg,
      calendars,
      tempcalendars,
      errorHandler
    })
  }

  const handleEventDidMount = (arg: EventMountArg): void => {
    const extendedProps = arg.event._def.extendedProps as {
      attendee?: userAttendee[]
      calId: string
    }
    const attendees = extendedProps.attendee ?? []
    if (!calendars[extendedProps.calId]) return

    const ownerEmails = new Set(
      calendars[extendedProps.calId].owner?.emails?.map(email =>
        email.toLowerCase()
      )
    )
    const showSpecialDisplay = attendees.filter((att: userAttendee) =>
      ownerEmails.has(att.cal_address.toLowerCase())
    )

    if (!showSpecialDisplay[0]) return

    arg.el.classList.remove(
      'declined-event',
      'tentative-event',
      'needs-action-event'
    )

    switch (showSpecialDisplay[0].partstat) {
      case 'DECLINED':
        arg.el.classList.add('declined-event')
        break
      case 'TENTATIVE':
        arg.el.classList.add('tentative-event')
        break
      case 'NEEDS-ACTION':
        arg.el.classList.add('needs-action-event')
        break
      default:
        break
    }
  }

  return {
    handleNowIndicatorContent,
    handleDayHeaderContent,
    handleDayHeaderDidMount,
    handleDayHeaderWillUnmount,
    handleViewDidMount,
    handleViewWillUnmount,
    handleEventContent,
    handleEventDidMount
  }
}
