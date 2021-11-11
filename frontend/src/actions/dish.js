import toast from 'react-hot-toast';
import axiosInstance from '../axiosConfig';
import {
  DISH_CREATE_FAILURE,
  DISH_CREATE_REQUEST,
  DISH_CREATE_SUCCESS,
  DISH_DELETE_SUCCESS,
  DISH_IMAGE_UPLOAD_FAILURE,
  DISH_IMAGE_UPLOAD_REQUEST,
  DISH_IMAGE_UPLOAD_SUCCESS,
} from './types';

export function dishImageUploadRequest() {
  return {
    type: DISH_IMAGE_UPLOAD_REQUEST,
  };
}

export function dishImageUploadSuccess(did, link) {
  return (dispatch) => {
    return axiosInstance
      .post(
        `/dishes/images/${did}`,
        {
          imageLink: {imageLink: link},
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        dispatch({
          type: DISH_IMAGE_UPLOAD_SUCCESS,
          payload: res.data,
        });
        toast.success('Dish Image Uploaded');
      })
      .catch((err) => {
        toast.error('Error Uploading Dish Image');
        console.error(err);
      });
  };
}

export function dishImageUploadFailure(payload) {
  return {
    type: DISH_IMAGE_UPLOAD_FAILURE,
    payload,
  };
}

export function dishCreateSuccess(payload) {
  return {
    type: DISH_DELETE_SUCCESS,
    payload,
  };
}

export function dishDeleteSuccess(payload) {
  return {
    type: DISH_DELETE_SUCCESS,
    payload,
  };
}

