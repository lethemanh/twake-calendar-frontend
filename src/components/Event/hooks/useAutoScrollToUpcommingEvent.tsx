import { useEffect, useRef } from 'react'

export const useAutoScrollToUpcommingEvent = (
  upcommingEventId: string | null | undefined
): void => {
  const hasScrolled = useRef<boolean>(false)

  useEffect(() => {
    if (!upcommingEventId || hasScrolled.current) {
      return
    }
    const timeoutId = setTimeout(() => {
      const el = document.querySelector(`[data-event-id="${upcommingEventId}"]`)
      if (!el) return
      hasScrolled.current = true
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return (): void => {
      clearTimeout(timeoutId)
      hasScrolled.current = false
    }
  }, [upcommingEventId])
}
