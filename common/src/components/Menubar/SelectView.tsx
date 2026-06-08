import { FormControl, MenuItem, Select } from '@linagora/twake-mui'
import { useI18n } from 'twake-i18n'
import { CALENDAR_VIEWS } from '@common/components/Calendar/utils/constants'

export const SelectView: React.FC<{
  currentView: string
  onViewChange: (view: string) => void
}> = ({ currentView, onViewChange }) => {
  const { t } = useI18n()
  return (
    <FormControl
      size="small"
      style={{ minWidth: 120, marginRight: 16 }}
      className="select-display"
    >
      <Select
        value={currentView}
        onChange={e => onViewChange(e.target.value)}
        variant="outlined"
        aria-label={t('menubar.viewSelector')}
        sx={{
          borderRadius: '12px',
          marginLeft: 1,
          '& fieldset': { borderRadius: '12px' }
        }}
      >
        <MenuItem value={CALENDAR_VIEWS.dayGridMonth}>
          {t('menubar.views.month')}
        </MenuItem>
        <MenuItem value={CALENDAR_VIEWS.timeGridWeek}>
          {t('menubar.views.week')}
        </MenuItem>
        <MenuItem value={CALENDAR_VIEWS.timeGridDay}>
          {t('menubar.views.day')}
        </MenuItem>
        <MenuItem value={CALENDAR_VIEWS.listWeek}>
          {t('menubar.views.schedule')}
        </MenuItem>
      </Select>
    </FormControl>
  )
}
