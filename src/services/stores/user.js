import { observable, computed, action } from 'mobx'
import axios from 'axios'
import snackbar from './snackbar';
import token from './token'

class User {
  @observable data = null
  @observable isLoading = false
  @observable isFetchingUsers = false
  @observable isLoadingLogin = false

  @computed
  get isLoggedIn() {
    return !!this.data
  }

  @action
  async login(email, password) {
    try {
      this.isLoadingLogin = true

      let {
        data: {
          access_token,
          refresh_token
        }
      } = await axios.post('/api/login', {
        email, password
      })
      
      token.setAccessToken(access_token)
      token.setRefreshToken(refresh_token)
      await this.getUser()
      this.isLoadingLogin = false

      return access_token
    } catch(err) {
      this.isLoadingLogin = false
      console.log('ERROR WHILE LOGIN', err)
    }
  }

  @action
  async getUser() {
    try {
      this.isLoading = true
      let { data } = await axios.get('/api/user/')
      this.data = data
      this.isLoading = false
      console.log(data)
      return data
    } catch (err) {
      this.isLoading = false
      snackbar.show('Error fetching user')
      console.log('ERROR WHILE FETCHING USERS', err)
    }
  }

  @action
  async getUsers() {
    try {
      this.isFetchingUsers = true
      let { data: { data } } = await axios.get('/api/users')
      this.isFetchingUsers = false
      console.log(data)
      return data
    } catch (err) {
      this.isFetchingUsers = false
      snackbar.show('Error fetching user')
      console.log('ERROR WHILE FETCHING USERS', err)
    }
  }
}

export default window.user = new User()