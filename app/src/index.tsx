import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { App } from './App'
import rootSaga from './sagas/RootSaga'
import * as serviceWorker from './serviceWorker'
import { sagaMiddleware, STORE } from './state/store'

sagaMiddleware.run(rootSaga)

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <Provider store={STORE}>
    <App />
  </Provider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
