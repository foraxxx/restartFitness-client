import UserMembershipService from "../services/UserMembershipService.js"
import MembershipService from "../services/MembershipService.js"
import {makeAutoObservable} from "mobx"

export default class MembershipStore {
  constructor() {
    this._memberships = []
    this._userMemberships = []

    makeAutoObservable(this)
  }

  setMemberships(memberships) {
    this._memberships = memberships
  }

  setUserMemberships(userMemberships) {
    this._userMemberships = userMemberships
  }

  get memberships() {
    return this._memberships
  }

  get userMemberships() {
    return this._userMemberships
  }

  async getAllActive() {
    try {
      const response = await MembershipService.getAllActive()
      this.setMemberships(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async getOne(id) {
    try {
      const response = await MembershipService.getOne(id);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении абонемента:', error);
      return null;
    }
  }

  async fetchUserMemberships() {
    try {
      const response = await UserMembershipService.getUserAll()
      this.setUserMemberships(response.data)
    } catch (error) {
      console.error(error)
    }
  }
}
