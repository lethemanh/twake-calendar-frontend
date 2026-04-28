import React from 'react'
import { Divider, Menu, MenuItem } from '@linagora/twake-mui'
import { useI18n } from 'twake-i18n'

interface CalendarSelectorDesktopMenuProps {
  id: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onModify: () => void
  onDelete: () => void
  isDefault: boolean
  isPersonal: boolean
}

export const CalendarSelectorDesktopMenu: React.FC<
  CalendarSelectorDesktopMenuProps
> = ({
  id,
  anchorEl,
  open,
  onClose,
  onModify,
  onDelete,
  isDefault,
  isPersonal
}) => {
  const { t } = useI18n()

  return (
    <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={() => {
          onModify()
          onClose()
        }}
      >
        {t('actions.modify')}
      </MenuItem>
      {!isDefault && <Divider />}
      {!isDefault && (
        <MenuItem
          onClick={() => {
            onDelete()
            onClose()
          }}
        >
          {isPersonal ? t('actions.delete') : t('actions.remove')}
        </MenuItem>
      )}
    </Menu>
  )
}
