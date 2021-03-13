import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import moment from 'moment'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

import { loadingSelectors } from '../reducers/Loading'
import { NhlGame, nhlScoreboardActions, nhlScoreboardSelectors } from '../reducers/NhlScoreboard'
import { State as RootState } from '../reducers/Root'
import { NhlGameScore } from './NhlGameScore'

export const NhlScoreboard = () => {
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

  /* State */
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false)

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
            {games.map((game) => (
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
