import { useState, useEffect, useRef } from 'react'
import { fetchEvent } from '../EventDao'
import { CalendarEvent } from '@common/types/EventsTypes'

export const useRsvpAction = (
  action: string | undefined,
  event: CalendarEvent | undefined,
  setSearchParams: (params: Record<string, string>) => void
): {
  toastOpen: boolean
  setToastOpen: (open: boolean) => void
  handleRsvpChoice: (url: string) => Promise<void>
} => {
  const [toastOpen, setToastOpen] = useState(false)
  const initialActionShown = useRef(false)

  useEffect(() => {
    if (!action) return
    if (!event) return
    if (initialActionShown.current) return

    const init = (): void => {
      setToastOpen(true)
      initialActionShown.current = true
    }
    init()
    return (): void => {
      initialActionShown.current = false
    }
  }, [action, event])

  const handleRsvpChoice = async (url: string): Promise<void> => {
    try {
      const urlObj = new URL(url)
      const newJwt = urlObj.searchParams.get('jwt')
      if (newJwt) {
        await fetchEvent(newJwt)
        setSearchParams({ jwt: newJwt })
        setToastOpen(true)
      }
    } catch (e) {
      console.error('Failed to process RSVP choice:', e)
    }
  }

  return { toastOpen, setToastOpen, handleRsvpChoice }
}
