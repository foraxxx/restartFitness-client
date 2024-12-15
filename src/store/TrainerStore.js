import {makeAutoObservable} from "mobx"
import TrainerService from "../services/TrainerService.js"

export default class TrainerStore {

  constructor() {
    this._trainers = []
    makeAutoObservable(this)
  }

  setTrainers(trainers) {
    this._trainers = trainers
  }

  get trainers() {
    return this._trainers
  }

  async getAll() {
    try {
      const response = await TrainerService.getAll()
      // console.log(response.data)
      this.setTrainers(response.data)
    } catch(error) {
      console.log(error)
    }
  }
}