import React from 'react'
import { render, screen } from '@testing-library/react'
import { RegularHoursField } from '../../../../apps/private/src/features/booking/components/RegularHoursField'
import { useRegularHours } from '../../../../apps/private/src/features/booking/hooks/useRegularHours'

jest.mock('twake-i18n', () => ({
  useI18n: () => ({
    t: (key: string, options: any) => options?.defaultValue || key
  })
}))

jest.mock(
  '../../../../apps/private/src/features/booking/hooks/useRegularHours',
  () => ({
    useRegularHours: jest.fn()
  })
)

jest.mock(
  '../../../../apps/private/src/features/booking/components/RegularHoursField/RegularHoursRow',
  () => ({
    RegularHoursRow: ({ day, isWorkingDay, isEnabled, dayLabel }: any) => (
      <div
        data-testid={`row-${day}`}
        data-working-day={isWorkingDay}
        data-enabled={isEnabled}
      >
        {dayLabel}
      </div>
    )
  })
)

describe('RegularHoursField', () => {
  const mockSetAvailabilityRules = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegularHours as jest.Mock).mockReturnValue({
      handleToggleDay: jest.fn(),
      handleAddSlot: jest.fn(),
      handleRemoveSlot: jest.fn(),
      handleTimeChange: jest.fn(),
      handleCopySlot: jest.fn(),
      getDayLabel: (day: string) => `Label-${day}`
    })
  })

  it('renders correctly with default slots', () => {
    render(
      <RegularHoursField
        availabilityRules={[]}
        setAvailabilityRules={mockSetAvailabilityRules}
        workingDays={[1, 2, 3, 4, 5]}
      />
    )

    expect(screen.getByText('booking.setRegularHours')).toBeInTheDocument()

    // Check if it renders 7 rows
    const rows = screen.getAllByTestId(/^row-/)
    expect(rows).toHaveLength(7)
  })

  it('passes correct props to RegularHoursRow', () => {
    // 1=MON, 2=TUE... in DAY_TO_FC
    const availabilityRules = [
      {
        dayOfWeek: 'MON' as any,
        enabled: true,
        slots: [{ start: '10:00', end: '11:00' }]
      }
    ]

    render(
      <RegularHoursField
        availabilityRules={availabilityRules}
        setAvailabilityRules={mockSetAvailabilityRules}
        workingDays={[1]} // Only Monday is a working day
      />
    )

    const monRow = screen.getByTestId('row-MON')
    expect(monRow).toHaveAttribute('data-working-day', 'true')
    expect(monRow).toHaveAttribute('data-enabled', 'true')
    expect(monRow).toHaveTextContent('Label-MON')

    const tueRow = screen.getByTestId('row-TUE')
    // Tue should be non-working since only 1 is in workingDays
    expect(tueRow).toHaveAttribute('data-working-day', 'false')
    expect(tueRow).toHaveAttribute('data-enabled', 'false')
    expect(tueRow).toHaveTextContent('Label-TUE')
  })
})
