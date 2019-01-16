import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import LoadingPage from './screens/Loading'
import styles from './App.scss'

const Login = React.lazy(() => import('./screens/Auth/login'))

class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Suspense fallback={<LoadingPage />} >
          <BrowserRouter>
            <Route path="/auth/login" render={props => <Login {...props} />} />
          </BrowserRouter>
        </Suspense>
      </div>
    )
  }
}

export default App
