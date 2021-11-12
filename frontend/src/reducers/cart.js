import { SET_CART_DETAILS } from "../actions/types";

const initState = {
  cartDetails: [],
  error: "",
};

const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_CART_DETAILS:
      return { ...state, cartDetails: action.payload };
    default:
      return state;
  }
};

export default cartReducer;