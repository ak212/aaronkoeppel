import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import React, { Dispatch, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

import { loadingSelectors } from '../reducers/Loading'
import { State as RootState } from '../reducers/Root'
import { NhlGame, nhlScoreboardActions, nhlScoreboardSelectors } from '../store/nhlScoreboard'
import { NhlGameScore } from './NhlGameScore'

const useStyles = makeStyles(() => ({
  logoSmall: {
    width: 22,
    height: 16,
    margin: 2.5
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

  /* Props */
  const games: NhlGame[] = useSelector((state: RootState) => nhlScoreboardSelectors.getGames(state))
  const loading: boolean = useSelector((state: RootState) => loadingSelectors.getNhlScoresLoading(state))

  /* Dispatch */
  const dispatch: Dispatch<AnyAction> = useDispatch()
  const getGames = useCallback(() => {
    dispatch(nhlScoreboardActions.getGames())
  }, [dispatch])

  useEffect(() => {
    getGames()
  }, [getGames])

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
          game.scoringPlays.slice(prevGameState.scoringPlays.length - 1).forEach(scoringPlay =>
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
              </Grid>
            )
          )
        }
      }
    }
  }, [games])

  /* State */
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false)
  const prevGames = usePrevious(games)

  return (
    <>
      {games.length > 0 ? (
        <Grid>
          <Grid container justify="flex-end" style={{ padding: '2vh 5vw 0 0', height: '50px' }}>
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
          <Grid
            container
            justify="flex-start"
            alignItems="center"
            direction="column"
            spacing={2}
            style={{ marginTop: '15px', width: '100%' }}
          >
            {games.map(game => (
              <NhlGameScore game={game} showAllExpanded={showAllExpanded} />
            ))}
          </Grid>
        </Grid>
      ) : (
        <div style={{ color: 'white', fontSize: 48 }}>{`No Games on ${moment().format('YYYY-MM-DD')}`}</div>
      )}
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
