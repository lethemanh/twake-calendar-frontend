import React from 'react'
import {
  styled,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemText
} from '@linagora/twake-mui'
import { useI18n } from 'twake-i18n'

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 100
}))

interface CalendarSelectorMobileMenuProps {
  open: boolean
  onClose: () => void
  onModify: () => void
  onDelete: () => void
  isDefault: boolean
  isPersonal: boolean
}

export const CalendarSelectorMobileMenu: React.FC<
  CalendarSelectorMobileMenuProps
> = ({ open, onClose, onModify, onDelete, isDefault, isPersonal }) => {
  const { t } = useI18n()

  return (
    <StyledSwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableAutoFocus
    >
      <List>
        <ListItemButton
          onClick={() => {
            onModify()
            onClose()
          }}
        >
          <ListItemText primary={t('actions.modify')} />
        </ListItemButton>
        {!isDefault && (
          <ListItemButton
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            <ListItemText
              primary={isPersonal ? t('actions.delete') : t('actions.remove')}
              slotProps={{
                primary: {
                  color: 'error.main'
                }
              }}
            />
          </ListItemButton>
        )}
      </List>
    </StyledSwipeableDrawer>
  )
}
