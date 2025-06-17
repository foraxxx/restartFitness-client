// src/services/NewsService.js
import $api from "../http/index.js";

export default class NewsService {
  static async getByStatus(status) {
    return $api.get(`/news/${status}`);
  }

  static async create(formData) {
    return $api.post("/news", formData);
  }

  static async update(id, formData) {
    return $api.put(`/news/${id}`, formData);
  }

  static async delete(id) {
    return $api.delete(`/news/${id}`);
  }
}

