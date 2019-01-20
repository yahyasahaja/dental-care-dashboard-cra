import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
// import Icon from '@material-ui/core/Icon'
import SendIcon from '@material-ui/icons/Send'
// import ProgressBar from '@material-ui/core/CircularProgress'

import styles from './css/login.module.scss'

@observer
class Login extends Component {
  @observable shouldShowPassword = false
  @observable email = ''
  @observable password = ''

  handleChange(name, value) {
    this[name] = value.target.value
  }

  handleClickShowPassword = () => {
    this.shouldShowPassword = !this.shouldShowPassword
  }

  renderButton() {
    if (!this.isLoading) return (
      <Button 
        fullWidth 
        size="large"
        variant="contained" 
        color="primary"
        style={{marginTop: 20, color: 'white'}}
        type="submit"
      >
        Send
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
        <SendIcon style={{marginLeft: 10}} />
      </Button>
    )
  }

  onSubmit = e => {
    e.preventDefault()
  }

  render() {
    return (
      <form className={styles.container} onSubmit={this.onSubmit} >
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

          {this.renderButton()}
        </div>
      </form>
    )
  }
}

export default Login