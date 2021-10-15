import axiosConfig from "../axiosConfig";
import { CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAILURE, CUSTOMER_LOGIN_REQUEST, CUSTOMER_REGISTER_FAILURE, CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_LOGOUT } from "./types";

export function loginCustomerRequest() {
    return {
        type: CUSTOMER_LOGIN_REQUEST,
    };
}

export function loginCustomerSuccess(id, token) {
    return (dispatch) => {
        return axiosConfig.get(`customers/${id}`, {
            headers: {
                'Authorization': token
            }
        }).then((res) => {
            dispatch({
                type: CUSTOMER_LOGIN_SUCCESS,
                payload: res.data
            })
        }).catch(err => {
            console.error(err)
        })
    }
}

export function loginCustomerFailure(payload) {
    return {
        type: CUSTOMER_LOGIN_FAILURE, payload
    };
}

export function registerCustomerRequest() {
    return {
        type: CUSTOMER_REGISTER_REQUEST,
    };
}

export function registerCustomerSuccess(id, token) {
    return (dispatch) => {
        return axiosConfig.get(`customers/${id}`, {
            headers: {
                'Authorization': token
            }
        }).then((res) => {
            dispatch({
                type: CUSTOMER_REGISTER_SUCCESS,
                payload: res.data
            })
        }).catch(err => {
            console.error(err)
        })
    }
}

export function registerCustomerFailure(payload) {
    return {
        type: CUSTOMER_REGISTER_FAILURE, payload
    };
}

export function customerLogout() {
    return {
        type: CUSTOMER_LOGOUT
    }
}
