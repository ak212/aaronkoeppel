import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Calculator from './components/Calculator'
import Footer from './components/Footer'
import MainPage from './components/MainPage'
import { ConnectedReduxTest } from './components/ReduxTest'
import YoutubePlayer from './components/YoutubePlayer'

class AppRouter extends React.Component {
   public render = () => {
      return (
         <Router>
            <div>
               <Menu>
                  <Link to='/'>Home</Link>
                  <Link to='/calculator/'>Calculator</Link>
                  <Link to='/drone-videos'>Drone Videos</Link>
                  <Link to='/redux-test'>Redux</Link>
               </Menu>

               <Route path='/' exact component={MainPage} />
               <Route path='/calculator/' component={Calculator} />
               <Route path='/drone-videos/' component={YoutubePlayer} />
               <Route path='/redux-test/' component={ConnectedReduxTest} />
            </div>
            <Footer />
         </Router>
      )
   }
}

export default AppRouter
