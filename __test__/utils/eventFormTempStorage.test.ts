/**
 * @jest-environment jsdom
 */

import { Resource } from '@common/components/Attendees/types'
import {
  saveEventFormDataToTemp,
  restoreEventFormDataFromTemp,
  restoreFormDataFromTemp,
  EventFormTempData,
  EventFormSetters
} from '@common/utils/eventFormTempStorage'

describe('eventFormTempStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  const dummyFormData: EventFormTempData = {
    title: 'Meeting Room Reservation',
    description: 'Discussing project guidelines',
    location: 'Conference Room B',
    start: '2026-06-24T10:00:00Z',
    end: '2026-06-24T11:00:00Z',
    allday: false,
    repetition: { freq: 'NONE' },
    attendees: [],
    alarm: '15m',
    busy: 'busy',
    eventClass: 'PUBLIC',
    timezone: 'UTC',
    calendarid: 'cal-1',
    hasVideoConference: false,
    meetingLink: null,
    resources: [
      new Resource({
        displayName: 'Room B',
        email: 'roomb@example.com'
      })
    ]
  }

  it('restores resources as Resource instances with asJcal method from temp storage', () => {
    saveEventFormDataToTemp('create', dummyFormData)

    const restored = restoreEventFormDataFromTemp('create')
    expect(restored).not.toBeNull()
    expect(restored?.resources).toHaveLength(1)

    const resource = restored?.resources?.[0]
    expect(resource).toBeInstanceOf(Resource)
    expect(resource?.asJcal).toBeDefined()
    expect(resource?.asJcal?.()).toEqual([
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

  it('rehydrates resources to Resource instances when applying restoreFormDataFromTemp', () => {
    // Simulated plain-object data (as returned from sessionStorage prior to fix or from arbitrary JSON)
    const rawTempData: EventFormTempData = {
      ...dummyFormData,
      resources: [
        {
          displayName: 'Room B',
          email: 'roomb@example.com'
        } as Resource
      ]
    }

    const mockSetters: EventFormSetters = {
      setTitle: jest.fn(),
      setDescription: jest.fn(),
      setLocation: jest.fn(),
      setStart: jest.fn(),
      setEnd: jest.fn(),
      setAllDay: jest.fn(),
      setRepetition: jest.fn(),
      setAttendees: jest.fn(),
      setAlarm: jest.fn(),
      setBusy: jest.fn(),
      setEventClass: jest.fn(),
      setTimezone: jest.fn(),
      setCalendarid: jest.fn(),
      setHasVideoConference: jest.fn(),
      setMeetingLink: jest.fn(),
      setSelectedResources: jest.fn()
    }

    restoreFormDataFromTemp(rawTempData, mockSetters)

    expect(mockSetters.setSelectedResources).toHaveBeenCalledTimes(1)
    const passedResources = (mockSetters.setSelectedResources as jest.Mock).mock
      .calls[0][0] as Resource[]
    expect(passedResources).toHaveLength(1)
    expect(passedResources[0]).toBeInstanceOf(Resource)
    expect(passedResources[0].asJcal).toBeDefined()
    expect(passedResources[0].asJcal?.()).toEqual([
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
})
