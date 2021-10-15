import React from 'react';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { useState, useEffect } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import HeartSvg from './HeartSvg';
import { H6 } from 'baseui/typography';

function CustomerFavorites() {
  const [fvrtRests, setFvrtRests] = useState([]);
  const history = useHistory();

  const getAllFavorites = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/customers/fvrts', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setFvrtRests(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllFavorites();
  }, []);
  return (
    <div>
      <CustomerNavbar />
      <Row
        xs={1}
        md={4}
        className="g-4"
        style={{ marginLeft: '2%', marginTop: '2%', marginRight: '2%' }}
      >
        {fvrtRests?.length > 0 ? (
          fvrtRests.map((ele) => (
            <Col xs={3} style={{ marginTop: '30px' }}>
              <div
                onClick={() => {
                  history.push(`/customer/restaurant/${ele.r_id}`);
                }}
                style={{ height: '100%' }}
              >
                <Card style={{ height: '100%', borderRadius: '20px' }}>
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele.restaurant?.restaurant_imgs?.length > 0
                          ? ele?.restaurant?.restaurant_imgs[0].ri_img
                          : 'https://ubereats-media.s3.amazonaws.com/defaultRest.png'
                      }
                      style={{ height: '300px', width: '100%' }}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <HeartSvg />
                    </div>
                  </div>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <H6>{ele?.restaurant?.r_name}</H6>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {ele?.restaurant?.r_city
                          ? ele?.restaurant?.r_city + ', '
                          : ''}
                        {ele?.restaurant?.r_state
                          ? ele?.restaurant?.r_state
                          : ''}
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

export default CustomerFavorites;
