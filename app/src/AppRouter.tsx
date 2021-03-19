import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import { Calculator } from './components/calculator/Calculator'
import { Campsites } from './components/campgrounds/Campsites'
import { YoutubePlayer } from './components/droneVideos/YoutubePlayer'
import { MainPage } from './components/MainPage'
import { NhlScoreboard } from './components/nhlScoreboard/NhlScoreboard'

export const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Menu>
        <Link to="/">Home</Link>
        {/* <Link to='/calculator/'>Calculator</Link> */}
        <Link to="/drone-videos">Drone Videos</Link>
        <Link to="/campsites">Campsites</Link>
        <Link to="/nhl-scoreboard">NHL Scoreboard</Link>
      </Menu>

      <Route path="/" exact component={MainPage} />
      <Route path="/calculator/" component={Calculator} />
      <Route path="/drone-videos/" component={YoutubePlayer} />
      <Route path="/campsites/" component={Campsites} />
      <Route path="/nhl-scoreboard/" component={NhlScoreboard} />
    </Router>
  )
}
