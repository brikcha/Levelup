import axios from "axios";
import { authenticate } from "../../../_helper/auth";
import { API_URL, authToken } from "./ApiUrl";
import Cookies from "js-cookie";

class BookingService {
  getBookings = async () =>
    await axios.get(`${API_URL}/booking/getBookings`, {
      headers: { Authorization: `${Cookies.get("token")}` },
    });

  myBooking = async () =>
    await axios.get(`${API_URL}/booking/mybooking`, {
      headers: { Authorization: `${Cookies.get("token")}` },
    });

  removeBooking = async (id) =>
    await axios.delete(`${API_URL}/booking/deleteBooking/${id}`, {
      headers: { Authorization: `${Cookies.get("token")}` },
    });

  updateBooking = async (id, Booking) =>
    await axios.put(`${API_URL}/booking/updateBooking/${id}`, Booking, {
      headers: { Authorization: `${Cookies.get("token")}` },
    });

  createBooking = async (data) =>
    await axios.post(`${API_URL}/booking/addBooking`, data, {
      headers: {
        Authorization: `${Cookies.get("token")}`,
      },
    });
}
export default new BookingService();
