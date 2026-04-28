import React from 'react'
import { useScreenSizeDetection } from '@/useScreenSizeDetection'
import { CalendarSelectorDesktopMenu } from './CalendarSelectorDesktopMenu'
import { CalendarSelectorMobileMenu } from './CalendarSelectorMobileMenu'

interface CalendarSelectorMenuProps {
  id: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onModify: () => void
  onDelete: () => void
  isDefault: boolean
  isPersonal: boolean
}

export const CalendarSelectorMenu: React.FC<CalendarSelectorMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  onModify,
  onDelete,
  isDefault,
  isPersonal
}) => {
  const { isTooSmall: isMobile } = useScreenSizeDetection()

  if (!isMobile) {
    return (
      <CalendarSelectorDesktopMenu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onModify={onModify}
        onDelete={onDelete}
        isDefault={isDefault}
        isPersonal={isPersonal}
      />
    )
  }

  return (
    <CalendarSelectorMobileMenu
      open={open}
      onClose={onClose}
      onModify={onModify}
      onDelete={onDelete}
      isDefault={isDefault}
      isPersonal={isPersonal}
    />
  )
}
