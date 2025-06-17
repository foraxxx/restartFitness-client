import axios from 'axios';
import $api from "../http/index.js"

class PaymentsService {
  async createPayment(paymentData) {
    const response = await $api.post('/payments/create', paymentData);
    return response.data;
  }
}

export default new PaymentsService();
