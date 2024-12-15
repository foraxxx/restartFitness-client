import {makeAutoObservable} from "mobx"
import AuthService from "../services/AuthService.js"
import axios from "axios"
import {API_URL} from "../utils/consts.js"

export default class UserStore {

  constructor() {
    this._isAuth = false;
    this._user = {}
    makeAutoObservable(this)
  }

  setAuth(bool) {
    this.isAuth = bool
  }

  setUser(user) {
    this.user = user
  }

  async login(number) {
    try {
      const response = await AuthService.login(number)
      // console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch(error) {
      console.log(error.response?.data?.message)
    }
  }

  async registration(name, surName, number) {
    try {
      const response = await AuthService.registration(name, surName, number)
      // console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch(error) {
      console.log(error.response?.data?.message)
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({})
    } catch(error) {
      console.log(error.response?.data?.message)
    }
  }

  async checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setAuth(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true})
      // console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch(error) {
      console.log(error.response?.data?.message)
      this.setAuth(false)
    }
  }

  startTokenRefresh() {
    setInterval(async () => {
      await this.checkAuth();
    }, 15 * 60 * 1000)
  }
}