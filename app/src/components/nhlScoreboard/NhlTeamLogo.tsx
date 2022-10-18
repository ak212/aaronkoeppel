import CardMedia from '@mui/material/CardMedia'
import React from 'react'

type Props = {
  size: 'large' | 'small'
  teamId: number
  teamName: string
}

export const NhlTeamLogo = ({ size, teamId, teamName }: Props) => {
  return (
    <CardMedia
      sx={{
        ...(size === 'large' && {
          '@media (min-width: 850px)': {
            width: 90,
            height: 70,
            margin: '0.25rem',
          },
          '@media (max-width: 849px)': {
            width: 80,
            height: 62,
            margin: '0.25rem',
          },
          '@media (max-width: 620px)': {
            width: 60,
            height: 46,
            margin: '0.25rem',
          },
        }),
        ...(size === 'small' && {
          width: 45,
          height: 34.5,
          margin: '0.25vh 1vw 0.25vh 1vw',
        }),
      }}
      component="img"
      image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`}
      title={`${teamName} Logo`}
    />
  )
}
