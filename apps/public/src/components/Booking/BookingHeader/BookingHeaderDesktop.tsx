import { BookingSlotsResponse } from '@common/features/booking/types/BookingTypes'
import { Box } from '@linagora/twake-mui'
import React from 'react'
import {
  BookingOwnerAvatar,
  BookingOwnerName,
  BookingEventDetails
} from './BookingOwnerInfo'
import { BookingMetaInfo } from './BookingMetaInfo'

export const BookingHeaderDesktop: React.FC<{
  bookingInfo: BookingSlotsResponse
  selectedTimezone: string
  onTimezoneChange: (tz: string) => void
  referenceDate: Date
}> = ({ bookingInfo, selectedTimezone, onTimezoneChange, referenceDate }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        p: '24px'
      }}
    >
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <BookingOwnerAvatar owner={bookingInfo.owner} />
        <Box>
          <BookingOwnerName owner={bookingInfo.owner} />
          <BookingEventDetails bookingInfo={bookingInfo} />
        </Box>
      </Box>
      <BookingMetaInfo
        selectedTimezone={selectedTimezone}
        onTimezoneChange={onTimezoneChange}
        referenceDate={referenceDate}
      />
    </Box>
  )
}
