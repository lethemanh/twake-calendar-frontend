import { User } from '@/components/Attendees/types'
import {
  CalendarData,
  CalendarInput
} from '@/features/Calendars/types/CalendarData'

export interface CalendarWithOwner {
  cal: CalendarData
  owner: User
}

export interface SearchCalendarsDialogProps {
  objectTypes: string[]
  open: boolean
  selectedUsers: User[]
  onChange: (_event: React.SyntheticEvent, value: User[]) => Promise<void>
  onClose: () => void
  onCloseRegister: () => void
}

export interface SearchState {
  query?: string
  options?: User[]
  loading?: boolean
}

export interface SplittedSearchInputProps extends Omit<
  SearchCalendarsDialogProps,
  'open' | 'onClose' | 'onCloseRegister'
> {
  searchState: SearchState
  onSearchChange: ({ query, options, loading }: SearchState) => void
}

export type ResourceCal = Omit<CalendarInput, 'owner'> & {
  owner?: Omit<User, 'email'> & {
    email?: string
  }
}
