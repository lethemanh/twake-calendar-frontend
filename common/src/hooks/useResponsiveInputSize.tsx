import { useScreenSizeDetection } from '@common/useScreenSizeDetection'

export const useResponsiveInputSize = (): 'small' | 'medium' => {
  const { isTooSmall: isMobile } = useScreenSizeDetection()
  return isMobile ? 'medium' : 'small'
}
