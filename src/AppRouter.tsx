import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Calculator from './components/Calculator'
import MainPage from './components/MainPage'
import { ConnectedReduxTest } from './components/ReduxTest';

class AppRouter extends React.Component {
  public render = () => {
    return (
      <Router>
        <div>
          <Menu>
            <Link to="/">Home</Link>
            <Link to="/calculator/">Calculator</Link>
            <Link to="/redux-test">Redux</Link>
          </Menu>

          <Route path="/" exact component={MainPage} />
          <Route path="/calculator/" component={Calculator} />
          <Route path="/redux-test/" component={ConnectedReduxTest} />
        </div>
      </Router>
    )
  }
}

export default AppRouter
