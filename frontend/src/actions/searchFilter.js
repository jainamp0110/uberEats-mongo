import { SET_DELIVERY_TYPE, SET_DISH_TYPE, SET_LOCATION, SET_SEARCH_KEYWORD } from "./types";

export function setLocation(payload) {
    return {
        type: SET_LOCATION, payload
    };
}

export function setDeliveryTypeAction(payload) {
    return {
        type: SET_DELIVERY_TYPE, payload
    };
}

export function setDishTypeAction(payload) {
    return {
        type: SET_DISH_TYPE, payload
    };
}

export function setSearchKeyWordAction(payload) {
    return {
        type: SET_SEARCH_KEYWORD, payload
    };
}