import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import React from 'react'
import { LONG_DATE_FORMAT } from '@common/components/Event/utils/dateTimeFormatters'
import { ReadOnlyDateField } from '@common/components/Event/components/ReadOnlyPickerField'
import {
  dateCalendarLayoutSx,
  getDateFieldSlotProps,
  getDateSlotProps
} from './dateTimePickerSlotProps'
import { DatePickerFieldProps } from './DatePickerField'

export const DesktopDatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  testId,
  label,
  hasError = false
}) => (
  <DatePicker
    format={LONG_DATE_FORMAT}
    value={value}
    onChange={onChange}
    slots={{ field: ReadOnlyDateField }}
    slotProps={{
      ...getDateSlotProps(testId, hasError, label),
      field: getDateFieldSlotProps(testId, hasError, label),
      layout: { sx: dateCalendarLayoutSx }
    }}
  />
)
