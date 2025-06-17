import { makeAutoObservable, runInAction } from "mobx";
import ReviewService from "../services/ReviewService.js";

class ReviewStore {
  published = [];
  pending = [];
  isLoading = false;
  error = null;
  currentStatus = "published";

  constructor() {
    makeAutoObservable(this);
  }

  get reviews() {
    if (this.currentStatus === "published") return this.published;
    if (this.currentStatus === "pending") return this.pending;
    return [];
  }

  async fetchReviews() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await ReviewService.getAll();
      runInAction(() => {
        const reviews = response.data;

        this.published = reviews.filter((r) => r.Status?.name === "Опубликован");
        this.pending = reviews.filter((r) => r.Status?.name === "На проверке");
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.message || "Ошибка загрузки отзывов";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createReview(data) {
    this.isLoading = true;
    try {
      const response = await ReviewService.create(data);
      runInAction(() => {
        this.pending.unshift(response.data);
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.message || "Ошибка при создании отзыва";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteReview(id) {
    try {
      await ReviewService.delete(id);
      runInAction(() => {
        this.published = this.published.filter((r) => r.id !== id);
        this.pending = this.pending.filter((r) => r.id !== id);
      });
    } catch (e) {
      console.error("Ошибка при удалении отзыва:", e);
    }
  }

  async updateReview(id) {
    try {
      const response = await ReviewService.publish(id);
      const updated = response.data;

      runInAction(() => {
        this.published = this.published.filter((r) => r.id !== id);
        this.pending = this.pending.filter((r) => r.id !== id);

        if (updated.Status?.name === "Опубликован") {
          this.published.unshift(updated);
        }
        else if (updated.Status?.name === "На проверке") {
          this.pending.unshift(updated);
        }
      });
    } catch (e) {
      console.error("Ошибка при обновлении отзыва:", e);
      throw e;
    }
  }
}

export default new ReviewStore();
