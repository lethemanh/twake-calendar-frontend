import React, { useState } from 'react'
import { Button, TextField, Typography } from '@linagora/twake-mui'
import { ResponsiveDialog } from '@common/components/Dialog'
import { useI18n } from 'twake-i18n'
import { AddDescButton } from '@common/components/Event/AddDescButton'
import { TimeSlotSelectField } from './TimeSlotSelectField'
import { TimezoneSelectField } from './TimezoneSelectField'
import { CalendarSelectField } from '@common/components/Event/fields/CalendarSelectField'
import type { Calendar } from '@common/types/CalendarTypes'
import { useScreenSizeDetection } from '@common/useScreenSizeDetection'
import { RegularHoursField } from './RegularHoursField'
import { DayAvailability } from './RegularHoursField/RegularHoursTypes'
import { useAppSelector } from '@common/app/hooks'
import AttendeeSelector from '@common/components/Attendees/AttendeeSearch'
import { userAttendee } from '@common/features/User/models/attendee'
import { EventFormFieldsExpanded } from '@common/components/Event/components/EventFormFieldsExpanded'
import { FieldWithLabel } from '@common/components/Event/components/FieldWithLabel'
import LocationField from '@common/components/Event/fields/LocationField'
import { Resource } from '@common/components/Attendees/ResourceSearch'
import { Valarms } from '@common/types/Valarms'
import { useResponsiveInputSize } from '@common/hooks/useResponsiveInputSize'

interface AppointmentModalFormProps {
  open: boolean
  onClose: () => void
  title: string
  name: string
  setName: (value: string) => void
  duration: number
  setDuration: (value: number) => void
  description: string
  setDescription: (value: string) => void
  showDescription: boolean
  setShowDescription: (value: boolean) => void
  timezone: string
  setTimezone: (value: string) => void
  calendarid: string
  setCalendarid: (value: string) => void
  userPersonalCalendars: Calendar[]
  availabilityRules?: DayAvailability[]
  setAvailabilityRules?: React.Dispatch<React.SetStateAction<DayAvailability[]>>
  attendees: userAttendee[]
  setAttendees: (value: userAttendee[]) => void
  location: string
  setLocation: (value: string) => void
  alarms: Valarms
  setAlarms: (value: Valarms) => void
  busy: string
  setBusy: (value: string) => void
  eventClass: 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL'
  setEventClass: (value: 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL') => void
  selectedResources: Resource[]
  setSelectedResources: (value: Resource[]) => void
  error: string | null
  loading: boolean
  isFormValid: boolean
  onSave: () => void
  saveButtonText: string
}

export const AppointmentModalForm: React.FC<AppointmentModalFormProps> = ({
  open,
  onClose,
  title,
  name,
  setName,
  duration,
  setDuration,
  description,
  setDescription,
  showDescription,
  setShowDescription,
  timezone,
  setTimezone,
  calendarid,
  setCalendarid,
  userPersonalCalendars,
  availabilityRules,
  setAvailabilityRules,
  attendees,
  setAttendees,
  location,
  setLocation,
  alarms,
  setAlarms,
  busy,
  setBusy,
  eventClass,
  setEventClass,
  selectedResources,
  setSelectedResources,
  error,
  loading,
  isFormValid,
  onSave,
  saveButtonText
}) => {
  const { t } = useI18n()
  const { isTooSmall: isMobile } = useScreenSizeDetection()
  const inputSize = useResponsiveInputSize()

  const businessHours = useAppSelector(state => state.settings.businessHours)
  const workingDays = businessHours?.daysOfWeek

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title={title}
      isExpanded={isExpanded}
      onExpandToggle={() => setIsExpanded(p => !p)}
      expandText={t('booking.expand', { defaultValue: 'Expand' })}
      actions={
        <Button
          onClick={() => void onSave()}
          variant="contained"
          disabled={loading || !isFormValid}
        >
          {saveButtonText}
        </Button>
      }
    >
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <FieldWithLabel
        label={isExpanded ? t('booking.title') : ''}
        isExpanded={isExpanded && !isMobile}
      >
        <TextField
          size={isMobile ? 'medium' : 'small'}
          margin="dense"
          placeholder={t('booking.scheduleName')}
          type="text"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </FieldWithLabel>

      <TimeSlotSelectField
        duration={duration}
        setDuration={setDuration}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <FieldWithLabel
          label={isExpanded ? t('event.form.participants') : ''}
          isExpanded={isExpanded && !isMobile}
        >
          <AttendeeSelector
            attendees={attendees}
            setAttendees={setAttendees}
            timezone={timezone}
            placeholder={t('event.form.addGuestsPlaceholder')}
            inputSlot={params => <TextField {...params} size={inputSize} />}
          />
        </FieldWithLabel>
      )}

      <RegularHoursField
        availabilityRules={availabilityRules}
        setAvailabilityRules={setAvailabilityRules}
        workingDays={workingDays}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <TimezoneSelectField
          isExpanded
          timezone={timezone}
          setTimezone={setTimezone}
        />
      )}

      {isExpanded && (
        <AddDescButton
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          showMore={isExpanded}
          description={description}
          setDescription={setDescription}
          attachments={[]}
          setAttachments={() => {}}
        />
      )}

      {isExpanded && (
        <LocationField
          location={location}
          setLocation={setLocation}
          showMore={isExpanded}
          isOpen={open}
        />
      )}

      {isExpanded && (
        <CalendarSelectField
          calendarid={calendarid}
          setCalendarid={setCalendarid}
          userPersonalCalendars={userPersonalCalendars}
          showMore={isExpanded}
        />
      )}

      {isExpanded && (
        <EventFormFieldsExpanded
          alarms={alarms}
          setAlarms={setAlarms}
          busy={busy}
          setBusy={setBusy}
          eventClass={eventClass}
          setEventClass={setEventClass}
          showMore={isExpanded}
          selectedResources={selectedResources}
          setSelectedResources={setSelectedResources}
        />
      )}
    </ResponsiveDialog>
  )
}
