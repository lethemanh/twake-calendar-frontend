import React from 'react'
import { Box, CircularProgress, Typography } from '@linagora/twake-mui'
import { useI18n } from 'twake-i18n'

export interface NoEventsContentProps {
  isPending: boolean
}

export const NoEventsContent: React.FC<NoEventsContentProps> = ({
  isPending
}) => {
  const { t } = useI18n()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}
    >
      {isPending ? (
        <CircularProgress size={24} />
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('event.noEventsToDisplay')}
        </Typography>
      )}
    </Box>
  )
}
