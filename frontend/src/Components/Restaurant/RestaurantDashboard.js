import RestaurantNavbar from './RestaurantNavbar';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import '../../assets/css/restaurantHome.css';

import { uploadFile } from 'react-s3';
import axiosInstance from '../../axiosConfig';
import { Display2, H1, H2, H3, H4, H5, H6 } from 'baseui/typography';
import { FileUploader } from 'baseui/file-uploader';

import { Button } from 'baseui/button';
import { Col, Row } from 'react-bootstrap';

import { Input } from 'baseui/input';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { TimePicker } from 'baseui/timepicker';
import toast from 'react-hot-toast';

const jwt = require('jsonwebtoken');

const Carousel = require('react-responsive-carousel').Carousel;

function RestaurantDashboard() {
  const history = useHistory();
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const [images, setimages] = useState([]);
  const [restDetails, setRestDetails] = useState({});

  const [formDetails, setformDetails] = useState({});

  const [isUpdating, setUpdating] = useState(false);

  const getRestData = () => {
    const token = localStorage.getItem('token');
    if (!token || token.length === 0) {
      history.push('/');
    }
    const tokenData = jwt.decode(token);
    if (tokenData.role === 'customer' || !tokenData.id) {
      history.push('/');
    }

    axiosInstance
      .get(`restaurants/rest/${tokenData.id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
        setimages(res.data.imageLink);
        const newDataObject = {};
        newDataObject['name'] = res.data.name;
        newDataObject['description'] = res.data.description;

        const tempArr = [];

        res.data.type?.forEach((ele) => {
          tempArr.push({ type: ele });
        });

        console.log(tempArr);

        newDataObject['type'] = tempArr;
        newDataObject['address'] = res.data.address;
        newDataObject['city'] = [{ city: res.data.city }];
        newDataObject['state'] = [{ state: res.data.state }];
        newDataObject['zipcode'] = res.data.zipcode;
        newDataObject['contactNum'] = res.data.contactNum;
        newDataObject['deliveryType'] = [
          { deliveryType: res.data.deliveryType },
        ];

        newDataObject['startTime'] = new Date(res.data.startTime);
        newDataObject['endTime'] = new Date(res.data.endTime);

        setformDetails(newDataObject);
      });
  };

  useEffect(() => {
    getRestData();
  }, []);

  const updateRest = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const dishTypes = [];
    console.log('Dish Type', dishTypes);
    formDetails.type.forEach((ele) => {
      dishTypes.push(ele.type);
    });

    formDetails.type = dishTypes;
    formDetails.city = formDetails.city[0].city;
    formDetails.deliveryType = formDetails.deliveryType[0].deliveryType;
    formDetails.state = formDetails.state[0].state;

    const startTime = formDetails.startTime;
    const endTime = formDetails.endTime;

    formDetails.startTime = startTime;
    formDetails.endTime = endTime;

    const token = localStorage.getItem('token');
    if (!token || token.length === 0) {
      history.push('/');
    }
    const tokenData = jwt.decode(token);
    if (tokenData.role === 'customer' || !tokenData.id) {
      history.push('/');
    }

    try {
      console.log('Form Details', formDetails);
      await axiosInstance.put(`restaurants/${tokenData.id}`, formDetails, {
        headers: {
          Authorization: token,
        },
      });
      setUpdating(false);
      toast.success('Updated details successfully!');
      getRestData();
    } catch (err) {
      setUpdating(false);
      console.log(err)
      toast.error(err.response.data.error);
    }
  };

  const [isUploading, setIsUploading] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

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

  const uploadRestImage = (acceptedFiles) => {
    setIsUploading(true);
    uploadFile(acceptedFiles[0], config).then(async (data) => {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.post(
          'restaurants/restImages',
          {
            imageLink: data.location,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        toast.success('Image uploaded!');
        setModalIsOpen(false);
        getRestData();
      } catch (err) {
        console.log(err)
        toast.error(err.response.data.error);
      }
    });
  };

  return (
    <div>
      <RestaurantNavbar />
      <center style={{ padding: '20px' }}>
        <Display2>{formDetails.name}</Display2>
      </center>
      <Row>
        <Col>
          <div style={{ marginTop: '10%', marginLeft: '5%' }}>
            <Carousel showArrows={true} showThumbs={false}>
              {images.map((ele) => (
                <div style={{ height: '500px' }}>
                  <img src={ele.imageLink} />
                </div>
              ))}
            </Carousel>
          </div>
          <Button
            onClick={() => setModalIsOpen(true)}
            style={{ marginTop: '30px', width: '30%' }}
          >
            Upload Restaurant image
          </Button>
          <Modal isOpen={modalIsOpen}>
            <ModalHeader>Upload image</ModalHeader>
            <ModalBody>
              <FileUploader
                onDrop={(acceptedFiles) => {
                  uploadRestImage(acceptedFiles);
                }}
                progressMessage={isUploading ? `Uploading... hang tight.` : ''}
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton
                kind="tertiary"
                onClick={() => setModalIsOpen(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton onClick={uploadRestImage}>Okay</ModalButton>
            </ModalFooter>
          </Modal>
        </Col>
        <Col>
          <center>
            <form onSubmit={updateRest}>
              <div style={{ textAlign: 'left', width: '80%' }}>
                <FormControl label="Restaurant Name">
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Enter Name"
                    value={formDetails.name}
                    onChange={(e) =>
                      setformDetails({
                        ...formDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl label="Restaurant Description">
                  <Input
                    id="description"
                    autoComplete="off"
                    placeholder="Enter Description"
                    value={formDetails.description}
                    onChange={(e) =>
                      setformDetails({
                        ...formDetails,
                        description: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label="Restaurant Dish Type">
                  <Select
                    multi
                    options={[
                      { type: 'Veg' },
                      { type: 'Non-Veg' },
                      { type: 'Vegan' },
                    ]}
                    valueKey="type"
                    labelKey="type"
                    placeholder="Select Dish Types"
                    value={formDetails.type}
                    onChange={({ value }) =>
                      setformDetails({
                        ...formDetails,
                        type: value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label="Address Line">
                  <Input
                    id="address"
                    autoComplete="off"
                    placeholder="Enter Address Line"
                    value={formDetails.address}
                    onChange={(e) =>
                      setformDetails({
                        ...formDetails,
                        address: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label="City Name">
                  <Select
                    options={[
                      { city: 'San Jose' },
                      { city: 'San Francisco' },
                      { city: 'San Diego' },
                      { city: 'Santa Clara' },
                      { city: 'Dublin' },
                    ]}
                    valueKey="city"
                    labelKey="city"
                    placeholder=""
                    value={formDetails.city}
                    onChange={({ value }) =>
                      setformDetails({
                        ...formDetails,
                        city: value,
                      })
                    }
                  />
                </FormControl>
                <FormControl label="State Name">
                  <Select
                    options={[
                      { state: 'California' },
                      { state: 'Nevada' },
                      { state: 'Texas' },
                    ]}
                    valueKey="state"
                    labelKey="state"
                    placeholder=""
                    value={formDetails.state}
                    onChange={({ value }) =>
                      setformDetails({
                        ...formDetails,
                        state: value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label="Zipcode">
                  <Input
                    id="zipcode"
                    autoComplete="off"
                    placeholder="Enter Zipcode"
                    value={formDetails.zipcode}
                    onChange={(e) =>
                      setformDetails({
                        ...formDetails,
                        zipcode: e.target.value,
                      })
                    }
                    type="number"
                  />
                </FormControl>

                <FormControl label="Contact Number">
                  <Input
                    id="contactNum"
                    autoComplete="off"
                    placeholder="Enter Contact Number"
                    value={formDetails.contactNum}
                    onChange={(e) =>
                      setformDetails({
                        ...formDetails,
                        contactNum: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label="Delivery Type">
                  <Select
                    options={[
                      { deliveryType: 'Pickup' },
                      { deliveryType: 'Delivery' },
                      { deliveryType: 'Both' },
                    ]}
                    valueKey="deliveryType"
                    labelKey="deliveryType"
                    placeholder=""
                    value={formDetails.deliveryType}
                    onChange={({ value }) =>
                      setformDetails({
                        ...formDetails,
                        deliveryType: value,
                      })
                    }
                  />
                </FormControl>

                <FormControl label=" Restaurant Start Time">
                  <TimePicker
                    value={formDetails.startTime}
                    placeholder="Enter Restaurant Opening Time"
                    onChange={(value) =>
                      setformDetails({
                        ...formDetails,
                        startTime: value,
                      })
                    }
                    step={1800}
                    // minTime={new Date('2021-09-28T07:00:00.000z')}
                  />
                </FormControl>

                <FormControl label=" Restaurant End Time">
                  <TimePicker
                    value={formDetails.endTime}
                    placeholder="Enter Restaurant Closing Time"
                    onChange={(value) =>
                      setformDetails({
                        ...formDetails,
                        endTime: value,
                      })
                    }
                    step={1800}
                    // minTime={new Date('2021-09-28T07:00:00.000z')}
                  />
                </FormControl>
              </div>

              <Button
                disabled={isUpdating}
                type="submit"
                style={{ width: '80%' }}
              >
                {isUpdating ? 'Updating???' : 'Update restaurant details'}
              </Button>
            </form>
          </center>
        </Col>
      </Row>
    </div>
  );
}

export default RestaurantDashboard;
