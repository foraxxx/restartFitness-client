import {makeAutoObservable} from "mobx"
import AuthService from "../services/AuthService.js"
import axios from "axios"
import {API_URL} from "../utils/consts.js"
import MembershipService from "../services/MembershipService.js"

export default class MembershipStore {

  constructor() {
    this._memberships = []
    makeAutoObservable(this)
  }

  setMemberships(memberships) {
    this._memberships = memberships
  }

  get memberships() {
    return this._memberships
  }

  async getAllActive() {
    try {
      const response = await MembershipService.getAllActive()
      // console.log(response.data)
      this.setMemberships(response.data)
    } catch(error) {
      console.log(error)
    }
  }
}