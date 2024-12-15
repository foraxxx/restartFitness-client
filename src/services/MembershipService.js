import $api from "../http/index.js"

export default class MembershipService {
  static async getAllActive() {
    return $api.get('/memberships/active')
  }

  // static async registration(name, surName, number) {
  //   return $api.post('/user/registration', {name, surName, number})
  // }
  //
  // static async logout() {
  //   return $api.post('/user/logout')
  // }
}