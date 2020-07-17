import './Campsites.css'
import 'date-fns'

import DateFnsUtils from '@date-io/date-fns'
import {
   Button,
   Link,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField,
   Typography
} from '@material-ui/core'
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete'
import Skeleton from '@material-ui/lab/Skeleton'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { range, startCase, uniqueId } from 'lodash'
import moment from 'moment'
import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'

import {
   Campground,
   campsiteActions,
   campsitesSelectors,
   DayOfWeek,
   DaysOfWeek,
   EntityType,
   entityTypeToString,
   initialDaysOfWeek,
   RecreationArea,
   ReservationStatus,
   showDayOfWeek
} from '../reducers/Campsites'
import { loadingSelectors } from '../reducers/Loading'
import { State as RootState } from '../reducers/Root'
import WeekdayPicker from './common/WeekdayPicker'

interface State {
   autoCompleteText: string
   selectedRecArea?: RecreationArea
   startDate?: number
   endDate?: number
   advancedDate: boolean
   daysOfWeek: DaysOfWeek
}

interface Props {
   autocompleteValues: RecreationArea[]
   campgrounds: Campground[]
   loading: boolean
   getCampsites(entity_id: string): void
   getCampsiteAvailability(recreationArea: RecreationArea, startDate: number, endDate: number): void
   getAutoComplete(query: string): void
}

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

const CampgroundDates: React.FunctionComponent<DateProps> = (props: DateProps) => {
   return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <div className='dateRow'>
            <KeyboardDatePicker
               disableToolbar
               variant='inline'
               format='MM/dd/yyyy'
               margin='normal'
               className='date-picker'
               id='date-picker'
               label='Start Date'
               minDate={moment()}
               maxDate={moment(props.startDate).add(3, "months")}
               value={props.startDate}
               onChange={props.handleStartDateChange}
               KeyboardButtonProps={{
                  "aria-label": "change date"
               }}
            />
            <KeyboardDatePicker
               disableToolbar
               variant='inline'
               format='MM/dd/yyyy'
               margin='normal'
               className='date-picker'
               id='date-picker'
               label='End Date'
               minDate={moment().add(1, "days")}
               maxDate={moment(props.startDate).add(28, "days")}
               value={props.endDate}
               onChange={props.handleEndDateChange}
               KeyboardButtonProps={{
                  "aria-label": "change date"
               }}
            />
            <Button
               variant='contained'
               color='primary'
               onClick={props.advancedToggle}
               style={{ height: "48px", maxWidth: "30vw" }}
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

export default class Campsites extends React.PureComponent<Props, State> {
   public constructor(props: Props) {
      super(props)

      this.state = {
         autoCompleteText: "",
         startDate: Date.now(),
         endDate: moment(Date.now()).add(1, "days").toDate().valueOf(),
         advancedDate: false,
         daysOfWeek: initialDaysOfWeek
      }
   }

   private getCampsitesOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (this.state.selectedRecArea !== undefined && this.state.startDate && this.state.endDate) {
         this.props.getCampsiteAvailability(this.state.selectedRecArea, this.state.startDate, this.state.endDate)
      }
   }

   private onInputChange = (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
      this.setState({
         autoCompleteText: value,
         selectedRecArea: this.props.autocompleteValues.find((ra) => ra.name.toLowerCase() === value.toLowerCase())
      })
      this.props.getAutoComplete(value)
   }

   private toggleSelectedDaysOfWeek = (dayOfWeek: DayOfWeek) => {
      this.setState((prevState) => {
         let daysOfWeek = prevState.daysOfWeek
         switch (dayOfWeek) {
            case DayOfWeek.SUNDAY:
               daysOfWeek = { ...daysOfWeek, sunday: !daysOfWeek.sunday }
               break
            case DayOfWeek.MONDAY:
               daysOfWeek = { ...daysOfWeek, monday: !daysOfWeek.monday }
               break
            case DayOfWeek.TUESDAY:
               daysOfWeek = { ...daysOfWeek, tuesday: !daysOfWeek.tuesday }
               break
            case DayOfWeek.WEDNESDAY:
               daysOfWeek = { ...daysOfWeek, wednesday: !daysOfWeek.wednesday }
               break
            case DayOfWeek.THURSDAY:
               daysOfWeek = { ...daysOfWeek, thursday: !daysOfWeek.thursday }
               break
            case DayOfWeek.FRIDAY:
               daysOfWeek = { ...daysOfWeek, friday: !daysOfWeek.friday }
               break
            case DayOfWeek.SATURDAY:
               daysOfWeek = { ...daysOfWeek, saturday: !daysOfWeek.saturday }
               break
            default:
               break
         }

         return { daysOfWeek }
      })
   }

   private shouldGetAvailability = (startDate: number | undefined, endDate: number | undefined) => {
      if (this.props.campgrounds.length > 0 && this.props.campgrounds[0].campsites && startDate && endDate) {
         const startMonth = moment(startDate).get("month")
         const endMonth = moment(endDate).get("month")
         /* Adding another +1 to endMonth because range is not inclusive */
         let monthRange = range(startMonth, endMonth + 1)
         const statusMap: Map<string, ReservationStatus> = new Map(
            Object.entries(this.props.campgrounds[0].campsites[0].availabilities)
         )
         for (const key of statusMap.keys()) {
            monthRange = monthRange.filter((month) => month !== moment(key).get("month"))
         }

         if (this.state.selectedRecArea !== undefined && monthRange.length > 0) {
            startDate = moment(startDate).set("month", monthRange[0]).valueOf()
            endDate = moment(endDate)
               .set("month", monthRange[monthRange.length - 1])
               .valueOf()
            this.props.getCampsiteAvailability(this.state.selectedRecArea, startDate, endDate)
         }
      }
   }

   private handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      // TODO check if the startdate is in the set of available dates if there are availability results
      let startDate: number | undefined
      let endDate: number | undefined
      if (this.state.endDate && date && moment(date).isSameOrAfter(this.state.endDate, "day")) {
         startDate = date.valueOf()
         endDate = moment(date).add(1, "days").toDate().valueOf()
         this.setState({ startDate, endDate })
      } else {
         startDate = (date && date.valueOf()) || undefined
         endDate = this.state.endDate
         this.setState({ startDate })
      }
      this.shouldGetAvailability(startDate, endDate)
   }

   private handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      if (this.state.startDate && date && moment(date).isSameOrBefore(this.state.startDate, "day")) {
         this.setState({ startDate: date.valueOf() })
      } else {
         this.setState({ endDate: (date && date.valueOf()) || undefined })
      }
   }

   private advancedToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      this.setState((prevState) => {
         return {
            advancedDate: !prevState.advancedDate
         }
      })
   }

   private getDates = (): string[] => {
      const days: string[] = []
      for (let d = this.state.startDate!; d < this.state.endDate!; d = moment(d).add(1, "days").toDate().valueOf()) {
         days.push(moment(d).format("YYYY-MM-DD").concat("T00:00:00Z"))
      }

      return days
   }

   private campsitesAvailabilityRange = (campground: Campground): Map<string, number> => {
      const days: string[] = this.getDates()
      const availabilities: Map<string, number> = new Map()
      for (const day of days) {
         let avail: number = 0
         if (campground.campsites) {
            for (const campsite of campground.campsites) {
               const statusMap: Map<string, ReservationStatus> = new Map(Object.entries(campsite.availabilities))
               if (statusMap.get(day) === ReservationStatus.AVAILABLE) {
                  avail += 1
               }
            }
         }
         availabilities.set(moment(day.replace("T00:00:00Z", "")).format("DD MMM YYYY"), avail)
      }
      return availabilities
   }

   private campgroundAvailabilityTable = (campgrounds: Campground[]) => {
      if (this.props.loading) {
         return <Skeleton variant='rect' className='campgroundTable' height={`${33 * (campgrounds.length + 1)}px`} />
      } else if (this.props.campgrounds.length > 0) {
         return (
            <TableContainer component={Paper} className='campgroundTable'>
               <Table size='small'>
                  <TableHead>
                     <TableRow>
                        <TableCell>Campground</TableCell>
                        {this.getDates()
                           .filter((date) => {
                              return this.state.advancedDate
                                 ? showDayOfWeek(this.state.daysOfWeek, moment(date).day())
                                 : true
                           })
                           .map((date) => (
                              <TableCell key={uniqueId()}>
                                 {moment(date.replace("T00:00:00Z", "")).format("DD MMM YYYY")}
                              </TableCell>
                           ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {campgrounds.map((campground) => {
                        const campgroundAvailability: Map<string, number> = this.campsitesAvailabilityRange(campground)
                        if (this.state.advancedDate) {
                           for (let k of campgroundAvailability.keys()) {
                              if (!showDayOfWeek(this.state.daysOfWeek, moment(k).day())) {
                                 campgroundAvailability.delete(k)
                              }
                           }
                        }
                        return (
                           <TableRow key={uniqueId()}>
                              <TableCell component='th' scope='row'>
                                 <Typography>
                                    <Link
                                       href={`https://www.recreation.gov/camping/campgrounds/${campground.facility_id}`}
                                       target='_blank'
                                       color='inherit'
                                    >
                                       {startCase(campground.facility_name.toLowerCase())}
                                    </Link>
                                 </Typography>
                              </TableCell>

                              {Array.from(campgroundAvailability.values()).map((available) => (
                                 <TableCell key={uniqueId()}>
                                    {campground.campsites ? `${available}/${campground.campsites.length}` : "Lottery"}
                                 </TableCell>
                              ))}
                           </TableRow>
                        )
                     })}
                  </TableBody>
               </Table>
            </TableContainer>
         )
      } else {
         return undefined
      }
   }

   public render = () => {
      return (
         <div>
            <div className='interactive'>
               <Autocomplete
                  freeSolo
                  id='recreation-areas'
                  options={this.props.autocompleteValues
                     .filter((ra) => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1)
                     .map((option) => startCase(option.name.toLowerCase()))}
                  onInputChange={this.onInputChange}
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        label='Search Recreation Areas'
                        margin='normal'
                        variant='outlined'
                        InputProps={{ ...params.InputProps, type: "search" }}
                        value={this.state.autoCompleteText}
                        className='interactive'
                     />
                  )}
               />
               {this.state.selectedRecArea ? entityTypeToString(this.state.selectedRecArea.entity_type) : undefined}
               <CampgroundDates
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  advancedDate={this.state.advancedDate}
                  daysOfWeek={this.state.daysOfWeek}
                  handleStartDateChange={this.handleStartDateChange}
                  handleEndDateChange={this.handleEndDateChange}
                  advancedToggle={this.advancedToggle}
                  toggleSelectedDaysOfWeek={this.toggleSelectedDaysOfWeek}
               />
               <Button
                  variant='contained'
                  color='primary'
                  disabled={this.state.selectedRecArea === undefined}
                  onClick={this.getCampsitesOnClick}
               >
                  Get campsites
               </Button>
               {this.campgroundAvailabilityTable(
                  this.props.campgrounds.sort((a: Campground, b: Campground) =>
                     a.facility_name > b.facility_name ? 1 : -1
                  )
               )}
            </div>
         </div>
      )
   }
}

const mapStateToProps = (state: RootState) => ({
   autocompleteValues: campsitesSelectors.getAutocomplete(state),
   campgrounds: campsitesSelectors.getCampgrounds(state),
   loading: loadingSelectors.getCampsiteLoading(state)
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
   getCampsites(entity_id: string) {
      dispatch(campsiteActions.getCampsites(entity_id))
   },
   getCampsiteAvailability(recreationArea: RecreationArea, startDate: number, endDate: number) {
      dispatch(campsiteActions.getCampgroundAvailability(recreationArea, startDate, endDate))
   },
   getAutoComplete(name: string) {
      dispatch(campsiteActions.getAutocomplete(name))
   }
})

export const ConnectedCampsites = connect(mapStateToProps, mapDispatchToProps)(Campsites)
