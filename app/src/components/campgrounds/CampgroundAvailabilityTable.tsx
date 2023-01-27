import Button from '@mui/material/Button'
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
import React, { useMemo, useState } from 'react'

import {
  AvailablityByDate,
  Campground,
  CampgroundAvailability,
  DaysOfWeek,
  ReservationType,
} from '../../store/campgrounds'
import { AvailableCampsitesModal } from './AvailableCampsitesModal'
import { campsitesAvailabilityRange, getDates } from './utils'

type CampgroundAvailabilityTableProps = {
  advancedDate: boolean
  campgrounds: Campground[]
  daysOfWeek: DaysOfWeek
  loading: boolean
  endDate: number
  startDate: number
}

type CampgroundTableRowProps = {
  advancedDate: boolean
  campgrounds: Campground[]
  daysOfWeek: DaysOfWeek
  endDate: number
  startDate: number
  handleOpen(campground: string, campgroundAvailability: CampgroundAvailability, date: string): void
}

/* Creating a table row for each campground. */
const CampgroundTableRows = ({
  advancedDate,
  campgrounds,
  daysOfWeek,
  endDate,
  startDate,
  handleOpen,
}: CampgroundTableRowProps): JSX.Element => {
  /**
   * It takes a campground object and returns a table row with a link to the campground and a table cell
   * for each day of the week.
   *
   *
   * The campgroundTableCell function is used in the campgroundToTableRow function.
   * @param {Campground} campground - Campground
   */
  const campgroundToTableRow = (campground: Campground): JSX.Element => {
    const campgroundAvailability: CampgroundAvailability = useMemo(
      () => campsitesAvailabilityRange(startDate, endDate, advancedDate, daysOfWeek, campground, true),
      [startDate, endDate, advancedDate, daysOfWeek, campground],
    )

    const campgroundTableCells = []
    for (const date of campgroundAvailability.availabilityByDate.keys()) {
      const available = campgroundAvailability.availabilityByDate.get(date)
      if (available) {
        campgroundTableCells.push(campgroundTableCell(campgroundAvailability, available, date, campground, handleOpen))
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
        {campgroundTableCells}
      </TableRow>
    )
  }

  /**
   * It returns a TableCell component with a background color of lightgray if the available.count is 0,
   * otherwise it returns a TableCell component with a background color of #4178ee
   * @param {CampgroundAvailability} campgroundAvailability - CampgroundAvailability,
   * @param {AvailablityByDate} available - AvailablityByDate
   * @param {string} date - string
   * @param {Campground} campground - Campground
   * @param handleOpen - (campgroundName: string, campgroundAvailability: CampgroundAvailability, date:
   * string) => void,
   */
  const campgroundTableCell = (
    campgroundAvailability: CampgroundAvailability,
    available: AvailablityByDate,
    date: string,
    campground: Campground,
    handleOpen: (campgroundName: string, campgroundAvailability: CampgroundAvailability, date: string) => void,
  ) => {
    return (
      <TableCell key={uniqueId()} style={{ backgroundColor: available.count !== 0 ? '#4178ee' : 'lightgray' }}>
        {campground.campsites ? (
          campground.campsites.length === 0 ? (
            'Unavailable'
          ) : campground.facility_type === ReservationType.CAMPING_LOTTERY ? (
            'Lottery'
          ) : (
            <Button
              onClick={() => handleOpen(campground.facility_name.toLowerCase(), campgroundAvailability, date)}
              sx={{ color: 'black', borderRadius: 1, borderColor: 'gray' }}
            >{`${available.count}/${campground.campsites.length}`}</Button>
          )
        ) : (
          'Unknown'
        )}
      </TableCell>
    )
  }

  return <TableBody>{campgrounds.map(campgroundToTableRow)}</TableBody>
}

/* A React component that returns a table with a row for each campground. The table has a column for
each day of the week. The table cells are colored lightgray if there are no campsites available,
otherwise the table cells are colored #4178ee. If the user clicks on a table cell with a background
color of #4178ee, a modal is opened with a list of available campsites. */
export const CampgroundAvailabilityTable = ({
  advancedDate,
  campgrounds,
  daysOfWeek,
  loading,
  endDate,
  startDate,
}: CampgroundAvailabilityTableProps): JSX.Element | null => {
  const [open, setOpen] = useState<boolean>(false)
  const [campgroundAvailability, setCampgroundAvailability] = useState<CampgroundAvailability | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
  const [selectedCampgroundName, setSelectedCampgroundName] = useState<string | undefined>(undefined)

  const handleOpen = (campgroundName: string, campgroundAvailability: CampgroundAvailability, date: string) => {
    setOpen(true)
    setCampgroundAvailability(campgroundAvailability)
    setSelectedCampgroundName(campgroundName)
    setSelectedDate(date)
  }
  const handleClose = () => setOpen(false)

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ marginTop: '2vh' }} height={`${33 * (campgrounds.length + 1)}px`} />
  } else if (campgrounds.length > 0) {
    return (
      <>
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
                {getDates(startDate, endDate, advancedDate, daysOfWeek).map(date => (
                  <TableCell key={uniqueId()}>
                    {format(parseISO(date.replace('T00:00:00Z', '')), 'dd MMM yyyy')}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <CampgroundTableRows
              advancedDate={advancedDate}
              campgrounds={campgrounds}
              daysOfWeek={daysOfWeek}
              endDate={endDate}
              startDate={startDate}
              handleOpen={handleOpen}
            />
          </Table>
        </TableContainer>
        <AvailableCampsitesModal
          open={open}
          selectedCampgroundName={selectedCampgroundName}
          campgroundAvailability={campgroundAvailability}
          date={selectedDate}
          handleClose={handleClose}
        />
      </>
    )
  } else {
    return null
  }
}
