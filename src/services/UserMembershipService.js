import $api from "../http/index.js"

export default class UserMembershipService {
  static async create(id) {
    return $api.post(`/usermemberships/${id}`, {})
  }

  static async getUserAll() {
    return $api.get(`/usermemberships/`)
  }
}