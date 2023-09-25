import {
  BOOKING_CREATE_FAIL,
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_RESET,
  BOOKING_CREATE_SUCCESS,
  BOOKING_DELETE_FAIL,
  BOOKING_DELETE_REQUEST,
  BOOKING_DELETE_SUCCESS,
  BOOKING_LIST_MY_FAIL,
  BOOKING_LIST_MY_REQUEST,
  BOOKING_LIST_MY_RESET,
  BOOKING_LIST_MY_SUCCESS,
} from "../types/bookingTypes";

export const bookingCreateReducer = (
  state = { loading: false, success: false, error: false },
  action
) => {
  switch (action.type) {
    case BOOKING_CREATE_REQUEST:
      return { loading: true };
    case BOOKING_CREATE_SUCCESS:
      return { loading: false, success: true, BOOKING: action.payload };
    case BOOKING_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case BOOKING_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const bookingDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BOOKING_DELETE_REQUEST:
      return { loading: true };
    case BOOKING_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BOOKING_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bookingListMyreducer = (
  state = { bookings: [], loading: false },
  action
) => {
  switch (action.type) {
    case BOOKING_LIST_MY_REQUEST:
      return {
        loading: true,
      };
    case BOOKING_LIST_MY_SUCCESS:
      return {
        loading: false,
        bookings: action.payload,
      };
    case BOOKING_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case BOOKING_LIST_MY_RESET:
      return { bookings: [] };
    default:
      return state;
  }
};
