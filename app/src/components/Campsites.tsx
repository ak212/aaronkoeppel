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
import range from 'lodash/range'
import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import moment from 'moment'
import React, { Dispatch, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

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
import { CampgroundMap } from './CampgroundMap'
import { WeekdayPicker } from './common/WeekdayPicker'
import { CampgroundIcon } from './icons/CampgroundIcon'
import { RecreationAreaIcon } from './icons/RecreationAreaIcon'

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

const CampgroundDates = (props: DateProps) => {
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

export const Campsites = () => {
   /* Props */
   const autocompleteValues: RecreationArea[] = useSelector((state: RootState) =>
      campsitesSelectors.getAutocomplete(state)
   )
   const campgrounds: Campground[] = useSelector((state: RootState) => campsitesSelectors.getCampgrounds(state))
   const loading: boolean = useSelector((state: RootState) => loadingSelectors.getCampsiteLoading(state))

   /* Dispatch */
   const dispatch: Dispatch<AnyAction> = useDispatch()

   const getCampsiteAvailability = useCallback(
      (recreationAreas: RecreationArea[], startDate: number, endDate: number) => {
         dispatch(campsiteActions.getCampgroundAvailability(recreationAreas, startDate, endDate))
      },
      [dispatch]
   )

   const getAutoComplete = useCallback(
      (name: string) => {
         dispatch(campsiteActions.getAutocomplete(name))
      },
      [dispatch]
   )

   const setRecreationAreas = useCallback(
      (recAreas: RecreationArea[]) => {
         dispatch(campsiteActions.setRecreationAreas(recAreas))
      },
      [dispatch]
   )

   /* State */
   const [autoCompleteText, setAutoCompleteText] = useState<string>('')
   const [selectedRecAreas, setSelectedRecAreas] = useState<RecreationArea[]>([])
   const [startDate, setStartDate] = useState<number | undefined>(Date.now())
   const [endDate, setEndDate] = useState<number | undefined>(moment(Date.now()).add(1, 'days').toDate().valueOf())
   const [advancedDate, setAdvancedDate] = useState<boolean>(false)
   const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeek>(initialDaysOfWeek)

   /**
    * On click listener to get the the campsite availability for the selected recreation areas for the date range (stateDate -> endDate)
    *
    * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
    */
   const getCampsitesOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      if (startDate && endDate) {
         getCampsiteAvailability(selectedRecAreas, startDate, endDate)
      }
   }

   /**
    * Get new autocomplete values based on the new input.
    *
    * @param {React.ChangeEvent<{}>} event
    * @param {string} value
    */
   const onInputChange = (event: React.ChangeEvent<{}>, value: string): void => {
      setAutoCompleteText(value)
      getAutoComplete(value)
   }

   /**
    * On change listener for the autocomplete values.
    *
    * @param {React.ChangeEvent<{}>} event
    * @param {((string | RecreationArea)[])} value
    */
   const onChange = (event: React.ChangeEvent<{}>, value: (string | RecreationArea)[]): void => {
      if (value.every((val) => isRecreationArea(val)) || value.length === 0) {
         setRecreationAreas(value as RecreationArea[])
         setSelectedRecAreas(value as RecreationArea[])
      }
   }

   /**
    * State handler for the WeekdayPicker component.
    *
    * @param {DayOfWeek} dayOfWeek
    */
   const toggleSelectedDaysOfWeek = (dayOfWeek: DayOfWeek): void => {
      let newDaysOfWeek = Object.assign({}, daysOfWeek)
      switch (dayOfWeek) {
         case DayOfWeek.SUNDAY:
            newDaysOfWeek = { ...newDaysOfWeek, sunday: !newDaysOfWeek.sunday }
            break
         case DayOfWeek.MONDAY:
            newDaysOfWeek = { ...newDaysOfWeek, monday: !newDaysOfWeek.monday }
            break
         case DayOfWeek.TUESDAY:
            newDaysOfWeek = { ...newDaysOfWeek, tuesday: !newDaysOfWeek.tuesday }
            break
         case DayOfWeek.WEDNESDAY:
            newDaysOfWeek = { ...newDaysOfWeek, wednesday: !newDaysOfWeek.wednesday }
            break
         case DayOfWeek.THURSDAY:
            newDaysOfWeek = { ...newDaysOfWeek, thursday: !newDaysOfWeek.thursday }
            break
         case DayOfWeek.FRIDAY:
            newDaysOfWeek = { ...newDaysOfWeek, friday: !newDaysOfWeek.friday }
            break
         case DayOfWeek.SATURDAY:
            newDaysOfWeek = { ...newDaysOfWeek, saturday: !newDaysOfWeek.saturday }
            break
         default:
            break
      }

      setDaysOfWeek(newDaysOfWeek)
   }

   /**
    * Logic to determine whether or not we need to get more availability data based off a date change.
    *
    * @param {(number | undefined)} start
    * @param {(number | undefined)} end
    */
   const shouldGetAvailability = (start: number | undefined, end: number | undefined): void => {
      if (campgrounds.length > 0 && campgrounds[0].campsites && start && end) {
         const startMonth = moment(start).get('month')
         const endMonth = moment(end).get('month')
         /* Adding another +1 to endMonth because range is not inclusive */
         let monthRange = range(startMonth, endMonth + 1)
         const statusMap: Map<string, ReservationStatus> = new Map(
            Object.entries(campgrounds[0].campsites[0].availabilities)
         )
         for (const key of Array.from(statusMap.keys())) {
            monthRange = monthRange.filter((month) => month !== moment(key).get('month'))
         }

         if (selectedRecAreas !== undefined && monthRange.length > 0) {
            start = moment(start).set('month', monthRange[0]).valueOf()
            end = moment(end)
               .set('month', monthRange[monthRange.length - 1])
               .valueOf()
            getCampsiteAvailability(selectedRecAreas, start, end)
         }
      }
   }

   /**
    * Handle a change to the start date.
    *
    * @param {MaterialUiPickersDate} date
    * @param {(string | null | undefined)} [value]
    */
   const handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined): void => {
      if (endDate && date && moment(date).isSameOrAfter(endDate, 'day')) {
         setStartDate(date.valueOf())
         setEndDate(moment(date).add(1, 'days').toDate().valueOf())
      } else {
         setStartDate((date && date.valueOf()) || undefined)
      }
      shouldGetAvailability(startDate, endDate)
   }

   /**
    * Handle a change to the end date.
    *
    * @param {MaterialUiPickersDate} date
    * @param {(string | null | undefined)} [value]
    */
   const handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined): void => {
      if (startDate && date && moment(date).isSameOrBefore(startDate, 'day')) {
         setStartDate(date.valueOf())
      } else {
         setEndDate((date && date.valueOf()) || undefined)
      }
      shouldGetAvailability(startDate, endDate)
   }

   /**
    * Toggle the visibility on the WeekdayPicker.
    *
    * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
    */
   const advancedToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      setAdvancedDate(!advancedDate)
   }

   /**
    * Get the individual days based on the date range.
    *
    * @returns {string[]}
    */
   const getDates = (): string[] => {
      const days: string[] = []
      for (let d = startDate!;d < endDate!;d = moment(d).add(1, 'days').toDate().valueOf()) {
         days.push(moment(d).format('YYYY-MM-DD').concat('T00:00:00Z'))
      }

      return days
   }

   /**
    * Creates a map between a date in the start/end range and the number of available campsites.
    *
    * @param {Campground} campground
    * @returns {Map<string, number>}
    */
   const campsitesAvailabilityRange = (campground: Campground): Map<string, number> => {
      const days: string[] = getDates()
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
         availabilities.set(moment(day.replace('T00:00:00Z', '')).format('DD MMM YYYY'), avail)
      }
      return availabilities
   }

   /**
    * Creates a row in the table for a campground.
    *
    * @param {Campground} campground
    * @returns {JSX.Element}
    */
   const campgroundToTableRow = (campground: Campground): JSX.Element => {
      const campgroundAvailability: Map<string, number> = campsitesAvailabilityRange(campground)
      if (advancedDate) {
         for (let k of campgroundAvailability.keys()) {
            if (!showDayOfWeek(daysOfWeek, moment(k).day())) {
               campgroundAvailability.delete(k)
            }
         }
      }
      return (
         <TableRow key={uniqueId()}>
            <TableCell component="th" scope="row">
               <Typography>
                  <Link
                     href={`https://www.recreation.gov/camping/campgrounds/${campground.facility_id}`}
                     target="_blank"
                     color="inherit"
                  >
                     {startCase(campground.facility_name.toLowerCase())}
                  </Link>
               </Typography>
            </TableCell>

            {Array.from(campgroundAvailability.values()).map((available) => (
               <TableCell key={uniqueId()}>
                  {campground.campsites
                     ? campground.campsites.length === 0
                        ? 'Unavailable'
                        : campground.facility_type === ReservationType.CAMPING_LOTTERY
                           ? 'Lottery'
                           : `${available}/${campground.campsites.length}`
                     : 'Unknown'}
               </TableCell>
            ))}
         </TableRow>
      )
   }

   /**
    * Creates the table of campground availability.
    *
    * @param {Campground[]} campgrounds
    * @returns {(JSX.Element | undefined)}
    */
   const campgroundAvailabilityTable = (campgrounds: Campground[]): JSX.Element | undefined => {
      if (loading) {
         return <Skeleton variant="rect" className="campgroundTable" height={`${33 * (campgrounds.length + 1)}px`} />
      } else if (campgrounds.length > 0) {
         return (
            <TableContainer component={Paper} className="campgroundTable">
               <Table size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell>Campground</TableCell>
                        {getDates()
                           .filter((date) => {
                              return advancedDate ? showDayOfWeek(daysOfWeek, moment(date).day()) : true
                           })
                           .map((date) => (
                              <TableCell key={uniqueId()}>
                                 {moment(date.replace('T00:00:00Z', '')).format('DD MMM YYYY')}
                              </TableCell>
                           ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>{campgrounds.map(campgroundToTableRow)}</TableBody>
               </Table>
            </TableContainer>
         )
      } else {
         return undefined
      }
   }

   return (
      <div>
         <div className="interactive">
            <Autocomplete
               multiple
               freeSolo
               limitTags={4}
               id="recreation-areas"
               options={autocompleteValues.filter(
                  (ra) => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1
               )}
               getOptionLabel={(option) => startCase(option.name.toLowerCase())}
               onInputChange={onInputChange}
               value={selectedRecAreas}
               onChange={onChange}
               renderTags={(value: RecreationArea[], getTagProps) =>
                  value.map((recArea: RecreationArea, index: number) => (
                     <Chip
                        variant="outlined"
                        label={startCase(recArea.name.toLowerCase())}
                        icon={recArea.entity_type === EntityType.REC_AREA ? <RecreationAreaIcon /> : <CampgroundIcon />}
                        {...getTagProps({ index })}
                        color="primary"
                     />
                  ))
               }
               renderInput={(params) => (
                  <TextField
                     {...params}
                     label="Search Recreation Areas"
                     margin="normal"
                     variant="outlined"
                     InputProps={{ ...params.InputProps, type: 'search' }}
                     value={autoCompleteText}
                     className="interactive"
                  />
               )}
            />
            <CampgroundDates
               startDate={startDate}
               endDate={endDate}
               advancedDate={advancedDate}
               daysOfWeek={daysOfWeek}
               handleStartDateChange={handleStartDateChange}
               handleEndDateChange={handleEndDateChange}
               advancedToggle={advancedToggle}
               toggleSelectedDaysOfWeek={toggleSelectedDaysOfWeek}
            />
            <Button
               variant="contained"
               color="primary"
               disabled={selectedRecAreas.length === 0}
               onClick={getCampsitesOnClick}
            >
               Get campsites
        </Button>
            {campgroundAvailabilityTable(
               campgrounds.sort((a: Campground, b: Campground) => (a.facility_name > b.facility_name ? 1 : -1))
            )}
            <CampgroundMap campgrounds={campgrounds} />
         </div>
      </div>
   )
}
