import {
  RepetitionRule,
  VObjectProperty
} from '@common/features/Calendars/types/CalendarData'
import { formatUntilForRRule } from '@common/features/Events/utils/formatDateToICal'

export interface RepetitionData {
  freq: string
  interval?: number | null
  byday?: string[] | null
  occurrences?: number | null
  endDate?: string | null
  wkst?: string | null
  allday?: boolean
  timezone?: string
}

export type RepetitionOptions = Partial<RepetitionData>

export class RepetitionObject implements RepetitionData {
  freq: string
  interval?: number | null
  byday?: string[] | null
  occurrences?: number | null
  endDate?: string | null
  wkst?: string | null
  allday?: boolean
  timezone?: string

  constructor({
    freq,
    interval,
    byday,
    occurrences,
    endDate,
    wkst,
    allday,
    timezone
  }: RepetitionOptions = {}) {
    this.freq = freq ?? ''
    this.interval = interval
    this.byday = byday
    this.occurrences = occurrences
    this.endDate = endDate
    this.wkst = wkst
    this.allday = allday
    this.timezone = timezone
  }

  asJcal(): VObjectProperty {
    const repetitionRule: RepetitionRule = { freq: this.freq }
    if (this.interval != null) {
      repetitionRule.interval = this.interval
    }
    if (this.occurrences != null) {
      repetitionRule.count = this.occurrences
    }
    if (this.endDate) {
      repetitionRule.until = formatUntilForRRule(
        this.endDate,
        this.allday ?? false,
        this.timezone ?? 'UTC'
      )
    }
    if (this.byday !== null && this.byday !== undefined) {
      repetitionRule.byday = this.byday
    }
    if (this.wkst) {
      repetitionRule.wkst = this.wkst
    }
    return ['rrule', {}, 'recur', repetitionRule]
  }
}
