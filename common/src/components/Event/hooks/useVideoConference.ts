import { useAppSelector } from '@common/app/hooks'
import { generateMeetingLink } from '@common/utils/videoConferenceUtils'

interface UseVideoConferenceProps {
  description: string
  setDescription: (value: string) => void
  setHasVideoConference: (value: boolean) => void
  setMeetingLink: (value: string | null) => void
  showMore: boolean
  setShowDescription?: (value: boolean) => void
}

interface UseVideoConferenceReturn {
  handleAddVideoConference: () => void
  handleDeleteVideoConference: () => void
}

export const useVideoConference = ({
  setHasVideoConference,
  setMeetingLink,
  showMore,
  setShowDescription
}: UseVideoConferenceProps): UseVideoConferenceReturn => {
  const workplaceFqdn = useAppSelector(
    state => state.user.userData?.workplaceFqdn
  )
  const email = useAppSelector(state => state.user.userData?.email)

  const handleAddVideoConference = (): void => {
    const newMeetingLink = generateMeetingLink({
      localpart: email?.split('@')[0],
      workplaceFqdn
    })
    setHasVideoConference(true)
    setMeetingLink(newMeetingLink)
    if (showMore) {
      setShowDescription?.(true)
    }
  }

  const handleDeleteVideoConference = (): void => {
    setHasVideoConference(false)
    setMeetingLink(null)
  }

  return {
    handleAddVideoConference,
    handleDeleteVideoConference
  }
}
