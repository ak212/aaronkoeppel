import add from 'date-fns/add'
import toDate from 'date-fns/toDate'
import './Campsites.css'

import { Button, TextField } from '@mui/material'
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
      <div className="dateRow">
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          className="date-picker"
          label="Start Date"
          minDate={new Date()}
          maxDate={props.startDate ? add(toDate(props.startDate), { months: 3 }) : undefined}
          value={props.startDate}
          onChange={props.handleStartDateChange}
          renderInput={params => <TextField {...params} />}
        />
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          className="date-picker"
          label="End Date"
          minDate={add(new Date(), { days: 1 })}
          maxDate={props.startDate ? add(toDate(props.startDate), { weeks: 4 }) : undefined}
          value={props.endDate}
          onChange={props.handleEndDateChange}
          renderInput={params => <TextField {...params} />}
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
      </div>
    </LocalizationProvider>
  )
}
