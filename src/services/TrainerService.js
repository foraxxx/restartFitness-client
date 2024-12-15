import $api from "../http/index.js"

export default class TrainerService {
  static async getAll() {
    return $api.get('/trainers/')
  }

  // static async registration(name, surName, number) {
  //   return $api.post('/user/registration', {name, surName, number})
  // }
  //
  // static async logout() {
  //   return $api.post('/user/logout')
  // }
}