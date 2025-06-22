import $api from "../http/index.js"

export default class AnalyticService {
  static async getAnalytic() {
    return $api.get('/analytic')
  }
}