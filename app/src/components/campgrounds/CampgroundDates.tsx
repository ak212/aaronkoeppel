import add from 'date-fns/add'
import toDate from 'date-fns/toDate'

import { Box, Button, TextField } from '@mui/material'
import React from 'react'

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DayOfWeek, DaysOfWeek } from '../../store/campsites'
import { WeekdayPicker } from '../common/WeekdayPicker'

interface DateProps {
  startDate?: number
  endDate?: number
  advancedDate: boolean
  daysOfWeek: DaysOfWeek

  toggleSelectedDaysOfWeek(dayOfWeek: DayOfWeek): void
  handleStartDateChange(date: Date | null, value?: string | null | undefined): void
  handleEndDateChange(date: Date | null, value?: string | null | undefined): void
  advancedToggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export const CampgroundDates = (props: DateProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          paddingBottom: '2vh',
          '@media (min-width: 901px)': {
            gridTemplateColumns: '20vw 20vw 10vw',
          },
          '@media (max-width: 900px)': {
            gridGap: '2vh',
          },
        }}
      >
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          label="Start Date"
          minDate={new Date()}
          maxDate={props.startDate ? add(toDate(props.startDate), { months: 3 }) : undefined}
          value={props.startDate}
          onChange={props.handleStartDateChange}
          renderInput={params => (
            <TextField
              {...params}
              sx={{
                maxWidth: '300px',
                label: { color: '#1976d2' },
                input: { color: 'white' },
                svg: { color: '#1976d2' },
              }}
            />
          )}
        />
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          label="End Date"
          minDate={add(new Date(), { days: 1 })}
          maxDate={props.startDate ? add(toDate(props.startDate), { weeks: 4 }) : undefined}
          value={props.endDate}
          onChange={props.handleEndDateChange}
          renderInput={params => (
            <TextField
              {...params}
              sx={{
                maxWidth: '300px',
                label: { color: '#1976d2' },
                input: { color: 'white' },
                svg: { color: '#1976d2' },
              }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={props.advancedToggle}
          style={{ height: '48px', maxWidth: '30vw' }}
        >
          Advanced
        </Button>
        {props.advancedDate && (
          <WeekdayPicker daysOfWeek={props.daysOfWeek} toggleSelectedDaysOfWeek={props.toggleSelectedDaysOfWeek} />
        )}
      </Box>
    </LocalizationProvider>
  )
}
