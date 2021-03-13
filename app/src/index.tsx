import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './App'
import { sagaMiddleware, STORE } from './reducers/Root'
import rootSaga from './sagas/RootSaga'
import * as serviceWorker from './serviceWorker'

sagaMiddleware.run(rootSaga)

ReactDOM.render(
   <Provider store={STORE}>
      <App />
   </Provider>,
   document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
