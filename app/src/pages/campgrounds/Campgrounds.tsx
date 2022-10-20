import range from 'lodash/range'
import React, { Dispatch, useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { AnyAction } from '@reduxjs/toolkit'
import add from 'date-fns/add'
import getMonth from 'date-fns/getMonth'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import parseISO from 'date-fns/parseISO'
import setMonth from 'date-fns/setMonth'
import {
  CampgroundAvailabilityTable,
  CampgroundDates,
  CampgroundMap,
  CampgroundSearchbar,
} from '../../components/campgrounds'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { loadingSelectors } from '../../state/Loading'
import { RootState } from '../../state/store'
import {
  Campground,
  campsitesSelectors,
  DayOfWeek,
  DaysOfWeek,
  getAutocomplete,
  getCampgroundAvailability,
  initialDaysOfWeek,
  isRecreationArea,
  RecreationArea,
  ReservationStatus,
  setRecreationAreas,
} from '../../store/campgrounds'

const Campgrounds = (): JSX.Element => {
  /* Props */
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
  const [endDate, setEndDate] = useState<number | undefined>(add(Date.now(), { days: 1 }).valueOf())
  const [advancedDate, setAdvancedDate] = useState<boolean>(false)
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeek>(initialDaysOfWeek)
  const [selected, setSelected] = useState<string>('')

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

  const onMapCampgroundSelect = (campgroundFacilityId: string) => {
    setSelected(campgroundFacilityId)
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
      const startMonth = getMonth(start)
      const endMonth = getMonth(end)
      /* Adding another +1 to endMonth because range is not inclusive */
      let monthRange = range(startMonth, endMonth + 1)
      const statusMap: Map<string, ReservationStatus> = new Map(
        Object.entries(campgrounds[0].campsites[0].availabilities),
      )
      for (const key of Array.from(statusMap.keys())) {
        monthRange = monthRange.filter(month => month !== getMonth(parseISO(key)))
      }

      if (selectedRecAreas !== undefined && monthRange.length > 0) {
        start = setMonth(start, monthRange[0]).valueOf()
        end = setMonth(end, monthRange[monthRange.length - 1]).valueOf()
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
    if (endDate && date && (isSameDay(date, endDate) || isAfter(date, endDate))) {
      setStartDate(date.valueOf())
      setEndDate(add(date, { days: 1 }).valueOf())
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
    if (startDate && date && (isSameDay(date, startDate) || isBefore(date, startDate))) {
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

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridGap: '1vw 1vh',
          justifyContent: 'center',
          color: 'white',
          '@media (min-width: 901px)': {
            gridTemplateColumns: '50vw',
          },
          '@media (max-width: 900px)': {
            gridTemplateColumns: '80vw',
            gridGap: '2vh',
          },
        }}
      >
        <CampgroundSearchbar
          autoCompleteText={autoCompleteText}
          selectedRecAreas={selectedRecAreas}
          onInputChange={onInputChange}
          onChange={onChange}
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
        <Box sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedRecAreas.length === 0}
            sx={{
              '@media (min-width: 901px)': {
                maxWidth: '25em',
                width: '16vw',
              },
              '@media (max-width: 900px)': {
                width: '75vw',
              },
            }}
            onClick={getCampsitesOnClick}
          >
            Get campsites
          </Button>
        </Box>
        {startDate && endDate && (
          <>
            <CampgroundAvailabilityTable
              advancedDate={advancedDate}
              campgrounds={campgrounds.sort((a: Campground, b: Campground) =>
                a.facility_name > b.facility_name ? 1 : -1,
              )}
              daysOfWeek={daysOfWeek}
              loading={loading}
              endDate={endDate}
              startDate={startDate}
              selected={selected}
            />
            <CampgroundMap
              campgrounds={campgrounds}
              startDate={startDate}
              endDate={endDate}
              advancedDate={advancedDate}
              daysOfWeek={daysOfWeek}
              onClick={onMapCampgroundSelect}
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default Campgrounds
