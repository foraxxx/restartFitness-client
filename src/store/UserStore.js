import {makeAutoObservable, runInAction} from "mobx"
import AuthService from "../services/AuthService.js";
import axios from "axios";
import { API_URL } from "../utils/consts.js";
import UserService from "../services/UserService.js"
import MembershipService from "../services/MembershipService.js"

export default class UserStore {
  isAuth = false;
  user = {};

  users = [];
  isUsersLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setUsers(users) {
    this.users = users;
  }

  setUsersLoading(bool) {
    this.isUsersLoading = bool;
  }

  async login(number) {
    try {
      const response = await AuthService.login(number);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }

  async registration(name, surName, number) {
    try {
      const response = await AuthService.registration(name, surName, number);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const createdUserData = await UserService.create(data);
      return createdUserData.data;
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
      this.setUsers([]);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get(`${API_URL}/user/refresh`, {
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      this.setAuth(false);
      this.setUser({});
      localStorage.removeItem("token");
    }
  }

  // Новый метод для загрузки всех пользователей
  async fetchUsers() {
    try {
      const response = await UserService.getAll()
      console.log(response.data)
      this.setUsers(response.data)
    } catch(error) {
      console.log(error)
    }
  }

}
