import { makeAutoObservable, runInAction } from "mobx";
import NewsService from "../services/NewsService.js";
import log from "eslint-plugin-react/lib/util/log.js"

class NewsStore {
  published = [];
  postponed = [];
  archived = [];
  isLoading = false;
  error = null;
  currentStatus = "published";

  constructor() {
    makeAutoObservable(this);
  }

  get news() {
    if (this.currentStatus === "published") return this.published;
    if (this.currentStatus === "postponed") return this.postponed;
    if (this.currentStatus === "archived") return this.archived;
    return [];
  }

  async createNews(formData) {
    try {
      this.isLoading = true;
      const response = await NewsService.create(formData);
      runInAction(() => {
        const newsItem = response.data;
        if (newsItem.status === "published") this.published.unshift(newsItem);
        else if (newsItem.status === "postponed") this.postponed.unshift(newsItem);
        else if (newsItem.status === "archived") this.archived.unshift(newsItem);
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.message || "Ошибка при создании новости";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchNewsByStatus(status) {
    this.currentStatus = status;
    this.isLoading = true;
    this.error = null;

    try {
      const response = await NewsService.getByStatus(status);
      runInAction(() => {
        const sorted = response.data.sort(
          (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
        );

        if (status === "published") this.published = sorted;
        if (status === "postponed") this.postponed = sorted;
        if (status === "archived") this.archived = sorted;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.message || "Ошибка загрузки новостей";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteNews(id) {
    try {
      await NewsService.delete(id);
      runInAction(() => {
        this.published = this.published.filter((news) => news.id !== id);
        this.postponed = this.postponed.filter((news) => news.id !== id);
        this.archived = this.archived.filter((news) => news.id !== id);
      });
    } catch (e) {
      console.error("Ошибка при удалении новости:", e);
    }
  }

  async updateNews(id, formData) {
    try {
      const response = await NewsService.update(id, formData);
      runInAction(() => {
        let targetArray;
        if (this.currentStatus === "published") targetArray = this.published;
        else if (this.currentStatus === "postponed") targetArray = this.postponed;
        else if (this.currentStatus === "archived") targetArray = this.archived;
        else return;

        const index = targetArray.findIndex((news) => news.id === id);
        if (index !== -1) {
          targetArray[index] = response.data;
        }
      });
    } catch (e) {
      console.error("Ошибка при обновлении новости1:", e);
      throw e;
    }
  }
}

export default new NewsStore();
