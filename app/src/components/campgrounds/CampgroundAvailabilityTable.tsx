import './Campsites.css'
import 'date-fns'

import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import moment from 'moment'
import React from 'react'

import { Campground, DaysOfWeek, ReservationStatus, ReservationType, showDayOfWeek } from '../../store/campsites'

type Props = {
  campgrounds: Campground[]
  startDate?: number
  endDate?: number
  daysOfWeek: DaysOfWeek
  advancedDate: boolean
}

/**
 * Creates the table of campground availability.
 *
 * @param {Campground[]} campgrounds
 * @returns {(JSX.Element)}
 */
export const CampgroundAvailabilityTable = (props: Props): JSX.Element => {
  /**
   * Get the individual days based on the date range.
   *
   * @returns {string[]}
   */
  const getDates = (): string[] => {
    const days: string[] = []
    for (let d = props.startDate!; d < props.endDate!; d = moment(d).add(1, 'days').toDate().valueOf()) {
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
      let avail = 0
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
    if (props.advancedDate) {
      for (const k of campgroundAvailability.keys()) {
        if (!showDayOfWeek(props.daysOfWeek, moment(k).day())) {
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

        {Array.from(campgroundAvailability.values()).map(available => (
          <TableCell key={uniqueId()} style={{ backgroundColor: available !== 0 ? '#4178ee' : 'lightgray' }}>
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

  return (
    <TableContainer component={Paper} className="campgroundTable">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Campground</TableCell>
            {getDates()
              .filter(date => {
                return props.advancedDate ? showDayOfWeek(props.daysOfWeek, moment(date).day()) : true
              })
              .map(date => (
                <TableCell key={uniqueId()}>{moment(date.replace('T00:00:00Z', '')).format('DD MMM YYYY')}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>{props.campgrounds.map(campgroundToTableRow)}</TableBody>
      </Table>
    </TableContainer>
  )
}
