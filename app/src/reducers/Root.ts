import { applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { initialScoreboardState, NhlScoreboard, nhlScoreboardReducer } from '../store/nhlScoreboard/'
import { Campsites, campsitesReducer, initialCampsitesState } from './Campsites'
import { initialLoading, Loading, loadingReducer } from './Loading'

export type State = {
  readonly campsites: Campsites
  readonly loading: Loading
  readonly nhlScoreboard: NhlScoreboard
}

export const initialState: State = {
  campsites: initialCampsitesState,
  loading: initialLoading,
  nhlScoreboard: initialScoreboardState
}

export const rootReducer: Reducer<State> = combineReducers<State>({
  campsites: campsitesReducer,
  loading: loadingReducer,
  nhlScoreboard: nhlScoreboardReducer
})

export const sagaMiddleware = createSagaMiddleware()

const middlewares: Middleware[] = [sagaMiddleware]

export const STORE: Store<State> = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
)
