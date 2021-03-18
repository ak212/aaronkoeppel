import { Reducer } from 'redux'

import { GET_GAMES_SUCCESS } from './NhlScoreboard.actions'
import { initialScoreboardState, NhlScoreboard } from './NhlScoreboard.types'

export const nhlScoreboardReducer: Reducer<NhlScoreboard> = (state = initialScoreboardState, action): NhlScoreboard => {
  switch (action.type) {
    case GET_GAMES_SUCCESS:
      if (action.games) {
        return { ...state, games: [...action.games] }
      }
      return state
    default:
      return state
  }
}
