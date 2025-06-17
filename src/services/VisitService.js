import $api from "../http/index.js";

export default class VisitService {
  static async markVisit(qrCode, type) {
    return $api.post('/visit/create', { qrCode, type });
  }
}