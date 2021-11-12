import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../../assets/css/restaurantHome.css';

import axiosInstance from '../../axiosConfig';
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/react-responsive-carousel/lib/styles/carousel.css';
import {
  Button,
  Col,
  Card,
  Container,
  Row,
  CardGroup,
  ListGroup,
} from 'react-bootstrap';
import { Display2, Display4, H1, H2, H3, H4, H5, H6 } from 'baseui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import UpdateDishModal from '../Dishes/UpdateDishModal';
import { useSelector } from 'react-redux';
import AddDishModal from '../Dishes/AddDishModal';
import { useDispatch } from 'react-redux';
import CustomerNavbar from './CustomerNavbar';
import ShowDishModal from '../Dishes/ShowDishModal';

const Carousel = require('react-responsive-carousel').Carousel;
const jwt = require('jsonwebtoken');

const RestaurantDetails = ({ match }) => {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const [images, setimages] = useState([]);
  const [restDetails, setRestDetails] = useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [dishModalIsOpen, setDishModalIsOpen] = React.useState(false);
  const [selectedDishId, setSelectedDishId] = React.useState(null);
  const [restId, setRestId] = useState('');
  const dish = useSelector((state) => state.dish);

  const getRestData = () => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token === null || token === undefined) {
      //   dispatch(restaurantLogout());
      history.push('/');
      return;
    }

    if (!token || token.length === 0) {
      history.push('/');
    }

    const tokenData = jwt.decode(token);
    axiosInstance
      .get(`restaurants/rest/${match.params.restId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setimages(res.data.imageLink ? res.data.imageLink : []);
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
          res.data.zipcode = null;
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
        restData['restId'] = res.data._id;

        res.data.deliveryType = res.data.deliveryType
          ? res.data.deliveryType
          : '';
        if (res.data.deliveryType === 'Both') {
          restData['deliveryType'] = 'Pickup and Delivery';
        } else {
          restData['deliveryType'] = res.data.deliveryType;
        }

        // res.data.startTime = res.data.startTime ? res.data.startTime : '';
        // let splitStartTime = res.data.startTime.split(':');

        // let startTime;
        // if (parseInt(splitStartTime[0]) >= 12) {
        //   startTime =
        //     String(splitStartTime[0] - 12) +
        //     ':' +
        //     String(splitStartTime[1] + ' PM');
        // } else {
        //   startTime =
        //     String(splitStartTime[0]) + ':' + String(splitStartTime[1] + ' AM');
        // }
        // res.data.endTime = res.data.endTime ? res.data.endTime : '';

        // let splitEndTime = res.data.endTime.split(':');
        // let endTime;
        // if (parseInt(splitEndTime[0]) >= 12) {
        //   endTime =
        //     String(splitEndTime[0] - 12) +
        //     ':' +
        //     String(splitEndTime[1] + ' PM');
        // } else {
        //   endTime =
        //     String(splitEndTime[0]) + ':' + String(splitEndTime[1] + ' AM');
        // }

        const st = new Date(res.data.startTime).getHours() + ':' + new Date(res.data.startTime).getMinutes() + '  ';
        const en = new Date(res.data.endTime).getHours() + ':' + new Date(res.data.endTime).getMinutes() + '  ';

        let timings = st + ' - ' + en;
        restData['openTime'] = timings;

        let type = '';
        res.data.type.forEach((ele) => {
          type = type + ele.type + ' ';
        });

        restData['dishType'] = type;

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
  }, [dish]);

  return (
    <div>
      <ShowDishModal
        dishModalIsOpen={dishModalIsOpen}
        setDishModalIsOpen={setDishModalIsOpen}
        dishes={restDetails.dishes}
        selectedDishId={selectedDishId}
        restId={restDetails.restId}
        restName={restDetails.name}
      />
      <CustomerNavbar />
      <Carousel showArrows showThumbs={false}>
        {images?.length > 0
          ? images.map((ele) => (
              <div style={{ height: '500px' }}>
                <img src={ele.imageLink} />
                <p style={{ height: '80px', fontSize: '30px' }}>
                  {restDetails.name}
                </p>
              </div>
            ))
          : null}
      </Carousel>
      <br></br>
      <div>
        <Display2>{restDetails.name}</Display2>
        <H6 style={{ color: 'grey' }}>{restDetails.description}</H6>
        <H6 style={{ color: 'grey' }}>{restDetails.address}</H6>
        <H6 style={{ color: 'grey' }}>{restDetails.openTime}</H6>
      </div>
      <div>
        <br></br>
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
                          ele.imageLink.length > 0
                            ? ele.imageLink[0].imageLink
                            : ''
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
      <div style={{ marginBottom: '20px' }} />
    </div>
  );
};

export default RestaurantDetails;
