import { EventPreviewDetails } from '@/components/EventPreview/EventPreviewDetails'
import { EventPreviewTitleRow } from '@common/components/EventPreview/EventPreviewTitleRow'
import { AttendanceValidation } from '@common/features/Events/AttendanceValidation/AttendanceValidation'
import { Box, Typography, useTheme } from '@linagora/twake-mui'
import React from 'react'
import { useI18n } from 'twake-i18n'
import { useParseToken } from './hooks/useParseToken'
import { useFetchAttendeeDetail } from './hooks/useFetchAttendeeDetail'
import { useFetchCalendarDetail } from './hooks/useFetchCalendarDetail'
import { useFetchEventDetail } from './hooks/useFetchEventDetail'
import { useCreateContext } from './hooks/useCreateContext'
import { CalendarEvent } from '@common/types/EventsTypes'
import { Calendar } from '@common/types/CalendarTypes'

const checkIfEventIsPublic = (event: CalendarEvent | undefined): boolean => {
  return !['PRIVATE', 'CONFIDENTIAL'].includes(event?.class as string)
}

const checkIfIsEventOwner = (
  calendar: Calendar | undefined,
  organizerEmail: string
): boolean => {
  return Boolean(calendar?.owner?.emails?.includes(organizerEmail))
}

export const EventPreviewPage: React.FC = () => {
  const { t } = useI18n()
  const theme = useTheme()

  const decodedClaims = useParseToken()

  const calId = decodedClaims?.calId
  const organizerEmail = decodedClaims?.organizerEmail
  const attendeeEmail = decodedClaims?.attendeeEmail

  const event = useFetchEventDetail()

  const calendar = useFetchCalendarDetail(calId, organizerEmail)

  const user = useFetchAttendeeDetail(attendeeEmail)

  const contextualizedEvent = useCreateContext({ event, calendar, user })

  if (!decodedClaims || !event) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h5">
          {t('error.cannotLoadEvent')}
        </Typography>
      </Box>
    )
  }

  const isOwn = checkIfIsEventOwner(calendar, organizerEmail as string)

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        padding: { xs: '24px', sm: '32px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      <EventPreviewTitleRow
        event={event}
        isOwn={isOwn}
        timezone={event.timezone}
        t={t}
      />

      <EventPreviewDetails
        event={event}
        isOwn={isOwn}
        isNotPrivate={checkIfEventIsPublic(event)}
        isResourceEventPreview={false}
        calendarName={calendar?.name}
      />

      {contextualizedEvent && (
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: '24px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <AttendanceValidation
            contextualizedEvent={contextualizedEvent}
            user={user}
            setAfterChoiceFunc={() => {}}
            setOpenEditModePopup={() => {}}
            hideCounterProposalSection={true}
          />
        </Box>
      )}
    </Box>
  )
}

export default EventPreviewPage
