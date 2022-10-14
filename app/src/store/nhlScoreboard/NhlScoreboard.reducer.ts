import { createReducer } from '@reduxjs/toolkit'

import { getGamesSuccess } from './NhlScoreboard.actions'
import { initialScoreboardState } from './NhlScoreboard.types'

export const nhlScoreboardReducer = createReducer(initialScoreboardState, builder => {
  builder.addCase(getGamesSuccess, (state, action) => {
    state.games = [...action.payload.games]
  })
})
