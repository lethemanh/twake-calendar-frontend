import {
  browserDefaultTimeZone,
  getTimezoneOffset,
  resolveTimezone
} from '@common/utils/timezone'
import { TIMEZONES } from '@common/utils/timezone-data'
import { useMemo } from 'react'

export function useTimeZoneList(): {
  zones: string[]
  browserTz: string
  getTimezoneOffset: (tzName: string, date?: Date) => string
} {
  return useMemo(() => {
    const zones = Object.keys(TIMEZONES.zones).sort()
    const browserTz = resolveTimezone(browserDefaultTimeZone)

    return { zones, browserTz, getTimezoneOffset }
  }, [])
}
