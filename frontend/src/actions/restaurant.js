import axiosConfig from "../axiosConfig";
import {RESTAURANT_LOGIN_SUCCESS, RESTAURANT_LOGIN_REQUEST, RESTAURANT_LOGIN_FAILURE, RESTAURANT_REGISTER_FAILURE, RESTAURANT_REGISTER_REQUEST, RESTAURANT_REGISTER_SUCCESS, RESTAURANT_LOGOUT} from './types'

export function loginRestaurantRequest() {
    return {
        type: RESTAURANT_LOGIN_REQUEST,
    };
}

export function loginRestaurantSuccess(id, token) {
    return (dispatch) => {
        return axiosConfig.get(`restaurant/${id}`, {
            headers: {
                'Authorization': token
            }
        }).then((res) => {
            dispatch({
                type: RESTAURANT_LOGIN_SUCCESS,
                payload: res.data
            })
        }).catch(err => {
            console.error(err)
        })
    }
}

export function loginRestaurantFailure(payload) {
    return {
        type: RESTAURANT_LOGIN_FAILURE, payload
    };
}

export function registerRestaurantRequest() {
    return {
        type: RESTAURANT_REGISTER_REQUEST,
    };
}

export function registerRestaurantSuccess(id, token) {
    return (dispatch) => {
        return axiosConfig.get(`restaurant/${id}`, {
            headers: {
                'Authorization': token
            }
        }).then((res) => {
            dispatch({
                type: RESTAURANT_REGISTER_SUCCESS,
                payload: res.data
            })
        }).catch(err => {
            console.error(err)
        })
    }
}

export function registerRestaurantFailure(payload) {
    return {
        type: RESTAURANT_REGISTER_FAILURE, payload
    };
}

export function restaurantLogout() {
    return {
        type: RESTAURANT_LOGOUT
    }
}
