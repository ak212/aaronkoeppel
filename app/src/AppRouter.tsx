import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Calculator from './components/Calculator'
import { ConnectedCampsites } from './components/Campsites'
import MainPage from './components/MainPage'
import YoutubePlayer from './components/YoutubePlayer'

class AppRouter extends React.Component {
   public render = () => {
      return (
         <Router>
            <Menu>
               <Link to='/'>Home</Link>
               <Link to='/calculator/'>Calculator</Link>
               <Link to='/drone-videos'>Drone Videos</Link>
               <Link to='/campsites'>Campsites</Link>
            </Menu>

            <Route path='/' exact component={MainPage} />
            <Route path='/calculator/' component={Calculator} />
            <Route path='/drone-videos/' component={YoutubePlayer} />
            <Route path='/campsites/' component={ConnectedCampsites} />
         </Router>
      )
   }
}

export default AppRouter
