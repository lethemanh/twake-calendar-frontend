import { CalendarEvent } from '@common/types/EventsTypes'

export const useFetchEventDetail = (): CalendarEvent | undefined => {
  // This is a placeholder for the actual event fetching logic.
  // In a real implementation, you would replace this with an API call to fetch the event details.
  // TO DO: Implement actual fetching logic here in https://github.com/linagora/twake-calendar-frontend/issues/984.
  return {
    uid: '75b296d6-288a-4a7d-ab72-6eb3caea420d',
    calId: '5f50a663bdaffe002629099c',
    title: 'Onboarding',
    description: 'Onboarding session IT and compta',
    location: '37 Rue Pierre Poli, 92130 Issy-les-Moulineaux',
    x_openpass_videoconference: 'https://meet.jit.si/twake-onboarding',
    attendee: [
      {
        cal_address: 'benoittellier3@gmail.com',
        cn: 'Benoit Tellier 3',
        partstat: 'ACCEPTED',
        role: 'REQ-PARTICIPANT',
        cutype: 'INDIVIDUAL',
        rsvp: 'TRUE'
      },
      {
        cal_address: 'klaus.heisler@twake.com',
        cn: 'Klaus Heisler',
        partstat: 'DECLINED',
        role: 'REQ-PARTICIPANT',
        cutype: 'INDIVIDUAL',
        rsvp: 'FALSE'
      },
      {
        cal_address: 'meeting-room-1@twake.com',
        cn: 'Meeting Room 1',
        partstat: 'ACCEPTED',
        role: 'REQ-PARTICIPANT',
        cutype: 'RESOURCE',
        rsvp: 'FALSE'
      },
      {
        cal_address: 'benoittellier@gmail.com',
        cn: 'Benoit Tellier',
        partstat: 'ACCEPTED',
        role: 'CHAIR',
        cutype: 'INDIVIDUAL',
        rsvp: 'FALSE'
      }
    ],
    organizer: {
      cal_address: 'benoittellier@gmail.com',
      cn: 'Benoit Tellier'
    },
    start: '2026-04-22T10:00:00Z',
    end: '2026-04-22T10:30:00Z',
    timezone: 'Europe/Paris',
    URL: `/calendars/5f50a663bdaffe002629099c/${'75b296d6-288a-4a7d-ab72-6eb3caea420d'.split('/')[0]}.ics`
  }
}
