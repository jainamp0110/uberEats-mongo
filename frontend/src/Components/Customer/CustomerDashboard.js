import { H3, H6 } from 'baseui/typography';
import React, { useEffect, useState, useDispatch } from 'react';
import { StyledBody, StyledAction } from 'baseui/card';
import { useHistory } from 'react-router';
import { Button, Col, Card, Row, ListGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { useSelector } from 'react-redux';
import '../../assets/css/favourites.css';
import HeartSvg from './HeartSvg';
import _ from 'underscore';

function CustomerDashboard() {
  const history = useHistory();

  const searchFilter = useSelector((state) => state.searchFilter);

  useEffect(() => {
    getAllRestaurantsByKeyword();
  }, [searchFilter.keyWord]);

  const [allRestDetails, setAllRestDetails] = useState([]);

  const getAllRestaurantsByKeyword = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/restaurants/all/search', {
        params: {
          keyWord: searchFilter.keyWord,
        },
        headers: {
          Authorization: token,
        },
      })
      .then(async (res) => {
        console.log(res.data);
        const uniqueData = await _.uniq(res.data, (x) => x._id);

        console.log('res.data', res.data);
        console.log('uni', uniqueData);
        setAllRestDetails(uniqueData);
      })
      .catch((err) => {
        // history.push("/");
        toast.error('Session expired Please Login');
      });
  };

  const getAllRestaurants = () => {
    const token = localStorage.getItem('token');

    axiosConfig
      .get('/restaurants/all', {
        params: {
          city: searchFilter.location,
          deliveryType: searchFilter.deliveryType,
          dishType: searchFilter.dishType,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllRestDetails(res.data.filteredRestaurants);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        history.push('/login');
      });
  };

  const addToFavourite = (rid) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .post(
        '/customers/fvrts',
        {
          rid,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error();
        console.log(err);
      });
  };

  useEffect(() => {
    getAllRestaurants();
  }, [searchFilter.location, searchFilter.deliveryType, searchFilter.dishType]);

  console.log(allRestDetails);

  return (
    <div>
      <CustomerNavbar />
      <Row
        xs={1}
        md={4}
        className="g-4"
        style={{ marginLeft: '2%', marginTop: '2%' }}
      >
        {allRestDetails?.length > 0 ? (
          allRestDetails.map((ele) => (
            <Col xs={3} style={{ marginTop: '30px' }}>
              <div
                onClick={() => {
                  history.push(`/customer/restaurant/${ele._id}`);
                }}
                style={{ height: '100%' }}
              >
                <Card style={{ height: '100%', borderRadius: '20px' }}>
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele
                          ? ele.imageLink?.length > 0
                            ? ele.imageLink[0].imageLink
                            : 'https://ubereats-media.s3.amazonaws.com/defaultRest.png'
                          : 'https://ubereats-media.s3.amazonaws.com/defaultRest.png'
                      }
                      style={{ height: '300px', width: '100%' }}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        addToFavourite(ele?._id);
                      }}
                    >
                      <HeartSvg />
                    </div>
                  </div>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <H6>{ele?.name}</H6>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {ele.city ? ele.city + ', ' : ''}
                        {ele.state ? ele.state : ''}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))
        ) : (
          <div></div>
        )}
      </Row>
    </div>
  );
}

export default CustomerDashboard;
