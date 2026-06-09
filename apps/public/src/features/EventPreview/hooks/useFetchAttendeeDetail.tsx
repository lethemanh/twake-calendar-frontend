import { userData } from '@common/features/User/userDataTypes'
import { useMemo } from 'react'

export const useFetchAttendeeDetail = (
  organizerEmail: string | undefined
): userData | undefined => {
  // This is a placeholder for the actual user fetching logic.
  // In a real implementation, you would replace this with an API call to fetch the user details.
  // TO DO: Implement actual fetching logic here in https://github.com/linagora/twake-calendar-frontend/issues/984.
  return useMemo(() => {
    if (!organizerEmail) return undefined
    return {
      email: organizerEmail,
      openpaasId: organizerEmail,
      given_name: '',
      family_name: '',
      language: 'en',
      name: '',
      sid: '',
      sub: ''
    }
  }, [organizerEmail])
}
