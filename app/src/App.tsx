import './App.css'

import React from 'react'

import AppRouter from './AppRouter'
import Footer from './components/common/Footer'

const App: React.FC = () => {
   return (
      <div className='App'>
         <AppRouter />
         <Footer />
      </div>
   )
}

export default App
