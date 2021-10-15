import { H3, H5, H6 } from 'baseui/typography';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { Button } from 'baseui/button';
import { useHistory } from 'react-router';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';

function CustomerOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getCustOrders();
  }, []);

  const getOrderDetails = (oid) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/orders/${oid}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setOrderDetails(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.error('NO Order Found');
        }
        console.log(err);
      });
  };

  const getCustOrders = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/orders/', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <CustomerNavbar />
      <Modal
        onClose={() => setOrderModalIsOpen(false)}
        isOpen={orderModalIsOpen}
      >
        <div style={{ margin: '5%' }}>
          <ModalHeader>Reciept</ModalHeader>
          <hr />
          <ModalBody>
            <Row>
              <Col style={{ textAlign: 'left' }}>
                <H5>Total</H5>
              </Col>
              <Col xs={4}>
                <H6> $ {orderDetails.o_final_price}</H6>
              </Col>
            </Row>
            {orderDetails?.order_dishes?.length > 0
              ? orderDetails.order_dishes.map((dish) => {
                  return (
                    <Row>
                      <Col style={{ textAlign: 'left' }}>
                        {dish?.dish.d_name}
                      </Col>
                      <Col xs={4}>${dish?.dish.d_price}</Col>
                    </Row>
                  );
                })
              : null}
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={() => setOrderModalIsOpen(false)}>
              Okay
            </ModalButton>
          </ModalFooter>
        </div>
      </Modal>
      <div>
        <Row style={{ margin: '1% 5% 5% 5%' }}>
          <H3 style={{ textAlign: 'left' }}>Past Orders</H3>
          {allOrderDetails
            ? allOrderDetails.length > 0
              ? allOrderDetails.map((order) => (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        marginLeft: '-27px',
                        marginTop: '20px',
                      }}
                    >
                      <Col
                        xs={10}
                        style={{ textAlign: 'left', marginLeft: '2%' }}
                      >
                        <H5>
                          <a
                            onClick={() =>
                              history.push(
                                `/customer/restaurant/${order?.restaurant?.r_id}`,
                              )
                            }
                          >
                            {' '}
                            {order.restaurant.r_name}{' '}
                          </a>{' '}
                        </H5>
                        <p>
                          {order.order_dishes.length} items <br />
                          For ${order.o_final_price} <br />
                          {new Date(order.o_date_time).toUTCString()} <br />
                          Order Type: {order.o_type} <br />
                          <br />
                        </p>
                      </Col>
                      <Col style={{ marginRight: '' }}>
                        <Button
                          style={{ width: '200px' }}
                          onClick={async () => {
                            await getOrderDetails(order.o_id);
                            setOrderModalIsOpen(true);
                          }}
                        >
                          View receipt
                        </Button>
                        <p style={{ marginTop: '40px' }}>
                          Order status:{' '}
                          <span style={{ fontWeight: 'bold' }}>
                            {order.o_status}
                          </span>
                        </p>
                        {/* <Button
                          size={SIZE.large}
                          onClick={() =>
                            history.push(
                              `/customer/restaurants${orderRestImage.restId}`
                            )
                          }
                          $style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ justifyContent: "center" }}>
                            View store
                          </span>
                        </Button> */}
                      </Col>
                    </div>
                    <hr />
                  </>
                ))
              : null
            : null}
        </Row>
      </div>
    </div>
  );
}

export default CustomerOrders;
