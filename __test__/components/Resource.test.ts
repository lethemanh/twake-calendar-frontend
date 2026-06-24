import { Resource } from '@common/components/Attendees/types'

describe('Resource Class', () => {
  it('returns undefined from asJcal if email is not present', () => {
    const resource = new Resource({
      displayName: 'Room A'
    })
    expect(resource.asJcal).toBeDefined()
    expect(resource.asJcal?.()).toBeUndefined()
  })

  it('returns VObjectProperty from asJcal if email is present', () => {
    const resource = new Resource({
      displayName: 'Room B',
      email: 'roomb@example.com'
    })
    expect(resource.asJcal).toBeDefined()
    const result = resource.asJcal?.()
    expect(result).toEqual([
      'attendee',
      {
        cutype: 'RESOURCE',
        partstat: 'NEEDS-ACTION',
        rsvp: 'TRUE',
        role: 'REQ-PARTICIPANT',
        cn: 'Room B'
      },
      'cal-address',
      'mailto:roomb@example.com'
    ])
  })

  it('preserves existing mailto prefix if already present in email', () => {
    const resource = new Resource({
      displayName: 'Room C',
      email: 'mailto:roomc@example.com'
    })
    expect(resource.asJcal).toBeDefined()
    const result = resource.asJcal?.()
    expect(result).toEqual([
      'attendee',
      {
        cutype: 'RESOURCE',
        partstat: 'NEEDS-ACTION',
        rsvp: 'TRUE',
        role: 'REQ-PARTICIPANT',
        cn: 'Room C'
      },
      'cal-address',
      'mailto:roomc@example.com'
    ])
  })
})
