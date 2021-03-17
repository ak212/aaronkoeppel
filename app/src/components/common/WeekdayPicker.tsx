import './WeekdayPicker.css'

import { Button } from '@material-ui/core'
import React from 'react'

import { DayOfWeek, DaysOfWeek } from '../../reducers/Campsites'

interface Props {
  toggleSelectedDaysOfWeek(dayOfWeek: DayOfWeek): void
  daysOfWeek: DaysOfWeek
}

export const WeekdayPicker = (props: Props) => {
  return (
    <div className="weekdayGrid">
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.SUNDAY)}
        variant={props.daysOfWeek.sunday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        Su
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.MONDAY)}
        variant={props.daysOfWeek.monday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        M
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.TUESDAY)}
        variant={props.daysOfWeek.tuesday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        Tu
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.WEDNESDAY)}
        variant={props.daysOfWeek.wednesday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        W
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.THURSDAY)}
        variant={props.daysOfWeek.thursday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        Th
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.FRIDAY)}
        variant={props.daysOfWeek.friday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        F
      </Button>
      <Button
        onClick={() => props.toggleSelectedDaysOfWeek(DayOfWeek.SATURDAY)}
        variant={props.daysOfWeek.saturday ? 'contained' : 'outlined'}
        color="primary"
        className="weekdayButton"
      >
        Sa
      </Button>
    </div>
  )
}
