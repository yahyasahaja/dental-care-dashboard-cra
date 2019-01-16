import { observable } from 'mobx'

class Token {
  @observable rawToken = null
  @observable isLoading = false
}

export default window.token = new Token()