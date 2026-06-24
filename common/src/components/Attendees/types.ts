import { VObjectProperty } from '@common/features/Calendars/types/CalendarData'

export interface User {
  email: string
  displayName: string
  avatarUrl?: string
  openpaasId?: string
  color?: Record<string, string>
  objectType?: string
}

export class Resource {
  email?: string
  displayName: string
  avatarUrl?: string
  openpaasId?: string
  color?: Record<string, string>

  constructor(data: Partial<Resource> = {}) {
    this.email = data.email
    this.displayName = data.displayName ?? ''
    this.avatarUrl = data.avatarUrl
    this.openpaasId = data.openpaasId
    this.color = data.color
  }

  asJcal? = (): VObjectProperty | undefined => {
    if (!this.email) {
      return undefined
    }
    const params: Record<string, string> = {
      cutype: 'RESOURCE',
      partstat: 'NEEDS-ACTION',
      rsvp: 'TRUE',
      role: 'REQ-PARTICIPANT'
    }
    if (this.displayName) {
      params.cn = this.displayName
    }
    return [
      'attendee',
      params,
      'cal-address',
      `mailto:${this.email.replace(/^mailto:/i, '')}`
    ]
  }
}
