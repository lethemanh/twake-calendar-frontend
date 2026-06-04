import { OpenPaasUserData } from '@common/features/User/type/OpenPaasUserData'
import { getUserDetails } from '@common/features/User/userAPI'
import { toRejectedError } from '@common/utils/errorUtils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { calendarAction } from '@common/features/Calendars/CalendarDAO'
import { makeAddSharedCalendarBody } from '@common/features/Calendars/transformers'
import { CalendarInput } from '@common/features/Calendars/types/CalendarData'
import { RejectedError } from '@common/features/Calendars/types/RejectedError'

export const addSharedCalendarAsync = createAsyncThunk<
  {
    calId: string
    color: Record<string, string>
    link: string
    name: string
    desc: string
    owner: OpenPaasUserData
  },
  { userId: string; calId: string; cal: CalendarInput },
  { rejectValue: RejectedError }
>(
  'calendars/addSharedCalendar',
  async ({ userId, calId, cal }, { rejectWithValue }) => {
    try {
      const body = makeAddSharedCalendarBody(calId, cal)
      await calendarAction('POST', `/calendars/${userId}.json`, body)
      const ownerData = await getUserDetails(
        cal.cal._links.self.href
          .replace('/calendars/', '')
          .replace('.json', '')
          .split('/')[0]
      )

      return {
        calId: cal.cal._links.self?.href
          ?.replace('/calendars/', '')
          .replace('.json', ''),
        color: cal.color,
        link: `/calendars/${userId}/${calId}.json`,
        desc: cal.cal['caldav:description'] ?? '',
        name: cal.cal['dav:name'] ?? '',
        owner: ownerData
      }
    } catch (err) {
      return rejectWithValue(toRejectedError(err))
    }
  }
)
