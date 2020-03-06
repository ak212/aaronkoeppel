import { applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import { initialNameState, Name, nameReducer } from './Name'

export type State = {
   readonly name: Name
}

export const initialState: State = {
   name: initialNameState
}

export const rootReducer: Reducer<State> = combineReducers<State>({
   name: nameReducer
})

export const sagaMiddleware = createSagaMiddleware()

const middlewares: Middleware[] = [sagaMiddleware]

export const STORE: Store<State> = createStore(
   rootReducer,
   initialState,
   composeWithDevTools(applyMiddleware(...middlewares))
)
