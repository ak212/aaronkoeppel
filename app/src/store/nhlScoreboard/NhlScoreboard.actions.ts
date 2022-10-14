import { createAction } from '@reduxjs/toolkit'
import { NhlGame } from './NhlScoreboard.types'

/* Action Definition */
export const GET_GAMES = 'GET_GAMES'
export const GET_GAMES_SUCCESS = 'GET_GAMES_SUCCESS'

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
