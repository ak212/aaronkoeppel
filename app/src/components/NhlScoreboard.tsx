import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import moment from 'moment'
import React, { Dispatch, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

import { loadingSelectors } from '../reducers/Loading'
import { NhlGame, nhlScoreboardActions, nhlScoreboardSelectors } from '../reducers/NhlScoreboard'
import { State as RootState } from '../reducers/Root'
import { NhlGameScore } from './NhlGameScore'

export const NhlScoreboard = () => {
   const dispatch: Dispatch<AnyAction> = useDispatch()
   const getGames = () => {
      dispatch(nhlScoreboardActions.getGames())
   }

   useEffect(() => {
      getGames()
   }, [])

   useEffect(() => {
      const interval = setInterval(() => {
         getGames()
      }, 20000)
      return () => clearInterval(interval)
   })

   const games: NhlGame[] = useSelector((state: RootState) => nhlScoreboardSelectors.getGames(state))
   const loading: boolean = useSelector((state: RootState) => loadingSelectors.getNhlScoresLoading(state))

   return (
      <>
         {games.length > 0 ? (
            <Grid
               container
               justify="flex-start"
               alignItems="center"
               direction="column"
               spacing={2}
               style={{ marginTop: '15px', width: '100%' }}
            >
               {games.map((game) => (
                  <NhlGameScore game={game} />
               ))}
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
