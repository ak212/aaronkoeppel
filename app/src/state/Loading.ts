import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

export type Loading = {
  campsiteTable: boolean
  nhlScores: boolean
}

export const initialLoading = {
  campsiteTable: false,
  nhlScores: false,
}

export const loadingSelectors = {
  getCampsiteLoading(state: RootState) {
    return state.loading.campsiteTable
  },
  getNhlScoresLoading(state: RootState) {
    return state.loading.nhlScores
  },
}

type LoadingAction = {
  payload: keyof Loading
  type: string
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState: initialLoading,
  reducers: {
    startLoading(state, action: LoadingAction) {
      const loadingIndicator: keyof Loading = action.payload
      state[loadingIndicator] = true
    },
    finishLoading(state, action: LoadingAction) {
      const loadingIndicator: keyof Loading = action.payload
      state[loadingIndicator] = false
    },
  },
})

export const { startLoading, finishLoading } = loadingSlice.actions

export default loadingSlice.reducer
