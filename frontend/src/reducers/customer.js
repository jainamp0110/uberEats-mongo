import { CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAILURE, CUSTOMER_LOGIN_REQUEST, CUSTOMER_REGISTER_FAILURE, CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_LOGOUT } from "../actions/types";

const initState = {
    customer: {},
    error: '',
};

const customerReducer = (state = initState, action) => {
    switch (action.type) {
        case CUSTOMER_REGISTER_REQUEST:
            return state;
        case CUSTOMER_REGISTER_SUCCESS:
            return { ...state, customer: action.payload };
        case CUSTOMER_REGISTER_FAILURE:
            return { ...state, error: action.payload };
        case CUSTOMER_LOGIN_REQUEST:
            return state;
        case CUSTOMER_LOGIN_SUCCESS:
            return { ...state, customer: action.payload };
        case CUSTOMER_LOGIN_FAILURE:
            return { ...state, error: action.payload };
        case CUSTOMER_LOGOUT:
            localStorage.removeItem("token");
            return initState;
        default:
            return state;
    }
};

export default customerReducer;