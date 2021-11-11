import React, { useEffect, useState } from 'react';
import {
  Col,
  Card,
  Container,
  Row,
  CardGroup,
  ListGroup,
} from 'react-bootstrap';
import { H1, H2, H3, H4, H5, H6 } from 'baseui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from 'react-s3';
import { Button } from 'baseui/button';
import UpdateDishModal from '../Dishes/UpdateDishModal';
import AddDishModal from '../Dishes/AddDishModal';
import axiosInstance from '../../axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { restaurantLogout } from '../../actions/restaurant';
import { useHistory } from 'react-router';
import RestaurantNavbar from './RestaurantNavbar';
import '../../assets/css/RestaurantDishes.css';

const jwt = require('jsonwebtoken');

function RestaurantDishes() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [dishModalIsOpen, setDishModalIsOpen] = React.useState(false);
  const [selectedDishId, setSelectedDishId] = React.useState(null);
  const [addDishModalIsOpen, setAddDishModalIsOpen] = useState(false);
  const [restDetails, setRestDetails] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();
  const dish = useSelector((state) => state.dish);

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

  const getRestData = () => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token === null || token === undefined) {
      dispatch(restaurantLogout());
      history.push('/login');
      return;
    }

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
        console.log(res.data);
        const restData = {};
        restData['name'] = res.data.name ? res.data.name : '';

        if (
          !(
            res.data.address &&
            res.data.city &&
            res.data.state &&
            res.data.zipcode
          )
        ) {
          res.data.address = '';
          res.data.city = '';
          res.data.state = '';
          res.data.zipcode = '';
        }
        let address =
          res.data.address +
          ', ' +
          res.data.city +
          ', ' +
          res.data.state +
          ' - ' +
          res.data.zipcode;
        restData['address'] = address;
        restData['description'] = res.data.description ? res.data.description : '';
        restData['contactNum'] = res.data.contactNum ? res.data.contactNum : '';

        res.data.deliveryType = res.data.deliveryType
          ? res.data.deliveryType
          : '';

        if (res.data.deliveryType === 'Both') {
          restData['deliveryType'] = 'Pickup and Delivery';
        } else {
          restData['deliveryType'] = res.data.deliveryType;
        }

        res.data.startTime = res.data.startTime ? res.data.startTime : '';
        let splitStartTime = res.data.startTime.split(':');

        let startTime;
        if (parseInt(splitStartTime[0]) >= 12) {
          startTime =
            String(splitStartTime[0] - 12) +
            ':' +
            String(splitStartTime[1] + ' PM');
        } else {
          startTime =
            String(splitStartTime[0]) + ':' + String(splitStartTime[1] + ' AM');
        }
        res.data.r_end = res.data.r_end ? res.data.r_end : '';

        let splitEndTime = res.data.r_end.split(':');
        let endTime;
        if (parseInt(splitEndTime[0]) >= 12) {
          endTime =
            String(splitEndTime[0] - 12) +
            ':' +
            String(splitEndTime[1] + ' PM');
        } else {
          endTime =
            String(splitEndTime[0]) + ':' + String(splitEndTime[1] + ' AM');
        }

        let timings = startTime + ' to ' + endTime;
        restData['openTime'] = timings;

        let dishTypes = '';
        res.data.type.forEach((ele) => {
          dishTypes = dishTypes + ele.rdt_type + ' ';
        });

        restData['dishType'] = dishTypes;

        res.data.dishes = res.data.dishes ? res.data.dishes : [];
        restData['dishes'] = res.data.dishes;
        let dishObj = {};

        res.data.dishes.forEach((ele) => {
          dishObj[ele._id] = false;
        });

        // setDishModalIsOpen(dishObj);
        setRestDetails({
          ...restDetails,
          ...restData,
        });
      })
      .catch((err) => {
        if (err.hasOwnProperty('response')) {
          if (err.response.status === 403 || err.response.status === 401) {
            toast.error('Session Expired Please Login');
            history.push('/restaurantLogin');
          }
        }
      });
  };

  useEffect(() => {
    getRestData();
  }, [dish, dishModalIsOpen]);

  return (
    <div>
      <RestaurantNavbar />
      <UpdateDishModal
        dishModalIsOpen={dishModalIsOpen}
        setDishModalIsOpen={setDishModalIsOpen}
        dishes={restDetails.dishes}
        selectedDishId={selectedDishId}
        getRestData={getRestData}
      />
      <AddDishModal
        addDishModalIsOpen={addDishModalIsOpen}
        setAddDishModalIsOpen={setAddDishModalIsOpen}
      />

      <H3>Menu</H3>
      <br></br>
      <Button
        variant="primary"
        onClick={() => {
          setAddDishModalIsOpen(true);
        }}
      >
        Add New Dish{' '}
      </Button>
      <Container fluid>
        <Row>
          {restDetails.dishes?.length > 0 ? (
            restDetails.dishes.map((ele, index) => (
              <Col
                className="hoverPointer"
                xs={2}
                key={index}
                style={{ marginTop: '30px' }}
                key={ele._id}
                onClick={() => {
                  setSelectedDishId(ele._id);
                  setDishModalIsOpen(true);
                }}
              >
                <Card style={{ height: '100%' }}>
                  <div>
                    <Card.Img
                      variant="top"
                      src={
                        ele.imageLink.length > 0 ? ele.imageLink[0].imageLink : ''
                      }
                      style={{ height: '200px' }}
                    />
                  </div>
                  <Card.Header>
                    <h5 style={{ fontWeight: 'bold' }}>{ele.name}</h5>
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>{ele.description}</ListGroup.Item>
                    <ListGroup.Item>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          {' '}
                          {ele.type} {' : '}
                          {ele.category}
                        </div>
                        <div>
                          <h6>${ele.price}</h6>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                  {/* <H6>$ {ele.d_price} </H6>
                  <Row style={{ paddingTop: '-2500px' }}>
                    <Col></Col>
                  </Row> */}
                </Card>
              </Col>
            ))
          ) : (
            <div></div>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantDishes;
