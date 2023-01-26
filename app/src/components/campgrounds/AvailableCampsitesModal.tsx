import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React from 'react'
import { CampgroundAvailability } from '../../store/campgrounds'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export type AvailableCampsitesModalProps = {
  open: boolean
  selectedCampgroundName?: string
  campgroundAvailability?: CampgroundAvailability
  date?: string
  handleClose(): void
}

export const AvailableCampsitesModal = ({
  open,
  selectedCampgroundName,
  campgroundAvailability,
  date,
  handleClose,
}: AvailableCampsitesModalProps) => {
  const sitesAvailableAllDates = campgroundAvailability?.sitesAvailableAllDates || []
  const availabilityByDate = campgroundAvailability?.availabilityByDate.get(date || '')?.sitesAvailableCurrentDate || []
  const sitesAvailableNoDates = campgroundAvailability?.sitesAvailableNoDates || []
  const link = `https://www.campsitephotos.com/?s=${selectedCampgroundName}`

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Available Campsites"
      aria-describedby="Full list of available campsites for the selected date"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Available Campsites
        </Typography>
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
            <TableRow>
              <TableCell>Available All Dates</TableCell>
              <TableCell>{sitesAvailableAllDates.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Available This Date</TableCell>
              <TableCell>{availabilityByDate.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Available No Dates</TableCell>
              <TableCell>{sitesAvailableNoDates.join(', ')}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <Box sx={{ marginTop: '1rem' }}>
          <Typography>
            Photos of each campsite can be found at{' '}
            <Link variant="body2" target="_blank" href={link} rel="noreferrer">
              campsitephotos.com
            </Link>
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
