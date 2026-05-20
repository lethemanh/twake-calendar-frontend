import { CALENDAR_VIEWS } from '@/components/Calendar/utils/constants'
import { EventInput } from '@fullcalendar/core'
import { Box } from '@linagora/twake-mui'
import React, { useEffect, useRef } from 'react'

export const NOW_INDICATOR_EVENT_ID = '__now_indicator__'

export const NowIndicatorSchedule: React.FC<{
  currentView: string
  timezone: string
  events: EventInput[]
}> = ({ currentView, timezone, events }) => {
  const scheduleNowIndicatorRef = useRef<HTMLDivElement | null>(null)

  // Inject a percentage-based time indicator line into the schedule (list) view.
  // Position = sectionTop + (minutesSinceMidnight / 1440) × todaySectionHeight
  useEffect(() => {
    if (currentView !== CALENDAR_VIEWS.listWeek) {
      return
    }

    const timeoutId = setTimeout(() => {
      const scroller = document.querySelector(
        '.fc-list .fc-scroller'
      ) as HTMLElement
      if (!scroller) return

      // Find today's day header (hidden in DOM but present)
      const todayStr = new Date().toLocaleDateString('en-CA', {
        timeZone: timezone
      })
      const todayHeader = document.querySelector(
        `.fc-list-day[data-date="${todayStr}"]`
      )
      if (!todayHeader || !events.length) return // No events today

      // Collect all event rows belonging to today (until next day header)
      const todayRows: HTMLElement[] = []
      let sibling = todayHeader.nextElementSibling
      while (sibling && !sibling.classList.contains('fc-list-day')) {
        if (sibling.classList.contains('fc-list-event')) {
          todayRows.push(sibling as HTMLElement)
        }
        sibling = sibling.nextElementSibling
      }
      if (todayRows.length === 0) return

      // Measure today's section bounds in scroll coordinates
      const scrollerRect = scroller.getBoundingClientRect()
      const firstRect = todayRows[0].getBoundingClientRect()
      const lastRect = todayRows[todayRows.length - 1].getBoundingClientRect()
      const sectionTop = firstRect.top - scrollerRect.top + scroller.scrollTop
      const sectionBottom =
        lastRect.bottom - scrollerRect.top + scroller.scrollTop
      const sectionHeight = sectionBottom - sectionTop

      // Calculate time percentage and map to today's section
      const now = new Date()
      const minutesSinceMidnight =
        now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
      const percentage = minutesSinceMidnight / 1440
      const indicatorTop = Math.round(sectionTop + percentage * sectionHeight)

      // The scroller must be position:relative so absolute children stay inside it
      scroller.style.position = 'relative'
      const indicator = scheduleNowIndicatorRef.current
      if (!indicator) return
      scroller.appendChild(indicator)
      indicator.style.top = `${indicatorTop}px`

      // Scroll so the indicator is vertically centred in the visible area
      scroller.scrollTo({
        top: Math.max(0, indicatorTop - scroller.clientHeight / 2)
      })
    }, 300)

    return (): void => {
      clearTimeout(timeoutId)
    }
  }, [currentView, timezone, events])

  return (
    <div
      ref={scheduleNowIndicatorRef}
      data-now-indicator="true"
      style={{
        position: 'absolute',
        width: '100%',
        height: '2px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
      }}
    >
      {/* Orange dot on the left */}
      <Box
        sx={{
          position: 'absolute',
          left: 30,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          flexShrink: 0,
          zIndex: 2
        }}
      />
      {/* Horizontal line */}
      <Box
        sx={{
          position: 'absolute',
          left: 30,
          right: 0,
          height: 2,
          backgroundColor: 'primary.main',
          zIndex: 1
        }}
      />
    </div>
  )
}
