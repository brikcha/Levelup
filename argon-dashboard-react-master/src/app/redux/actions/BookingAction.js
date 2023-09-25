import BookingService from "../../../infrastructure/services/api/BookingService";
import {
  BOOKING_CREATE_FAIL,
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_SUCCESS,
  BOOKING_DELETE_REQUEST,
  BOOKING_DELETE_SUCCESS,
  BOOKING_LIST_MY_FAIL,
  BOOKING_LIST_MY_REQUEST,
  BOOKING_LIST_MY_SUCCESS,
} from "../types/bookingTypes";
import { toast } from "react-toastify";

export const CreateBooking = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKING_CREATE_REQUEST,
    });

    BookingService.createBooking(data).then((response) => {
      alert(JSON.stringify(response));
      dispatch({
        type: BOOKING_CREATE_SUCCESS,
        payload: response,
      });

      if (response.data.success) {
        toast.success("your Booking was send successfully!");

        return;
      }
    });
  } catch (error) {
    dispatch({
      type: BOOKING_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listBookings = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKING_LIST_MY_REQUEST,
    });

    BookingService.myBooking().then((response) => {
      dispatch({
        type: BOOKING_LIST_MY_SUCCESS,
        payload: response.data,
      });
    });
  } catch (error) {
    dispatch({
      type: BOOKING_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const DeleteBooking = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKING_DELETE_REQUEST,
    });

    await BookingService.removeBooking(id);
    dispatch({
      type: BOOKING_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
