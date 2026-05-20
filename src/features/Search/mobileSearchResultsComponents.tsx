import {
  getBestColor,
  getTitleStyle
} from '@/components/Event/EventChip/EventChipUtils'
import { Calendar } from '@/features/Calendars/CalendarTypes'
import { defaultColors } from '@/utils/defaultColors'
import { Box, Card, CardHeader, Typography } from '@linagora/twake-mui'
import React from 'react'
import { useI18n } from 'twake-i18n'
import { SearchEventResult } from './types/SearchEventResult'

interface MobileDateProps {
  startDate: Date
  t: (key: string) => string
  timeZone: string
}

interface MobileEventCardProps {
  eventData: SearchEventResult
  calendar: Calendar | undefined
  timeZone: string
}

export const RenderMobileDate: React.FC<MobileDateProps> = ({
  startDate,
  t,
  timeZone
}) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h4" sx={{ fontWeight: 400 }}>
      {startDate.toLocaleDateString(t('locale'), { day: '2-digit', timeZone })}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {startDate
        .toLocaleDateString(t('locale'), { weekday: 'short', timeZone })
        .toUpperCase()}
    </Typography>
  </Box>
)

export const RenderMobileEventCard: React.FC<MobileEventCardProps> = ({
  eventData,
  calendar,
  timeZone
}) => {
  const { t } = useI18n()

  const startDate = new Date(eventData.data.start)
  const bestColor = calendar?.color
    ? getBestColor(calendar.color as { light: string; dark: string })
    : defaultColors[0].dark
  const titleStyle = getTitleStyle(
    bestColor,
    'ACCEPTED',
    calendar ?? ({} as Calendar),
    false
  )

  return (
    <Card
      variant="outlined"
      sx={{
        height: 'stretch',
        width: '100%',
        borderRadius: '8px',
        p: 1,
        boxShadow: 'none',
        backgroundColor: calendar?.color?.light,
        color: calendar?.color?.dark,
        border: '1px solid',
        borderColor: 'background.paper',
        display: 'flex'
      }}
      data-testid={`event-card-${eventData.data.uid}`}
    >
      <CardHeader
        sx={{ p: '0px', '& .MuiCardHeader-content': { overflow: 'hidden' } }}
        title={
          <Typography variant="body2" noWrap style={titleStyle}>
            {eventData.data.summary || t('event.untitled')}
          </Typography>
        }
        subheader={
          !eventData.data.allDay && (
            <Typography
              style={{
                color: titleStyle.color,
                opacity: '70%',
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: '10px',
                lineHeight: '16px',
                letterSpacing: '0%',
                verticalAlign: 'middle'
              }}
            >
              {startDate.toLocaleTimeString(t('locale'), {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timeZone
              })}
            </Typography>
          )
        }
      />
    </Card>
  )
}
