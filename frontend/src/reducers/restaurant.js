import { RESTAURANT_LOGIN_SUCCESS, RESTAURANT_LOGIN_FAILURE, RESTAURANT_LOGIN_REQUEST, RESTAURANT_REGISTER_FAILURE, RESTAURANT_REGISTER_REQUEST, RESTAURANT_REGISTER_SUCCESS, RESTAURANT_LOGOUT } from "../actions/types";

const initState = {
    restaurant: {},
    dishes: [],
    error: '',
};

const restaurantReducer = (state = initState, action) => {
    switch (action.type) {
        case RESTAURANT_REGISTER_REQUEST:
            return state;
        case RESTAURANT_REGISTER_SUCCESS:
            return { ...state, restaurant: action.payload, dishes: action.payload.dishes};
        case RESTAURANT_REGISTER_FAILURE:
            return { ...state, error: action.payload };
        case RESTAURANT_LOGIN_REQUEST:
            return state;
        case RESTAURANT_LOGIN_SUCCESS:
            console.log(action.payload)
            return { ...state, restaurant: action.payload, dishes: action.payload.dishes};
        case RESTAURANT_LOGIN_FAILURE:
            return { ...state, error: action.payload };
        case RESTAURANT_LOGOUT:
            localStorage.removeItem("token");
            return initState;
        default:
            return state;
    }
};

export default restaurantReducer;