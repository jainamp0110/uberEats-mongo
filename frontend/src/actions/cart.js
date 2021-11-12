import { SET_CART_DETAILS } from "./types";

export function setCartItems(payload) {
    
    return {
    type: SET_CART_DETAILS,
    payload,
  };
}
