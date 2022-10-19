import { createAction } from '@reduxjs/toolkit'
import { NhlGame } from './nhlScoreboard.types'

/* Action Definition */
const PREFIX = 'nhlScoreboard'
export const GET_GAMES = `${PREFIX}/getGames`
export const GET_GAMES_SUCCESS = `${PREFIX}/getGamesSuccess`

export const getGames = createAction(GET_GAMES, function prepare(gameDate: number) {
  return {
    payload: {
      gameDate,
    },
  }
})

export const getGamesSuccess = createAction(GET_GAMES_SUCCESS, function prepare(games: NhlGame[]) {
  return {
    payload: {
      games,
    },
  }
})
