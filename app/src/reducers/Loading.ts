import { Reducer } from 'redux'

import { State } from './Root'

/* Action Definition */
export const START_LOADING = 'START_LOADING'
export const FINISH_LOADING = 'FINISH_LOADING'

export type Loading = {
  campsiteTable: boolean
  nhlScores: boolean
}

export const initialLoading = {
  campsiteTable: false,
  nhlScores: false
}

export const loadingActions = {
  startLoading: (loadingIndicator: string) => {
    return { type: START_LOADING, loadingIndicator }
  },
  finishLoading: (loadingIndicator: string) => {
    return { type: FINISH_LOADING, loadingIndicator }
  }
}

export const loadingReducer: Reducer<Loading> = (state = initialLoading, action): Loading => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, [action.loadingIndicator]: true }
    case FINISH_LOADING:
      return { ...state, [action.loadingIndicator]: false }
    default:
      return state
  }
}

export const loadingSelectors = {
  getCampsiteLoading(state: State) {
    return state.loading.campsiteTable
  },
  getNhlScoresLoading(state: State) {
    return state.loading.nhlScores
  }
}
