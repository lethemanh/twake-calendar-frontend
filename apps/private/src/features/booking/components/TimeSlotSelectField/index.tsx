import { FieldWithLabel } from '@common/components/Event/components/FieldWithLabel'
import { FormControl } from '@linagora/twake-mui'
import { useI18n } from 'twake-i18n'
import { TimeSlotSelectFieldProps } from './index.type'
import { useScreenSizeDetection } from '@common/useScreenSizeDetection'
import { DesktopTimeSlotSelectField } from './DesktopTimeSlotSelectField'
import { MobileTimeSlotSelectField } from './MobileTimeSlotSelectField'

const TimeSlotSelectForm: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { t } = useI18n()

  return (
    <FieldWithLabel label={t('booking.chooseTimeSlot')} isExpanded={false}>
      <FormControl fullWidth margin="dense" size="small">
        {children}
      </FormControl>
    </FieldWithLabel>
  )
}

export const TimeSlotSelectField: React.FC<TimeSlotSelectFieldProps> = ({
  duration,
  setDuration
}) => {
  const { isTooSmall: isMobile } = useScreenSizeDetection()

  if (isMobile) {
    return (
      <TimeSlotSelectForm>
        <MobileTimeSlotSelectField
          duration={duration}
          setDuration={setDuration}
        />
      </TimeSlotSelectForm>
    )
  }

  return (
    <TimeSlotSelectForm>
      <DesktopTimeSlotSelectField
        duration={duration}
        setDuration={setDuration}
      />
    </TimeSlotSelectForm>
  )
}
