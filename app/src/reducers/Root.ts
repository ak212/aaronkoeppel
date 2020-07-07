import { applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { Campsites, campsitesReducer, initialCampsitesState } from './Campsites'
import { initialLoading, Loading, loadingReducer } from './Loading'
import { initialNameState, Name, nameReducer } from './Name'

export type State = {
   readonly name: Name
   readonly campsites: Campsites
   readonly loading: Loading
}

export const initialState: State = {
   name: initialNameState,
   campsites: initialCampsitesState,
   loading: initialLoading
}

export const rootReducer: Reducer<State> = combineReducers<State>({
   name: nameReducer,
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
