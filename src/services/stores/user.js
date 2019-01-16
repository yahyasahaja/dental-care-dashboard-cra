import { observable, computed } from 'mobx'

class User {
  @observable data = null
  @observable isLoading = false

  @computed
  get isLoggedIn() {
    return !!this.data
  }
}

export default window.user = new User()