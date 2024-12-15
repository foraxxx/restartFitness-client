import $api from "../http/index.js"

export default class AuthService {
  static async login(number) {
    return $api.post('/user/login', {number})
  }

  static async registration(name, surName, number) {
    return $api.post('/user/registration', {name, surName, number})
  }

  static async logout() {
    return $api.post('/user/logout')
  }
}