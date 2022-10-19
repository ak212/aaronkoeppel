import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { campsitesReducer } from '../store/campgrounds'
import { nhlScoreboardReducer } from '../store/nhl-scoreboard'
import loadingReducer from './Loading'

export const sagaMiddleware = createSagaMiddleware()

export const STORE = configureStore({
  reducer: {
    campsites: campsitesReducer,
    loading: loadingReducer,
    nhlScoreboard: nhlScoreboardReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({ thunk: false }).prepend(sagaMiddleware)
  },
})

export type RootState = ReturnType<typeof STORE.getState>
export type AppDispatch = typeof STORE.dispatch
