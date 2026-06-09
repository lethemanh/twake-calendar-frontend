import { createEventContext } from '@common/features/Events/createEventContext'
import { userData } from '@common/features/User/userDataTypes'
import { Calendar } from '@common/types/CalendarTypes'
import { CalendarEvent, ContextualizedEvent } from '@common/types/EventsTypes'
import { useMemo } from 'react'

export const useCreateContext = ({
  event,
  calendar,
  user
}: {
  event?: CalendarEvent
  calendar?: Calendar
  user?: userData
}): ContextualizedEvent | undefined => {
  return useMemo(() => {
    const isAbleToContextualize = event && calendar && user
    if (isAbleToContextualize) {
      return createEventContext(event, calendar, user)
    }
    return undefined
  }, [event, calendar, user])
}
