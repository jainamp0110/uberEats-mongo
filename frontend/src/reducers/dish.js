import {
  DISH_DELETE_SUCCESS,
  DISH_CREATE_SUCCESS,
  DISH_IMAGE_DELETE_FAILURE,
  DISH_IMAGE_DELETE_REQUEST,
  DISH_IMAGE_DELETE_SUCCESS,
  DISH_IMAGE_UPLOAD_FAILURE,
  DISH_IMAGE_UPLOAD_REQUEST,
  DISH_IMAGE_UPLOAD_SUCCESS,
} from "../actions/types";

const initState = {
  dishes: {},
  error: "",
  dishCreateFlag: false,
  dishDeleteFlag: false,
};

const dishReducer = (state = initState, action) => {
  switch (action.type) {
    case DISH_IMAGE_UPLOAD_REQUEST:
      return state;
    case DISH_IMAGE_UPLOAD_SUCCESS:
      return { ...state, dishes: action.payload };
    case DISH_IMAGE_UPLOAD_FAILURE:
      return { ...state, error: action.payload };
    case DISH_IMAGE_DELETE_REQUEST:
      return state;
    case DISH_IMAGE_DELETE_SUCCESS:
      return { ...state, dishes: action.payload };
    case DISH_IMAGE_DELETE_FAILURE:
      return { ...state, error: action.payload };
    case DISH_CREATE_SUCCESS:
      return { ...state, dishCreateFlag: action.payload };
    case DISH_DELETE_SUCCESS:
      return { ...state, dishDeleteFlag: action.payload };
    default:
      return state;
  }
};

export default dishReducer;
