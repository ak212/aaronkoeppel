import React, { Suspense } from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'

import { Calculator } from './components/calculator/Calculator'
import { MainPage } from './components/MainPage'

const YoutubePlayer = React.lazy(() => import('./components/droneVideos/YoutubePlayer'))
const Campsites = React.lazy(() => import('./components/campgrounds/Campsites'))
const NhlScoreboard = React.lazy(() => import('./components/nhlScoreboard/NhlScoreboard'))

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

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/calculator/" element={<Calculator />} />
          <Route path="/drone-videos/" element={<YoutubePlayer />} />
          <Route path="/campsites/" element={<Campsites />} />
          <Route path="/nhl-scoreboard/" element={<NhlScoreboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
