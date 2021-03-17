import './App.css'

import React from 'react'

import { AppRouter } from './AppRouter'
import Footer from './components/common/Footer'

export const App = (): JSX.Element => {
  return (
    <div className="App">
      <AppRouter />
      <Footer />
    </div>
  )
}
