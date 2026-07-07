import { BookingSlotsResponse } from '@common/features/booking/types/BookingTypes'
import { useScreenSizeDetection } from '@common/useScreenSizeDetection'
import { BookingHeaderDesktop } from './BookingHeaderDesktop'
import { BookingHeaderMobile } from './BookingHeaderMobile'

export const BookingHeader: React.FC<{
  bookingInfo: BookingSlotsResponse
  selectedTimezone: string
  onTimezoneChange: (tz: string) => void
  referenceDate: Date
}> = ({ bookingInfo, selectedTimezone, onTimezoneChange, referenceDate }) => {
  const { isTooSmall: isMobile } = useScreenSizeDetection()

  if (isMobile) {
    return (
      <BookingHeaderMobile
        bookingInfo={bookingInfo}
        selectedTimezone={selectedTimezone}
        onTimezoneChange={onTimezoneChange}
        referenceDate={referenceDate}
      />
    )
  }

  return (
    <BookingHeaderDesktop
      bookingInfo={bookingInfo}
      selectedTimezone={selectedTimezone}
      onTimezoneChange={onTimezoneChange}
      referenceDate={referenceDate}
    />
  )
}
