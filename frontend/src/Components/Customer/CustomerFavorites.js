import React from 'react';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { useState, useEffect } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import HeartSvg from './HeartSvg';
import { H6 } from 'baseui/typography';
import toast from 'react-hot-toast';


function CustomerFavorites() {
  const [fvrtRests, setFvrtRests] = useState([]);
  const history = useHistory();

  const removeFromFavorite = (rid) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .delete(
        `/customers/fvrts/${rid}`,
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        getAllFavorites();
        toast.success('Removed From Favorites');
      })
      .catch((err) => {
        toast.error();
        console.log(err);
      });
  };
 
  const getAllFavorites = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/customers/fvrts', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        // console.log(object)
        console.log(res.data);
        setFvrtRests(res.data);
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
                  history.push(`/customer/restaurant/${ele._id}`);
                }}
                style={{ height: '100%' }}
              >
                <Card style={{ height: '100%', borderRadius: '20px' }}>
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele.imageLink?.length > 0
                          ? ele.imageLink[0].imageLink
                          : 'https://ubereats-media.s3.amazonaws.com/defaultRest.png'
                      }
                      style={{ height: '300px', width: '100%' }}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorite(ele?._id);
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
                        {ele?.city
                          ? ele?.city + ', '
                          : ''}
                        {ele?.state
                          ? ele?.state
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
