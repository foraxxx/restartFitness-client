import $api from "../http/index.js";

export default class ReviewService {
  static async create({ description, rating, isAnonymous }) {
    return $api.post('/reviews', { description, rating, isAnonymous });
  }

  // Получение всех отзывов
  static async getAll() {
    return $api.get('/reviews');
  }

  // Обновление статуса отзыва (публикация)
  static async publish(id) {
    return $api.put(`/reviews/${id}`);
  }

  static async updateStatus(id, statusName) {
    return $api.put(`/reviews/${id}`, { status: statusName });
  }

  // Удаление отзыва
  static async delete(id) {
    return $api.delete(`/reviews/${id}`);
  }
}
