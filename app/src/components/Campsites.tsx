import './Campsites.css'
import 'date-fns'

import DateFnsUtils from '@date-io/date-fns'
import {
   Button,
   Chip,
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
import Autocomplete from '@material-ui/lab/Autocomplete'
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
   initialDaysOfWeek,
   isRecreationArea,
   RecreationArea,
   ReservationStatus,
   ReservationType,
   showDayOfWeek
} from '../reducers/Campsites'
import { loadingSelectors } from '../reducers/Loading'
import { State as RootState } from '../reducers/Root'
import CampgroundMap from './CampgroundMap'
import WeekdayPicker from './common/WeekdayPicker'
import { CampgroundIcon } from './icons/CampgroundIcon'
import { RecreationAreaIcon } from './icons/RecreationAreaIcon'

interface State {
   autoCompleteText: string
   selectedRecAreas: RecreationArea[]
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
   getCampsiteAvailability(recreationAreas: RecreationArea[], startDate: number, endDate: number): void
   getAutoComplete(query: string): void
   setRecreationAreas(recAreas: RecreationArea[]): void
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

/*  */
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

class Campsites extends React.PureComponent<Props, State> {
   public constructor(props: Props) {
      super(props)

      this.state = {
         advancedDate: false,
         autoCompleteText: "",
         daysOfWeek: initialDaysOfWeek,
         endDate: moment(Date.now()).add(1, "days").toDate().valueOf(),
         selectedRecAreas: [],
         startDate: Date.now()
      }
   }

   private getCampsitesOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (this.state.startDate && this.state.endDate) {
         this.props.getCampsiteAvailability(this.state.selectedRecAreas, this.state.startDate, this.state.endDate)
      }
   }

   private onInputChange = (event: React.ChangeEvent<{}>, value: string) => {
      this.setState({ autoCompleteText: value })
      this.props.getAutoComplete(value)
   }

   private onChange = (event: React.ChangeEvent<{}>, value: (string | RecreationArea)[]) => {
      if (value.every((val) => isRecreationArea(val)) || value.length === 0) {
         this.props.setRecreationAreas(value as RecreationArea[])
         this.setState({ selectedRecAreas: value as RecreationArea[] })
      }
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
         for (const key of Array.from(statusMap.keys())) {
            monthRange = monthRange.filter((month) => month !== moment(key).get("month"))
         }

         if (this.state.selectedRecAreas !== undefined && monthRange.length > 0) {
            startDate = moment(startDate).set("month", monthRange[0]).valueOf()
            endDate = moment(endDate)
               .set("month", monthRange[monthRange.length - 1])
               .valueOf()
            this.props.getCampsiteAvailability(this.state.selectedRecAreas, startDate, endDate)
         }
      }
   }

   private handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      let startDate: number | undefined
      let endDate: number | undefined = this.state.endDate
      if (this.state.endDate && date && moment(date).isSameOrAfter(this.state.endDate, "day")) {
         startDate = date.valueOf()
         endDate = moment(date).add(1, "days").toDate().valueOf()
         this.setState({ startDate, endDate })
      } else {
         startDate = (date && date.valueOf()) || undefined
         this.setState({ startDate })
      }
      this.shouldGetAvailability(startDate, endDate)
   }

   private handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      let startDate: number | undefined = this.state.startDate
      let endDate: number | undefined = this.state.endDate
      if (this.state.startDate && date && moment(date).isSameOrBefore(this.state.startDate, "day")) {
         startDate = date.valueOf()
         this.setState({ startDate })
      } else {
         endDate = (date && date.valueOf()) || undefined
         this.setState({ endDate })
      }
      this.shouldGetAvailability(startDate, endDate)
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

   private campgroundToTableRow = (campground: Campground) => {
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
                  {campground.campsites
                     ? campground.campsites.length === 0
                        ? "Unavailable"
                        : campground.facility_type === ReservationType.CAMPING_LOTTERY
                        ? "Lottery"
                        : `${available}/${campground.campsites.length}`
                     : "Unknown"}
               </TableCell>
            ))}
         </TableRow>
      )
   }

   private campgroundAvailabilityTable = (campgrounds: Campground[]) => {
      if (this.props.loading) {
         return <Skeleton variant='rect' className='campgroundTable' height={`${33 * (campgrounds.length + 1)}px`} />
      } else if (campgrounds.length > 0) {
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
                  <TableBody>{campgrounds.map(this.campgroundToTableRow)}</TableBody>
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
                  multiple
                  freeSolo
                  limitTags={4}
                  id='recreation-areas'
                  options={this.props.autocompleteValues.filter(
                     (ra) => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1
                  )}
                  getOptionLabel={(option) => startCase(option.name.toLowerCase())}
                  onInputChange={this.onInputChange}
                  value={this.state.selectedRecAreas}
                  onChange={this.onChange}
                  renderTags={(value: RecreationArea[], getTagProps) =>
                     value.map((recArea: RecreationArea, index: number) => (
                        <Chip
                           variant='outlined'
                           label={startCase(recArea.name.toLowerCase())}
                           icon={
                              recArea.entity_type === EntityType.REC_AREA ? <RecreationAreaIcon /> : <CampgroundIcon />
                           }
                           {...getTagProps({ index })}
                           color='primary'
                        />
                     ))
                  }
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
                  disabled={this.state.selectedRecAreas.length === 0}
                  onClick={this.getCampsitesOnClick}
               >
                  Get campsites
               </Button>
               {this.campgroundAvailabilityTable(
                  this.props.campgrounds.sort((a: Campground, b: Campground) =>
                     a.facility_name > b.facility_name ? 1 : -1
                  )
               )}
               <CampgroundMap campgrounds={this.props.campgrounds} />
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
   getCampsiteAvailability(recreationAreas: RecreationArea[], startDate: number, endDate: number) {
      dispatch(campsiteActions.getCampgroundAvailability(recreationAreas, startDate, endDate))
   },
   getAutoComplete(name: string) {
      dispatch(campsiteActions.getAutocomplete(name))
   },
   setRecreationAreas(recAreas: RecreationArea[]) {
      dispatch(campsiteActions.setRecreationAreas(recAreas))
   }
})

export const ConnectedCampsites = connect(mapStateToProps, mapDispatchToProps)(Campsites)
