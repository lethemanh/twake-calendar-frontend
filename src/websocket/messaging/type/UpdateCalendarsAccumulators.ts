import { AppDispatch } from '@/app/store'
import { Calendar } from '@/features/Calendars/CalendarTypes'
import { DebouncedFunc } from 'lodash'

export interface UpdateCalendarsAccumulators {
  calendarsToRefresh: Map<string, { calendar: Calendar; type?: 'temp' }>
  calendarsToHide: Set<string>
  shouldRefreshCalendarListRef: React.MutableRefObject<boolean>
  debouncedUpdateFns: Map<
    string,
    DebouncedFunc<(dispatch: AppDispatch) => void>
  >
  debouncedListUpdateFn?: DebouncedFunc<(dispatch: AppDispatch) => void>
  currentDebouncePeriod?: number
  delayedRefreshTimers?: Map<string, ReturnType<typeof setTimeout>>
}
