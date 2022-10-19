import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import add from 'date-fns/add'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import parseISO from 'date-fns/parseISO'
import toDate from 'date-fns/toDate'
import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import React from 'react'

import { Campground, DaysOfWeek, ReservationStatus, ReservationType, showDayOfWeek } from '../../store/campgrounds'

type Props = {
  advancedDate: boolean
  campgrounds: Campground[]
  daysOfWeek: DaysOfWeek
  loading: boolean
  endDate?: number
  startDate?: number
}

/**
 * Creates the table of campground availability.
 *
 * @param {Campground[]} campgrounds
 * @returns {(JSX.Element)}
 */
export const CampgroundAvailabilityTable = ({
  advancedDate,
  campgrounds,
  daysOfWeek,
  loading,
  endDate,
  startDate,
}: Props): JSX.Element | null => {
  /**
   * Get the individual days based on the date range.
   *
   * @returns {string[]}
   */
  const getDates = (): string[] => {
    const days: string[] = []
    for (let d = startDate!; d < endDate!; d = add(toDate(d), { days: 1 }).valueOf()) {
      days.push(format(d, 'yyyy-MM-dd').concat('T00:00:00Z'))
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
      availabilities.set(format(new Date(day.replace('T00:00:00Z', '')), 'dd MMM yyyy'), avail)
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
      for (const k of campgroundAvailability.keys()) {
        if (!showDayOfWeek(daysOfWeek, getDay(new Date(k)))) {
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

  const renderTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{
          marginTop: '2vh',
          '@media (min-width: 801px)': {
            gridTemplateColumns: '80vw',
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Campground</TableCell>
              {getDates()
                .filter(date => {
                  return advancedDate ? showDayOfWeek(daysOfWeek, getDay(new Date(date))) : true
                })
                .map(date => (
                  <TableCell key={uniqueId()}>
                    {format(parseISO(date.replace('T00:00:00Z', '')), 'dd MMM yyyy')}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>{campgrounds.map(campgroundToTableRow)}</TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ marginTop: '2vh' }} height={`${33 * (campgrounds.length + 1)}px`} />
  } else if (campgrounds.length > 0) {
    return renderTable()
  } else {
    return null
  }
}
