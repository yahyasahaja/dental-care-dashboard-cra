import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import ProgressBar from '@material-ui/core/CircularProgress'

import styles from './css/login.module.scss'

class Login extends Component {
  shouldShowPassword = observable(false)
  email = observable('')
  password = observable('')

  handleChange(name, value) {
    if (typeof value !== 'string') value = value.target.value

    if (name === 'telp')
      if (value[0] === '0') 
        value = value.split('').slice(1).join('')

    this.setState({ [name]: value })
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }))
  }


  render() {
    return (
      <div className={styles.container} >
        <div className={styles.background} >
          <img src="/image/Yosemite.jpg" alt=""/>
        </div>

        <div className={styles.shadow} />

        <div className={styles.wrapper} >
          <TextField
            name="email"
            type="email"
            label="Email"
            className={styles.input}
            onChange={this.handleChange.bind(this, 'email')}
            value={this.email}
            multiline
            fullWidth
            rowsMax={6}
            required
            margin="normal"
            variant="outlined"
          />

          <div className={styles['password-wrapper']}>
            <TextField
              name="password"
              type={this.shouldShowPassword ? 'text' : 'password'}
              label="Password"
              className={styles.password}
              onChange={this.handleChange.bind(this, 'password')}
              value={this.password}
              required
              fullWidth
              autoComplete="current-password"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.shouldShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default observer(Login)