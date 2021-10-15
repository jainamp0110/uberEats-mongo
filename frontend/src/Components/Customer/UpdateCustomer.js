import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import CustomerNavbar from './CustomerNavbar';
import { useHistory } from 'react-router';
import axiosConfig from '../../axiosConfig';
import { FileUploader } from 'baseui/file-uploader';
import { Avatar } from 'baseui/avatar';
import { expandBorderStyles } from 'baseui/styles';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Button } from 'baseui/button';
import { DatePicker } from 'baseui/datepicker';
import { Display2, H3 } from 'baseui/typography';
import { uploadFile } from 'react-s3';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { Select, SelectDropdown } from 'baseui/select';

const jwt = require('jsonwebtoken');

function UpdateCustomer() {
  useEffect(() => {
    getCustomerData();
  }, []);

  const [fileToUpload, setFileToUpload] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [nickName, setNickName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [image, setImage] = useState('');
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [custId, setCustId] = useState('');

  const history = useHistory();
  const getCustomerData = () => {
    const token = localStorage.getItem('token');
    const tokenData = jwt.decode(token);
    if (tokenData.c_id === null || tokenData.c_id === undefined) {
      toast.error('Unauthorised Access!!');
      history.push('/');
    }

    axiosConfig
      .get('/customers/myprofile', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setName(res.data.c_name ? res.data.c_name : '');
        setEmail(res.data.c_email ? res.data.c_email : '');
        setCustId(res.data.c_id ? res.data.c_id : '');
        setDob(res.data.c_dob ? new Date(res.data.c_dob) : '');
        setContactNo(res.data.c_contact_no ? res.data.c_contact_no : '');
        setCity(res.data.c_city ? [{ city: res.data.c_city }] : '');
        setStateName(res.data.c_state ? res.data.c_state : '');
        setCountry(res.data.c_country ? res.data.c_country : '');
        setAbout(res.data.c_about ? res.data.c_about : '');
        setNickName(res.data.c_nick_name ? res.data.c_nick_name : '');
        setImage(res.data.c_profile_img ? res.data.c_profile_img : '');
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        console.log(err.response.data.error);
        history.push('/customer/dashboard');
      });
  };

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

  const uploadCustImage = (acceptedFiles) => {
    uploadFile(acceptedFiles[0], config).then(async (data) => {
      try {
        const token = localStorage.getItem('token');
        await axiosConfig.put(
          `customers/${custId}`,
          {
            profile_img: data.location,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        toast.success('Hurray!!');
        setModalIsOpen(false);
        getCustomerData();
      } catch (err) {
        toast.error(err.response.data.error);
      }
    });
  };

  const checkProperties = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
      }
    });
  };

  let finalContact = contactNo;
  if (contactNo.length > 10) {
    finalContact =
      contactNo.substr(1, 3) + contactNo.substr(6, 3) + contactNo.substr(10, 4);
  }

  const updateCustDetails = (e) => {
    e.preventDefault();
    const custObj = {
      name,
      about,
      profile_img: image,
      nname: nickName,
      contact: finalContact,
      dob: dob.length > 0 ? dob[0] : '',
      city: city[0]?.city ? city[0].city : '',
      state: stateName,
      country,
    };

    checkProperties(custObj);

    const token = localStorage.getItem('token');
    axiosConfig
      .put(`/customers/${custId}`, custObj, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success('Customer Updated');
      })
      .catch((err) => {
        if (err.response.data.hasOwnProperty('errors')) {
          err.response.data.errors.forEach((error) => {
            toast.error(error.msg.error);
          });
        } else {
          toast.error(err.response.data.error);
        }
      });
  };

  return (
    <div>
      <CustomerNavbar />
      <center>
        <Display2 style={{ marginTop: '10px' }}> Profile </Display2>
        <br></br>
        <br></br>
        <Row style={{ width: '80%' }}>
          <Col>
            <Row>
              <img src={image} alt="Upload your profile picture" />
            </Row>
            <Row>
              <Button onClick={() => setModalIsOpen(true)} style={{ marginTop : '20px' }}>Upload Image</Button>
              <Modal isOpen={modalIsOpen}>
                <ModalHeader>Upload Image Here</ModalHeader>
                <ModalBody>
                  <FileUploader
                    onDrop={(acceptedFiles) => {
                      uploadCustImage(acceptedFiles);
                    }}
                    progressMessage={
                      isUploading ? `Uploading... hang tight.` : ''
                    }
                  />
                </ModalBody>
                <ModalFooter>
                  <ModalButton
                    kind="tertiary"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Close
                  </ModalButton>
                </ModalFooter>
              </Modal>
            </Row>
          </Col>
          <Col>
            <form onSubmit={updateCustDetails}>
              <div style={{ textAlign: 'left', width: '80%' }}>
                <FormControl label="Name">
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Email">
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="Enter Email"
                    value={email}
                    disabled
                  />
                </FormControl>
                <FormControl label="About">
                  <Input
                    id="about"
                    autoComplete="off"
                    placeholder="Enter about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Date of birth">
                  <DatePicker
                    maxDate={new Date('2010-01-01T07:00:00.000Z')}
                    minDate={new Date('1960-01-01T07:00:00.000Z')}
                    value={dob}
                    onChange={({ date }) =>
                      setDob(Array.isArray(date) ? date : [date])
                    }
                  />
                </FormControl>
                <FormControl label="Nick Name">
                  <Input
                    id="nickName"
                    autoComplete="off"
                    placeholder="Enter Nick Name"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                  />
                </FormControl>

                <FormControl label="Phone Number">
                  <MaskedInput
                    placeholder="Phone number"
                    mask="(999) 999-9999"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </FormControl>
                <FormControl label="City">
                  <Select
                    options={[
                      { city: 'San Jose' },
                      { city: 'San Francisco' },
                      { city: 'New York' },
                      { city: 'Santa Clara' },
                    ]}
                    valueKey="city"
                    labelKey="city"
                    placeholder="Select City"
                    value={city}
                    onChange={({ value }) => setCity(value)}
                  />
                </FormControl>
                {/* <FormControl label="City">
                  <Input
                    id="city"
                    autoComplete="off"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormControl> */}
                <FormControl label="State">
                  <Input
                    id="state"
                    autoComplete="off"
                    placeholder="Enter state"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </FormControl>
                <FormControl label="Country">
                  <Input
                    id="country"
                    autoComplete="off"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </FormControl>
                <div style={{ textAlign: 'right' }}>
                  <Button style={{ width: '100%' }} type="submit">
                    {isUpdatingUser ? 'Updating Details' : 'Update Details'}
                  </Button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </center>
    </div>
  );
}

export default UpdateCustomer;
