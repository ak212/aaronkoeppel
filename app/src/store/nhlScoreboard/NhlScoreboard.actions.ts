import { NhlGame } from './NhlScoreboard.types'

/* Action Definition */
export const GET_GAMES = 'GET_GAMES'
export const GET_GAMES_SUCCESS = 'GET_GAMES_SUCCESS'
export const SET_TEAM_LOGOS = 'SET_TEAM_LOGOS'

export const nhlScoreboardActions = {
  getGames: () => {
    return { type: GET_GAMES }
  },
  getGamesSuccess: (games: NhlGame[]) => {
    return { type: GET_GAMES_SUCCESS, games }
  }
}
