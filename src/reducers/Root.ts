import { Reducer, combineReducers, Middleware, createStore, Store, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga'
import { Name, nameReducer, initialNameState } from "./Name";

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
    applyMiddleware(...middlewares)
)