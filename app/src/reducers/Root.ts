import { applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { initialNameState, Name, nameReducer } from './Name'

export type State = {
  readonly name: Name;
};

export const initialState: State = {
  name: initialNameState
};

export const rootReducer: Reducer<State> = combineReducers<State>({
  name: nameReducer
});

export const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware];

// export const STORE: Store<State> = createStore(
//   rootReducer,
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );
export const STORE: Store<State> = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
);
