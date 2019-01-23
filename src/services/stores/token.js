import { observable, computed, action } from 'mobx'
import axios from 'axios'
import { ACCESS_TOKEN_STORAGE_URI, REFRESH_TOKEN_STORAGE_URI } from '../../config'
import user from './user'

class Token {
  @observable rawAccessToken = null
  @observable refreshToken = null
  @observable isSettingUp = true

  @computed
  get bearerAccessToken() {
    return `Bearer ${this.rawAccessToken}`
  }

  @action
  async setup() {
    this.isSettingUp = true 
    //get access token
    let access_token = localStorage.getItem(ACCESS_TOKEN_STORAGE_URI)
    if (!access_token) return this.isSettingUp = false
    this.setAccessToken(access_token)
    
    //check if not expired
    let userData = await user.getUser()
    if (userData) {
      this.isSettingUp = false
      return userData
    }

    //if expired, refresh token
    let refresh = localStorage.getItem(REFRESH_TOKEN_STORAGE_URI)
    
    try {
      let {
        data: {
          access_token,
          refresh_token,
        }
      } = await axios.post('/api/login/refresh', {
        refresh_token: refresh
      })

      this.setAccessToken(access_token)
      this.setRefreshToken(refresh_token)

      userData = await user.getUser() 
      this.isSettingUp = false
      return userData
    } catch (err) {
      this.isSettingUp = false
      console.log('ERROR WHILE SETTING UP', err)
    }
  }

  @action
  setAccessToken(token) {
    this.rawAccessToken = token
    axios.defaults.headers['Authorization'] = this.bearerAccessToken
    localStorage.setItem(ACCESS_TOKEN_STORAGE_URI, token)
  }

  @action
  setRefreshToken(token) {
    this.refreshToken = token
    localStorage.setItem(REFRESH_TOKEN_STORAGE_URI, token)
  }
}

export default window.token = new Token()