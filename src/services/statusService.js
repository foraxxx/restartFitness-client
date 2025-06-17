import $api from "../http/index.js";

export default class statusService {
  static async getAllForMemberships() {
    return $api.get(`/statuses/memberships`);
  }

}

