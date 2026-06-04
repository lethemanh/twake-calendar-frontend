import { Calendar } from '@common/types/CalendarTypes'

export function getEffectiveEmail(
  calendar: Calendar | undefined,
  isWriteDelegated: boolean,
  userAddress: string | undefined
): string | undefined {
  return isWriteDelegated ? calendar?.owner?.emails?.[0] : userAddress
}
