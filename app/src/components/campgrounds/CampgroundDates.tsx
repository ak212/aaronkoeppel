import './Campsites.css'
import 'date-fns'

import DateFnsUtils from '@date-io/date-fns'
import { Button } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import moment from 'moment'
import React from 'react'

import { DayOfWeek, DaysOfWeek } from '../../reducers/Campsites'
import { WeekdayPicker } from '../common/WeekdayPicker'

interface DateProps {
  startDate?: number
  endDate?: number
  advancedDate: boolean
  daysOfWeek: DaysOfWeek

  toggleSelectedDaysOfWeek(dayOfWeek: DayOfWeek): void
  handleStartDateChange(date: MaterialUiPickersDate, value?: string | null | undefined): void
  handleEndDateChange(date: MaterialUiPickersDate, value?: string | null | undefined): void
  advancedToggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export const CampgroundDates = (props: DateProps) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="dateRow">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          className="date-picker"
          id="date-picker"
          label="Start Date"
          minDate={moment()}
          maxDate={moment(props.startDate).add(3, 'months')}
          value={props.startDate}
          onChange={props.handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          className="date-picker"
          id="date-picker"
          label="End Date"
          minDate={moment().add(1, 'days')}
          maxDate={moment(props.startDate).add(28, 'days')}
          value={props.endDate}
          onChange={props.handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
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
    </MuiPickersUtilsProvider>
  )
}
