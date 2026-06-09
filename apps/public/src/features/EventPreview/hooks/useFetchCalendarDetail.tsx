import { Calendar } from '@common/types/CalendarTypes'
import { useMemo } from 'react'

export const useFetchCalendarDetail = (
  calId: string | undefined,
  organizerEmail: string | undefined
): Calendar | undefined => {
  // This is a placeholder for the actual calendar fetching logic.
  // In a real implementation, you would replace this with an API call to fetch the calendar details based on the calId.
  // TO DO: Implement actual fetching logic here in https://github.com/linagora/twake-calendar-frontend/issues/984.
  return useMemo(() => {
    if (!calId) return undefined
    return {
      id: calId,
      name: 'Calendar',
      color: { light: '#0A84FF', dark: '#0A84FF' },
      owner: {
        emails: [organizerEmail as string],
        firstname: '',
        lastname: '',
        resource: false
      },
      events: {},
      delegated: false,
      link: `/calendars/${calId}.json`,
      invite: [],
      visibility: 'private'
    }
  }, [calId, organizerEmail])
}
