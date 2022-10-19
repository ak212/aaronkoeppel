import React, { Suspense } from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'

import { MainPage } from './pages/home/MainPage'
import { Calculator } from './pages/calculator/Calculator'

const YoutubePlayer = React.lazy(() => import('./pages/drone-videos/YoutubePlayer'))
const Campgrounds = React.lazy(() => import('./pages/campgrounds/Campgrounds'))
const NhlScoreboard = React.lazy(() => import('./pages/nhl-scoreboard/NhlScoreboard'))

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
          <Route path="/campsites/" element={<Campgrounds />} />
          <Route path="/nhl-scoreboard/" element={<NhlScoreboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
