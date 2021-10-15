import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
} from 'baseui/modal';
import { dishCreateSuccess, dishDeleteSuccess } from '../../actions/dish';
import { FileUploader } from 'baseui/file-uploader';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import axiosInstance from '../../axiosConfig';
import { uploadFile } from 'react-s3';
import { useDispatch } from 'react-redux';
import {
  dishImageUploadRequest,
  dishImageUploadSuccess,
} from '../../actions/dish';
import { H2, H3, H5 } from 'baseui/typography';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { TokenExpiredError } from 'jsonwebtoken';
import toast from 'react-hot-toast';

const Carousel = require('react-responsive-carousel').Carousel;

// S3 Bucket configurations

const S3_BUCKET = 'ubereats-media';
const ACCESS_KEY = 'AKIA4ZUO22XWRWDIOUMI';
const SECRET_ACCESS_KEY = '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';
const REGION = 'us-east-1';

const config = {
  bucketName: S3_BUCKET,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
};

function UpdateDishModal(props) {
  const dispatch = useDispatch();
  const { dishModalIsOpen, setDishModalIsOpen, dishes, selectedDishId } = props;

  const [dishImages, setDishImages] = useState([]);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishIngredients, setDishIngredients] = useState('');
  const [dishType, setDishType] = useState('');
  const [dishCategory, setDishCategory] = useState('');
  const [dishPrice, setDishPrice] = useState(null);
  const [isUpdating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const updateDishFormHandler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axiosInstance
      .put(
        `dishes/${selectedDishId}`,
        {
          name: dishName,
          price: dishPrice,
          ingredients: dishIngredients,
          desc: dishDescription,
          category: dishCategory[0].category,
          type: dishType[0].type,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        toast.success('Dish Updated Succesfully');
        setDishName('');
        setDishImages('');
        setDishModalIsOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  const deleteDish = (dishId) => {
    const token = localStorage.getItem('token');
    axiosInstance
      .delete(`/dishes/${dishId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        dispatch(dishDeleteSuccess(true));
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  const uploadDishImage = (acceptedFiles) => {
    dispatch(dishImageUploadRequest());
    uploadFile(acceptedFiles[0], config)
      .then((data) => {
        dispatch(dishImageUploadSuccess(selectedDishId, data.location));
      })
      .then((res) => {
        setImageUploading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (dishes && selectedDishId) {
      let selectedDish = dishes.filter((dish) => dish.d_id === selectedDishId);
      if (selectedDish.length > 0) {
        console.log(selectedDish);
        setDishImages(selectedDish[0].dish_imgs);
        setDishName(selectedDish[0].d_name ? selectedDish[0].d_name : '');
        setDishDescription(
          selectedDish[0].d_desc ? selectedDish[0].d_desc : '',
        );
        setDishIngredients(
          selectedDish[0].d_ingredients ? selectedDish[0].d_ingredients : '',
        );
        setDishType(
          selectedDish[0].d_type ? [{ type: selectedDish[0].d_type }] : [],
        );
        setDishCategory(
          selectedDish[0].d_category
            ? [{ category: selectedDish[0].d_category }]
            : [],
        );
        setDishPrice(selectedDish[0].d_price ? selectedDish[0].d_price : null);
      }
    }
  }, [selectedDishId, dishes]);

  return (
    <div style={{ marginLeft: '100px' }}>
      <Modal
        isOpen={dishModalIsOpen}
        closeable
        size="800px"
        onClose={() => setDishModalIsOpen(false)}
      >
        <ModalHeader> Update Dish</ModalHeader>
        <Row style={{ marginLeft: '5%' }}>
          <Col>
            <Carousel showArrows showThumbs={false}>
              {dishImages?.length > 0
                ? dishImages.map((ele) => (
                    <div style={{ height: '200px' }}>
                      <img src={ele.di_img} style={{ borderRadius: '20px' }} />
                    </div>
                  ))
                : null}
            </Carousel>
            <ModalBody>
              Upload Image below
              <FileUploader
                onDrop={(acceptedFiles) => {
                  uploadDishImage(
                    acceptedFiles,
                    selectedDishId,
                    setDishModalIsOpen,
                  );
                }}
                progressMessage={imageUploading ? 'Uploading....' : ''}
              />
            </ModalBody>
          </Col>
          <Col>
            <form onSubmit={updateDishFormHandler}>
              <div style={{ textAlign: 'left', width: '90%' }}>
                <FormControl label="Dish Name">
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Enter Name"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Description">
                  <Input
                    id="desc"
                    autoComplete="off"
                    placeholder="Enter Description"
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Ingredients">
                  <Input
                    id="desc"
                    autoComplete="off"
                    placeholder="Enter Ingredients"
                    value={dishIngredients}
                    onChange={(e) => setDishIngredients(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Dish Type">
                  <Select
                    options={[
                      { type: 'Veg' },
                      { type: 'Non-Veg' },
                      { type: 'Vegan' },
                    ]}
                    valueKey="type"
                    labelKey="type"
                    placeholder=""
                    value={dishType}
                    onChange={({ value }) => setDishType(value)}
                  />
                </FormControl>
                <FormControl label="Dish Category">
                  <Select
                    options={[
                      { category: 'Appetizer' },
                      { category: 'Salads' },
                      { category: 'Main Course' },
                      { category: 'Desserts' },
                      { category: 'Beverages' },
                    ]}
                    valueKey="category"
                    labelKey="category"
                    placeholder=""
                    value={dishCategory}
                    onChange={({ value }) => setDishCategory(value)}
                  />
                </FormControl>
                <FormControl label="Price">
                  <Input
                    id="price"
                    autoComplete="off"
                    placeholder="Enter price"
                    type="number"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                  />
                </FormControl>
                <Button style={{ width: '100%' }} type="submit">
                  {isUpdating ? 'Updating Dish' : 'Update Dish'}
                </Button>
              </div>
            </form>
          </Col>
        </Row>
        <ModalFooter>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              onClick={() => {
                deleteDish(selectedDishId);
                setDishModalIsOpen(false);
              }}
            >
              Delete Dish
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UpdateDishModal;
