import { makeAutoObservable } from "mobx";
import UserMembershipService from "../services/UserMembershipService.js";

export default class UserMembershipStore {
  _userMemberships = [];

  constructor() {
    makeAutoObservable(this);
  }

  setMemberships(memberships) {
    this._userMemberships = memberships;
  }

  get userMemberships() {
    return this._userMemberships;
  }

  async fetchUserMemberships() {
    try {
      const response = await UserMembershipService.getUserAll();
      this.setMemberships(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async create(id) {
    try {
      const response = await UserMembershipService.create(id);
      const newMembership = response.data;
      this.setMemberships([...this._userMemberships, newMembership]);
    } catch (error) {
      console.error(error);
    }
  }

  async freezeMembership(membershipId, startDate, endDate) {
    try {
      const response = await UserMembershipService.freezing(
        membershipId,
        startDate.toISOString(),
        endDate.toISOString()
      );

      this.setMemberships(response.data)
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Ошибка при заморозке абонемента"
      );
    }
  }
}
