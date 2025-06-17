import $api from "../http/index.js";

export default class typeService {
  static async getAllForMemberships() {
    return $api.get(`/types/all`);
  }

}

