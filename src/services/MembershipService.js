import $api from "../http/index.js"

export default class MembershipService {
  static async getAllActive() {
    return $api.get('/memberships/active')
  }

  static async getOne(id) {
    return $api.get(`/memberships/${id}`)
  }

  static async getAll() {
    return $api.get(`/memberships`)
  }

  static async create(data) {
    return $api.post('/memberships', data);
  }

  static async update(id, data) {
    return $api.put(`/memberships/${id}`, data);
  }

  static async delete(id) {
    return $api.delete(`/memberships/${id}`);
  }
}