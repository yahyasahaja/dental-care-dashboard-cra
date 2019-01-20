import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import LoadingPage from './screens/Loading'
import styles from './App.module.scss'

const Login = React.lazy(
  () => import(/*webpackChunkName: "Login"*/ './screens/Auth/Login')
)
const Dashboard = React.lazy(
  () => import(/*webpackChunkName: "Dashboard"*/ './screens/Dashboard')
)

class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.shadow} />
        <Suspense fallback={<LoadingPage />} >
          <BrowserRouter>
            <Switch>
              <Route path="/auth/login" render={props => <Login {...props} />} />
              <Route path="/dashboard/*" render={props => <Dashboard {...props} />} />
              <Redirect from="/dashboard" to="/dashboard/membership" />
            </Switch>
          </BrowserRouter>
        </Suspense>
      </div>
    )
  }
}

export default App
