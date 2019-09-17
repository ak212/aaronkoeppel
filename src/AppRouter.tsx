import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Calculator from './Calculator'
import MainPage from './MainPage'

class AppRouter extends React.Component {
  public render = () => {
    return (
      <Router>
        <div>
          <Menu>
            <Link to="/">Home</Link>
            <Link to="/calculator/">Calculator</Link>
          </Menu>

          <Route path="/" exact component={MainPage} />
          <Route path="/calculator/" component={Calculator} />
        </div>
      </Router>
    )
  }
}

export default AppRouter
