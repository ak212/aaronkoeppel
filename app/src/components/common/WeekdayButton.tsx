import Button from '@mui/material/Button'
import React from 'react'

interface Props {
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  variant: 'text' | 'outlined' | 'contained' | undefined
}

export const WeekdayButton = ({ label, onClick, variant }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color="primary"
      sx={{
        '@media (max-width: 900px)': {
          minWidth: '64px',
        },
        '@media (max-width: 600px)': {
          minWidth: '40px',
        },
        '@media (max-width: 400px)': {
          minWidth: '32px',
        },
      }}
    >
      {label}
    </Button>
  )
}
