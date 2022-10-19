import { createReducer } from '@reduxjs/toolkit'

import { getGamesSuccess } from './nhlScoreboard.actions'
import { initialScoreboardState } from './nhlScoreboard.types'

export const nhlScoreboardReducer = createReducer(initialScoreboardState, builder => {
  builder.addCase(getGamesSuccess, (state, action) => {
    state.games = [...action.payload.games]
  })
})
