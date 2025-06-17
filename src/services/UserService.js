import $api from "../http/index.js"

export default class UserService {
  static async getAll() {
    return $api.get('/user/all')
  }

  static async getOne(id) {
    return $api.get(`/user/${id}`)
  }

  static async create(data) {
    return $api.post(`/user/create`, data)
  }
}