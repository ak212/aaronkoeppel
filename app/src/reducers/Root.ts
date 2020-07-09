import { applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { Campsites, campsitesReducer, initialCampsitesState } from './Campsites'
import { initialLoading, Loading, loadingReducer } from './Loading'

export type State = {
   readonly campsites: Campsites
   readonly loading: Loading
}

export const initialState: State = {
   campsites: initialCampsitesState,
   loading: initialLoading
}

export const rootReducer: Reducer<State> = combineReducers<State>({
   campsites: campsitesReducer,
   loading: loadingReducer
})

export const sagaMiddleware = createSagaMiddleware()

const middlewares: Middleware[] = [sagaMiddleware]

export const STORE: Store<State> = createStore(
   rootReducer,
   initialState,
   composeWithDevTools(applyMiddleware(...middlewares))
)
