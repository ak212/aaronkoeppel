import 'date-fns'

import DateFnsUtils from '@date-io/date-fns'
import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Alert } from '@material-ui/lab'
import { KeyboardDatePicker } from '@material-ui/pickers/DatePicker'
import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import React, { Dispatch, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

import { loadingSelectors } from '../../reducers/Loading'
import { State as RootState } from '../../reducers/Root'
import { NhlGame, nhlScoreboardActions, nhlScoreboardSelectors } from '../../store/nhlScoreboard'
import { NhlGameCard } from './NhlGameCard'

const useStyles = makeStyles(() => ({
  logoSmall: {
    width: 22,
    height: 16,
    margin: 2.5
  },
  actionRow: {
    paddingTop: '2vh',
    minHeight: '90px'
  },
  actionRowItem: {
    alignItems: 'center',
    '@media (min-width: 620px)': {
      justifyContent: 'flex-end'
    },
    '@media (max-width: 619px)': {
      justifyContent: 'space-evenly'
    }
  },
  datePicker: {
    maxWidth: '150px'
  }
}))

export function usePrevious<T>(value: T, initial?: T): MutableRefObject<T | undefined>['current'] {
  const ref = useRef({ target: value, previous: initial })

  if (ref.current.target !== value) {
    // The value changed.
    ref.current.previous = ref.current.target
    ref.current.target = value
  }

  return ref.current.previous
}

export const NhlScoreboard = (): JSX.Element => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const maxWidth620: boolean = useMediaQuery('(max-width:620px)')

  /* Props */
  const games: NhlGame[] = useSelector((state: RootState) => nhlScoreboardSelectors.getGames(state))
  const loading: boolean = useSelector((state: RootState) => loadingSelectors.getNhlScoresLoading(state))

  /* State */
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false)
  const prevGames = usePrevious(games)
  const [startDate, setStartDate] = useState<number>(Date.now())

  /* Dispatch */
  const dispatch: Dispatch<AnyAction> = useDispatch()
  const getGames = useCallback(() => {
    dispatch(nhlScoreboardActions.getGames(startDate))
  }, [dispatch, startDate])

  useEffect(() => {
    getGames()
  }, [getGames])

  useEffect(() => {
    getGames()
  }, [startDate])

  /* Auto retrieve game updates every 20 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      getGames()
    }, 20000)
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
                  style={{ marginBottom: '2px' }}
                >{`${scoringPlay.about.periodTimeRemaining}`}</Typography>
                <CardMedia
                  classes={{ root: classes.logoSmall }}
                  component="img"
                  image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${scoringPlay.team.id}.svg`}
                  title={`${scoringPlay.team.name} Logo`}
                />
                <Typography paragraph style={{ marginBottom: '2px' }}>{`${scoringPlay.result.description}`}</Typography>
              </Grid>,
              {
                autoHideDuration: 15000
              }
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
  const handleStartDateChange = (date: MaterialUiPickersDate): void => {
    setStartDate(date !== null ? date?.valueOf() : moment().valueOf())
  }

  return (
    <>
      <Grid container direction={maxWidth620 ? 'row' : 'column'} classes={{ root: classes.actionRow }}>
        <Grid
          container
          xs={maxWidth620 ? 12 : 6}
          classes={{ root: classes.actionRowItem }}
          style={{ paddingLeft: '5vw' }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              className={classes.datePicker}
              id="date-picker"
              value={startDate}
              onChange={handleStartDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid
          container
          xs={maxWidth620 ? 12 : 6}
          classes={{ root: classes.actionRowItem }}
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
        justify="flex-start"
        alignItems="center"
        direction="column"
        spacing={2}
        style={{ marginTop: '15px', width: '100%' }}
      >
        {games.map(game => (
          <NhlGameCard game={game} showAllExpanded={showAllExpanded} />
        ))}
        {games.length === 0 && <Alert severity="warning">No games scheduled on the date you selected.</Alert>}
      </Grid>

      <Snackbar
        open={loading}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        TransitionComponent={Fade}
        message="Loading"
        key={Fade.name}
      />
    </>
  )
}
