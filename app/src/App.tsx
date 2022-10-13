import './App.css'

import React from 'react'

import { SnackbarProvider } from 'notistack'
import { AppRouter } from './AppRouter'
import { Footer } from './components/common/Footer'

export const App = (): JSX.Element => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div className="App">
        <AppRouter />
        <Footer />
      </div>
    </SnackbarProvider>
  )
}
