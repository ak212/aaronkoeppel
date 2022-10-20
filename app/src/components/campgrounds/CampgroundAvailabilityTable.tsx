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
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import React from 'react'

import { Campground, DaysOfWeek, ReservationType } from '../../store/campgrounds'
import { campsitesAvailabilityRange, getDates } from './utils'

type Props = {
  advancedDate: boolean
  campgrounds: Campground[]
  daysOfWeek: DaysOfWeek
  loading: boolean
  endDate: number
  startDate: number
  selected: string
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
  selected,
}: Props): JSX.Element | null => {
  /**
   * Creates a row in the table for a campground.
   *
   * @param {Campground} campground
   * @returns {JSX.Element}
   */
  const campgroundToTableRow = (campground: Campground): JSX.Element => {
    const campgroundAvailability: Map<string, number> = campsitesAvailabilityRange(
      startDate,
      endDate,
      advancedDate,
      daysOfWeek,
      campground,
    )

    return (
      <TableRow key={uniqueId()} selected={selected === campground.facility_id}>
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

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ marginTop: '2vh' }} height={`${37 * (campgrounds.length + 1)}px`} />
  } else if (campgrounds.length > 0) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          marginTop: '2vh',
          height: '40vh',
          '@media (min-width: 801px)': {
            gridTemplateColumns: '80vw',
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Campground</TableCell>
              {getDates(startDate, endDate, advancedDate, daysOfWeek).map(date => (
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
  } else {
    return null
  }
}
