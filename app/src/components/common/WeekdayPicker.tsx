import './WeekdayPicker.css'

import { Button } from '@material-ui/core'
import React from 'react'

import { DayOfWeek, DaysOfWeek } from '../../reducers/Campsites'

interface Props {
   toggleSelectedDaysOfWeek(dayOfWeek: DayOfWeek): void
   daysOfWeek: DaysOfWeek
}

export default class WeekdayPicker extends React.PureComponent<Props> {
   public constructor(props: Props) {
      super(props)
   }

   public render = () => {
      return (
         <div className='weekdayGrid'>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.SUNDAY)}
               variant={this.props.daysOfWeek.sunday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               Su
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.MONDAY)}
               variant={this.props.daysOfWeek.monday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               M
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.TUESDAY)}
               variant={this.props.daysOfWeek.tuesday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               Tu
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.WEDNESDAY)}
               variant={this.props.daysOfWeek.wednesday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               W
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.THURSDAY)}
               variant={this.props.daysOfWeek.thursday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               Th
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.FRIDAY)}
               variant={this.props.daysOfWeek.friday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               F
            </Button>
            <Button
               onClick={() => this.props.toggleSelectedDaysOfWeek(DayOfWeek.SATURDAY)}
               variant={this.props.daysOfWeek.saturday ? "contained" : "outlined"}
               color='primary'
               className='weekdayButton'
            >
               Sa
            </Button>
         </div>
      )
   }
}
