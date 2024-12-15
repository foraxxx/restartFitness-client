import {makeAutoObservable} from "mobx"
import UserMembershipService from "../services/UserMembershipService.js"

export default class UserMembershipStore {

  constructor() {
    this._userMemberships = []
    makeAutoObservable(this)
  }

  setMemberships(memberships) {
    this.userMemberships = memberships
  }

  get memberships() {
    return this.userMemberships
  }

  async getUserAll() {
    try {
      const response = await UserMembershipService.getUserAll()
      // console.log(response.data)
      this.setMemberships(response.data)
      return response.data
    } catch(error) {
      console.log(error)
    }
  }

  async create(id) {
    try {
      const response = await UserMembershipService.create(id)
      const newMembership = response.data
      this.setMemberships([...this._userMemberships, newMembership])
    } catch (error) {
      console.log(error);
    }
  }
}