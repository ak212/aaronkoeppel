import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AnyAction } from '@reduxjs/toolkit'
import uniqueId from 'lodash/uniqueId'
import { useSnackbar } from 'notistack'
import React, { Dispatch, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../state/hooks'

import { loadingSelectors } from '../../state/Loading'
import { RootState } from '../../state/store'
import { getGames, NhlGame, nhlScoreboardSelectors } from '../../store/nhlScoreboard'
import { NhlGameCard } from './NhlGameCard'
import { NhlTeamLogo } from './NhlTeamLogo'

const MILLISECOND = 1000
const MINUTE = 60

function usePrevious<T>(value: T, initial?: T): MutableRefObject<T | undefined>['current'] {
  const ref = useRef({ target: value, previous: initial })

  if (ref.current.target !== value) {
    // The value changed.
    ref.current.previous = ref.current.target
    ref.current.target = value
  }

  return ref.current.previous
}

const noGameInProgress = (games: NhlGame[]): boolean => {
  return games.every(game => ['1', '7'].includes(game.status.statusCode))
}

const NhlScoreboard = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar()
  const maxWidth620: boolean = useMediaQuery('(max-width:620px)')

  /* Props */
  const games: NhlGame[] = useAppSelector((state: RootState) => nhlScoreboardSelectors.getGames(state))
  const loading: boolean = useAppSelector((state: RootState) => loadingSelectors.getNhlScoresLoading(state))

  /* State */
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false)
  const prevGames = usePrevious(games)
  const [startDate, setStartDate] = useState<number>(Date.now())

  /* Dispatch */
  const dispatch: Dispatch<AnyAction> = useAppDispatch()
  const getGamesCallback = useCallback(() => {
    dispatch(getGames(startDate))
  }, [dispatch, startDate])

  useEffect(() => {
    getGamesCallback()
  }, [startDate])

  /* Auto retrieve game updates every 30 seconds when games are in progress, 20 minutes when not */
  useEffect(() => {
    const interval = setInterval(() => {
      getGamesCallback()
    }, MILLISECOND * MINUTE * (noGameInProgress(games) ? 20 : 0.5))
    return () => clearInterval(interval)
  })

  /* Scoring Notifications */
  useEffect(() => {
    for (const game of games) {
      const prevGameState: NhlGame | undefined = prevGames ? prevGames.find(g => g.gamePk === game.gamePk) : undefined

      if (prevGameState !== undefined) {
        if (prevGameState.scoringPlays.length !== game.scoringPlays.length) {
          game.scoringPlays.slice(prevGameState.scoringPlays.length).forEach(scoringPlay => {
            enqueueSnackbar(
              <Grid container direction="row" alignContent="center">
                <Typography
                  paragraph
                  sx={{ marginBottom: '2px' }}
                >{`${scoringPlay.about.periodTimeRemaining}`}</Typography>
                <NhlTeamLogo size="x-small" teamId={scoringPlay.team.id} teamName={scoringPlay.team.name} />
                <Typography paragraph style={{ marginBottom: '2px' }}>{`${scoringPlay.result.description}`}</Typography>
              </Grid>,
              {
                autoHideDuration: 15000,
              },
            )
          })
        }
      }
    }
  }, [games])

  /**
   * Handle a change to the start date.
   *
   * @param {MaterialUiPickersDate} date
   * @param {(string | null | undefined)} [value]
   */
  const handleStartDateChange = (date: Date | null): void => {
    setStartDate(date !== null ? date?.valueOf() : new Date().valueOf())
    setShowAllExpanded(false)
  }

  return (
    <>
      <Grid container direction="row" sx={{ paddingTop: '2vh', minHeight: '90px' }}>
        <Grid
          item
          xs={maxWidth620 ? 12 : 6}
          sx={{
            alignItems: 'center',
            '@media (min-width: 620px)': {
              justifyContent: 'flex-end',
            },
            '@media (max-width: 619px)': {
              justifyContent: 'space-evenly',
            },
            paddingLeft: '5vw',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              inputFormat="MM/dd/yyyy"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{
                    maxWidth: '300px',
                    label: { color: '#1976d2' },
                    input: { color: 'white' },
                    svg: { color: '#1976d2' },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid
          item
          xs={maxWidth620 ? 12 : 6}
          sx={{
            alignItems: 'center',
            '@media (min-width: 620px)': {
              justifyContent: 'flex-end',
            },
            '@media (max-width: 619px)': {
              justifyContent: 'space-evenly',
            },
          }}
          style={{ paddingRight: '5vw' }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAllExpanded(true)}
            style={{ marginRight: '1vw' }}
          >
            Expand All
          </Button>
          <Button variant="contained" color="primary" onClick={() => setShowAllExpanded(false)}>
            Collapse All
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        direction="column"
        spacing={2}
        style={{ marginTop: '1vh', width: '100%', minHeight: '70vh' }}
      >
        {games.map(game => (
          <NhlGameCard key={uniqueId()} game={game} showAllExpanded={showAllExpanded} />
        ))}
        {games.length === 0 && <Alert severity="warning">No games scheduled on the date you selected.</Alert>}
      </Grid>

      <Snackbar
        open={loading}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        TransitionComponent={Fade}
        message="Loading"
        key={Fade.name}
      />
    </>
  )
}

export default NhlScoreboard
