/* eslint-ignore */
import './Campsites.css'

import { Button, Chip, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Skeleton from '@mui/material/Skeleton'
import range from 'lodash/range'
import startCase from 'lodash/startCase'
import moment from 'moment'
import React, { Dispatch, useCallback, useState } from 'react'

import { AnyAction } from '@reduxjs/toolkit'
import uniqueId from 'lodash/uniqueId'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { loadingSelectors } from '../../state/Loading'
import { RootState } from '../../state/store'
import {
  Campground,
  campsitesSelectors,
  DayOfWeek,
  DaysOfWeek,
  EntityType,
  getAutocomplete,
  getCampgroundAvailability,
  initialDaysOfWeek,
  isRecreationArea,
  RecreationArea,
  ReservationStatus,
  setRecreationAreas,
} from '../../store/campsites'
import { CampgroundIcon } from '../icons/CampgroundIcon'
import { RecreationAreaIcon } from '../icons/RecreationAreaIcon'
import { CampgroundAvailabilityTable } from './CampgroundAvailabilityTable'
import { CampgroundDates } from './CampgroundDates'
import { CampgroundMap } from './CampgroundMap'

export const Campsites = (): JSX.Element => {
  /* Props */
  const autocompleteValues: RecreationArea[] = useAppSelector((state: RootState) =>
    campsitesSelectors.getAutocomplete(state),
  )
  const campgrounds: Campground[] = useAppSelector((state: RootState) =>
    campsitesSelectors.getCampgrounds(state),
  ).slice()
  const loading: boolean = useAppSelector((state: RootState) => loadingSelectors.getCampsiteLoading(state))

  /* Dispatch */
  const dispatch: Dispatch<AnyAction> = useAppDispatch()

  const getCampsiteAvailabilityCallback = useCallback(
    (recreationAreas: RecreationArea[], startDate: number, endDate: number) => {
      dispatch(getCampgroundAvailability(recreationAreas, startDate, endDate))
    },
    [dispatch],
  )

  const getAutoCompleteCallback = useCallback(
    (name: string) => {
      dispatch(getAutocomplete(name))
    },
    [dispatch],
  )

  const setRecreationAreasCallback = useCallback(
    (recAreas: RecreationArea[]) => {
      dispatch(setRecreationAreas(recAreas))
    },
    [dispatch],
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
  const getCampsitesOnClick = (): void => {
    if (startDate && endDate) {
      getCampsiteAvailabilityCallback(selectedRecAreas, startDate, endDate)
    }
  }

  /**
   * Get new autocomplete values based on the new input.
   *
   * @param {React.ChangeEvent<unknown>} event
   * @param {string} value
   */
  const onInputChange = (event: React.ChangeEvent<unknown>, value: string): void => {
    setAutoCompleteText(value)
    getAutoCompleteCallback(value)
  }

  /**
   * On change listener for the autocomplete values.
   *
   * @param {React.ChangeEvent<unknown>} event
   * @param {((string | RecreationArea)[])} value
   */
  const onChange = (event: React.ChangeEvent<unknown>, value: (string | RecreationArea)[]): void => {
    if (value.every(val => isRecreationArea(val)) || value.length === 0) {
      setRecreationAreasCallback(value as RecreationArea[])
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
        Object.entries(campgrounds[0].campsites[0].availabilities),
      )
      for (const key of Array.from(statusMap.keys())) {
        monthRange = monthRange.filter(month => month !== moment(key).get('month'))
      }

      if (selectedRecAreas !== undefined && monthRange.length > 0) {
        start = moment(start).set('month', monthRange[0]).valueOf()
        end = moment(end)
          .set('month', monthRange[monthRange.length - 1])
          .valueOf()
        getCampsiteAvailabilityCallback(selectedRecAreas, start, end)
      }
    }
  }

  /**
   * Handle a change to the start date.
   *
   * @param {MaterialUiPickersDate} date
   * @param {(string | null | undefined)} [value]
   */
  const handleStartDateChange = (date: Date): void => {
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
  const handleEndDateChange = (date: Date): void => {
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
  const advancedToggle = (): void => {
    setAdvancedDate(!advancedDate)
  }

  /**
   * Creates the table of campground availability.
   *
   * @param {Campground[]} campgrounds
   * @returns {(JSX.Element | undefined)}
   */
  const campgroundAvailabilityTable = (campgrounds: Campground[]): JSX.Element | undefined => {
    if (loading) {
      return (
        <Skeleton variant="rectangular" className="campgroundTable" height={`${33 * (campgrounds.length + 1)}px`} />
      )
    } else if (campgrounds.length > 0) {
      return (
        <CampgroundAvailabilityTable
          advancedDate={advancedDate}
          campgrounds={campgrounds}
          daysOfWeek={daysOfWeek}
          endDate={endDate}
          startDate={startDate}
        />
      )
    } else {
      return undefined
    }
  }

  const options: RecreationArea[] = autocompleteValues.filter(
    ra => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1,
  )

  const tg = (tbd: any): tbd is RecreationArea => {
    if ((tbd as RecreationArea).entity_id) {
      return true
    }
    return false
  }

  return (
    <div>
      <div className="interactive">
        <Autocomplete
          multiple
          freeSolo
          limitTags={4}
          id="recreation-areas"
          options={options}
          getOptionLabel={option => (tg(option) ? startCase(option.name.toLowerCase()) : option)}
          onInputChange={onInputChange}
          value={selectedRecAreas}
          onChange={onChange}
          renderTags={(value: RecreationArea[], getTagProps) =>
            value.map((recArea: RecreationArea, index: number) => (
              <div key={uniqueId()}>
                <Chip
                  variant="outlined"
                  label={startCase(recArea.name.toLowerCase())}
                  icon={recArea.entity_type === EntityType.REC_AREA ? <RecreationAreaIcon /> : <CampgroundIcon />}
                  {...getTagProps({ index })}
                  color="primary"
                />
              </div>
            ))
          }
          renderInput={params => (
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
          campgrounds.sort((a: Campground, b: Campground) => (a.facility_name > b.facility_name ? 1 : -1)),
        )}
        <CampgroundMap campgrounds={campgrounds} />
      </div>
    </div>
  )
}
