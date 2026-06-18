import React from 'react'
import { CALENDAR_VIEWS } from './utils/constants'
import { useI18n } from 'twake-i18n'

export interface DayCellContentProps {
  date: Date
  view: { type: string }
  isToday: boolean
  dayNumberText: string
  timezone: string
}

export const DayCellContent: React.FC<DayCellContentProps> = ({
  date,
  view,
  isToday,
  dayNumberText,
  timezone
}) => {
  const { t } = useI18n()

  const month = date.toLocaleDateString(t('locale'), {
    month: 'short',
    timeZone: timezone
  })
  if (view.type === CALENDAR_VIEWS.dayGridMonth) {
    return (
      <span
        className={`fc-daygrid-day-number ${isToday ? 'current-date' : ''}`}
      >
        {dayNumberText === '1' ? month : ''} {dayNumberText}
      </span>
    )
  }
  return null
}
