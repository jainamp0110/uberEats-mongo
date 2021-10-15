import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
} from 'baseui/modal';

import { Button } from 'baseui/button';
import { FileUploader } from 'baseui/file-uploader';
import { Row, Col } from 'react-bootstrap';
import { FormControl } from 'baseui/form-control';
import axiosInstance from '../../axiosConfig';
import { uploadFile } from 'react-s3';
import { useDispatch, useSelector } from 'react-redux';
import {
  dishCreateSuccess,
  dishImageUploadRequest,
  dishImageUploadSuccess,
} from '../../actions/dish';
import { H2, H3, H5 } from 'baseui/typography';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { TokenExpiredError } from 'jsonwebtoken';
import toast from 'react-hot-toast';

function AddDishModal(props) {
  const dispatch = useDispatch();
  const dish = useSelector((state) => state.dish);
  const { addDishModalIsOpen, setAddDishModalIsOpen, getRestData } = props;
  const [isCreating, setCreating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState([]);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishIngredients, setDishIngredients] = useState('');
  const [dishType, setDishType] = useState('');
  const [dishCategory, setDishCategory] = useState('');
  const [dishPrice, setDishPrice] = useState(null);

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

  const uploadDishImage = (createdDishId) => {
    if (fileToUpload.length > 0) {
      dispatch(dishImageUploadRequest());
      setImageUploading(true);
      uploadFile(fileToUpload[0], config)
        .then((data) => {
          dispatch(dishImageUploadSuccess(createdDishId, data.location));
        })
        .then((res) => {
          setImageUploading(false);
          toast.success('Image Uploaded Succesfully');
        })
        .catch((err) => {
          console.log(err);
          toast.success('Image Upload Unsucessfull');
        });
    }
  };

  const checkProperties = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
      }
    });
  };

  const createDish = (e) => {
    e.preventDefault();
    const dishObj = {
      name: dishName,
      price: dishPrice,
      ingredients: dishIngredients,
      desc: dishDescription,
      category: dishCategory[0]?.category ? dishCategory[0].category : '',
      type: dishType[0]?.type ? dishType[0].type : '',
    };

    checkProperties(dishObj);
    axiosInstance
      .post(`/dishes/newdish`, dishObj, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        dispatch(dishCreateSuccess(true));
        const dishId = res.data.dishDetails.d_id;
        uploadDishImage(dishId);
        toast.success('Dish created');
        setAddDishModalIsOpen(false);
        setDishName('');
        setDishPrice(null);
        setDishType('');
        setDishIngredients('');
        setDishCategory('');
        setDishDescription('');
        setFileToUpload([]);
      })
      .catch((err) => {
        toast.error('Error Creating Dish Image');
        console.error(err);
      });
  };

  return (
    <div>
      <Modal
        isOpen={addDishModalIsOpen}
        closeable
        size="800px"
        onClose={() => {
          setAddDishModalIsOpen(false);
          setDishName('');
          setDishPrice(null);
          setDishType('');
          setDishIngredients('');
          setDishCategory('');
          setDishDescription('');
          setFileToUpload([]);
        }}
      >
        <ModalHeader> New dish</ModalHeader>
        <Row style={{ marginLeft: '5%' }}>
          <Col>
            <ModalBody>
              Upload Image below
              <FileUploader
                onDrop={(acceptedFiles) => {
                  setFileToUpload(acceptedFiles);
                }}
                progressMessage={imageUploading ? 'Uploading....' : ''}
              />
              {fileToUpload.length > 0 ? (
                <p> Selected Image: {fileToUpload[0].name} </p>
              ) : null}
            </ModalBody>
          </Col>
          <Col>
            <form onSubmit={createDish}>
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
                <Button type="submit" style={{ width: '100%' }}>
                  {isCreating ? 'Creating dish' : 'Add dish'}
                </Button>
              </div>
            </form>
          </Col>
        </Row>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
}

export default AddDishModal;
