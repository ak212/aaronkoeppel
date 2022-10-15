import { Box } from '@mui/material'
import React from 'react'

import { DayOfWeek, DaysOfWeek } from '../../store/campsites'
import { WeekdayButton } from './WeekdayButton'

interface Props {
  daysOfWeek: DaysOfWeek
  toggleSelectedDaysOfWeek(dayOfWeek: DayOfWeek): void
}

export const WeekdayPicker = ({ daysOfWeek, toggleSelectedDaysOfWeek }: Props) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: '1vw',
        paddingTop: '2vh',
        '@media (max-width: 900px)': {
          gridTemplateColumns: '5vw 5vw 5vw 5vw 5vw 5vw 5vw',
          gridGap: '4vw',
        },
        '@media (max-width: 600px)': {
          gridTemplateColumns: '5vw 5vw 5vw 5vw 5vw 5vw 5vw',
          gridGap: '5vw',
        },
        '@media (max-width: 400px)': {
          gridTemplateColumns: '5vw 5vw 5vw 5vw 5vw 5vw 5vw',
          gridGap: '6vw',
        },
        '@media (min-width: 901px)': {
          gridTemplateColumns: '6vw 6vw 6vw 6vw 6vw 6vw 6vw',
        },
      }}
    >
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.SUNDAY)}
        variant={daysOfWeek.sunday ? 'contained' : 'outlined'}
        label={'Su'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.MONDAY)}
        variant={daysOfWeek.sunday ? 'contained' : 'outlined'}
        label={'M'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.TUESDAY)}
        variant={daysOfWeek.tuesday ? 'contained' : 'outlined'}
        label={'Tu'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.WEDNESDAY)}
        variant={daysOfWeek.wednesday ? 'contained' : 'outlined'}
        label={'W'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.THURSDAY)}
        variant={daysOfWeek.thursday ? 'contained' : 'outlined'}
        label={'Th'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.FRIDAY)}
        variant={daysOfWeek.friday ? 'contained' : 'outlined'}
        label={'F'}
      />
      <WeekdayButton
        onClick={() => toggleSelectedDaysOfWeek(DayOfWeek.SATURDAY)}
        variant={daysOfWeek.saturday ? 'contained' : 'outlined'}
        label={'Sa'}
      />
    </Box>
  )
}
