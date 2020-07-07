import './Campsites.css'
import 'date-fns'

import DateFnsUtils from '@date-io/date-fns'
import {
   Button,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField
} from '@material-ui/core'
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete'
import Skeleton from '@material-ui/lab/Skeleton'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { uniqueId } from 'lodash'
import moment from 'moment'
import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'

import {
   Campground,
   campsiteActions,
   campsitesSelectors,
   EntityType,
   entityTypeToString,
   RecreationArea,
   ReservationStatus
} from '../reducers/Campsites'
import { loadingSelectors } from '../reducers/Loading'
import { State as RootState } from '../reducers/Root'

interface State {
   autoCompleteText: string
   selectedRecArea?: RecreationArea
   startDate?: number
   endDate?: number
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
   handleStartDateChange(date: MaterialUiPickersDate, value?: string | null | undefined): void
   handleEndDateChange(date: MaterialUiPickersDate, value?: string | null | undefined): void
}

const CampsiteDates: React.FunctionComponent<DateProps> = (props: DateProps) => {
   return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <div style={{ display: "grid", gridTemplateColumns: "12.5vw 12.5vw" }}>
            <KeyboardDatePicker
               disableToolbar
               variant='inline'
               format='MM/dd/yyyy'
               margin='normal'
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
               id='date-picker'
               label='End Date'
               minDate={moment().add(1, "days")}
               maxDate={moment(props.startDate).add(7, "days")}
               value={props.endDate}
               onChange={props.handleEndDateChange}
               KeyboardButtonProps={{
                  "aria-label": "change date"
               }}
            />
         </div>
      </MuiPickersUtilsProvider>
   )
}

export default class Campsites extends React.Component<Props, State> {
   public constructor(props: Props) {
      super(props)

      this.state = {
         autoCompleteText: "",
         startDate: Date.now(),
         endDate: moment(Date.now()).add(1, "days").toDate().valueOf()
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
         selectedRecArea: this.props.autocompleteValues.find((ra) => ra.name === value)
      })
      this.props.getAutoComplete(value)
   }

   private handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      if (this.state.endDate && date && moment(date).isSameOrAfter(this.state.endDate, "day")) {
         this.setState({
            startDate: date.valueOf(),
            endDate: moment(date).add(1, "days").toDate().valueOf()
         })
      } else {
         this.setState({ startDate: (date && date.valueOf()) || undefined })
      }
   }

   private handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
      if (this.state.startDate && date && moment(date).isSameOrBefore(this.state.startDate, "day")) {
         this.setState({ startDate: date.valueOf() })
      } else {
         this.setState({ endDate: (date && date.valueOf()) || undefined })
      }
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
      for (const d of days) {
         let avail: number = 0
         if (campground.campsites) {
            for (const campsite of campground.campsites) {
               const x: Map<string, ReservationStatus> = new Map(Object.entries(campsite.availabilities))
               if (x.get(d) === ReservationStatus.AVAILABLE) {
                  avail += 1
               }
            }
         }
         availabilities.set(moment(d.replace("T00:00:00Z", "")).format("DD MMM YYYY"), avail)
      }
      return availabilities
   }

   private campgroundAvailabilityTable = (campgrounds: Campground[]) => {
      return this.props.loading ? (
         <Skeleton variant='rect' height={`${33 * (campgrounds.length + 1)}px`} />
      ) : (
         <TableContainer component={Paper}>
            <Table size='small' aria-label='a dense table'>
               <TableHead>
                  <TableRow>
                     <TableCell>Campground</TableCell>
                     {this.getDates().map((date) => (
                        <TableCell key={uniqueId()}>
                           {moment(date.replace("T00:00:00Z", "")).format("DD MMM YYYY")}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {campgrounds.map((campground) => {
                     return (
                        <TableRow key={uniqueId()}>
                           <TableCell component='th' scope='row'>
                              {campground.facility_name}
                           </TableCell>

                           {Array.from(this.campsitesAvailabilityRange(campground).values()).map((available) => (
                              <TableCell key={uniqueId()}>
                                 {campground.campsites ? `${available} / ${campground.campsites.length}` : "Lottery"}
                              </TableCell>
                           ))}
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
         </TableContainer>
      )
   }

   public render = () => {
      return (
         <div className='camping'>
            <div
               style={{
                  display: "grid",
                  gridTemplateColumns: "25vw",
                  gridGap: "1vw",
                  justifyContent: "center"
               }}
            >
               <Autocomplete
                  freeSolo
                  id='recreation-areas'
                  options={this.props.autocompleteValues
                     .filter((ra) => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1)
                     .map((option) => option.name)}
                  onInputChange={this.onInputChange}
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        label='Search Recreation Areas'
                        margin='normal'
                        variant='outlined'
                        InputProps={{ ...params.InputProps, type: "search" }}
                        value={this.state.autoCompleteText}
                        style={{ width: "25vw" }}
                     />
                  )}
               />
               {this.state.selectedRecArea ? entityTypeToString(this.state.selectedRecArea.entity_type) : undefined}
               <CampsiteDates
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  handleStartDateChange={this.handleStartDateChange}
                  handleEndDateChange={this.handleEndDateChange}
               />
               <Button
                  variant='contained'
                  color='primary'
                  disabled={this.state.selectedRecArea === undefined}
                  onClick={this.getCampsitesOnClick}
                  style={{ width: "25vw" }}
               >
                  Get campsites
               </Button>
               {this.props.campgrounds.length > 0 &&
                  this.campgroundAvailabilityTable(
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
      dispatch(campsiteActions.getCampsiteAvailability(recreationArea, startDate, endDate))
   },
   getAutoComplete(name: string) {
      dispatch(campsiteActions.getAutocomplete(name))
   }
})

export const ConnectedCampsites = connect(mapStateToProps, mapDispatchToProps)(Campsites)
