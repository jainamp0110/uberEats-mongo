import { H3, H5, H6 } from 'baseui/typography';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { Button, SIZE } from 'baseui/button';
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
        // if (err.response.status === 404) {
        //   toast.error('NO Order Found');
        // }
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

  const cancelOrder = (oid) => {
    console.log(oid);
    const token = localStorage.getItem('token');
    axiosConfig
      .put(
        `/orders/updatestatus/${String(oid)}`,
        { status: 'Cancelled' },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast.success('Order cancelled!');
        getCustOrders();
      })
      .catch((err) => {
        toast.error('Cannot cancel order!');
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
                <H6> $ {orderDetails?.orderDetails?.finalPrice?.toFixed(2)}</H6>
              </Col>
            </Row>
            {orderDetails?.orderDetails?.dishes?.length > 0
              ? orderDetails?.orderDetails?.dishes.map((dish, index) => {
                  return (
                    <Row>
                      <Col style={{ textAlign: 'left' }}>
                        {orderDetails?.dishName[index]} x {dish?.qty}
                      </Col>
                      <Col xs={4}>${dish?.price}</Col>
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
                      <Col>
                        <img
                          className='col-sm-12'
                          src={
                            order?.restImage ? order.restImage?.imageLink : ''
                          }
                          alt='sans'
                          style={{ height: '100%' }}
                          onClick={() =>
                            history.push(
                              `/customer/restaurant/${order?.restId}`
                            )
                          }
                        />
                      </Col>
                      <Col
                        xs={7}
                        style={{ textAlign: 'left', marginLeft: '2%' }}
                      >
                        <H5>
                          <a
                            onClick={() =>
                              history.push(
                                `/customer/restaurant/${order?.resId}`
                              )
                            }
                          >
                            {' '}
                            {order?.restName}{' '}
                          </a>{' '}
                        </H5>
                        <p>
                          {/* {order?.dishes.length} items <br /> */}
                          <span style={{ fontWeight: 'bold' }}>
                            ${(order?.finalPrice).toFixed(2)} <br />
                          </span>
                          <span style={{ fontWeight: 'bold' }}>
                            {new Date(order?.dateTime).toUTCString()} <br />
                          </span>
                          <span style={{ fontWeight: 'bold' }}>
                            { order?.orderType} <br />
                          </span>

                          <br />
                          Order status:{' '}
                          <span style={{ fontWeight: 'bold' }}>
                            {order.status}
                          </span>
                        </p>
                      </Col>
                      <Col style={{ marginRight: '' }}>
                        <Button
                          style={{ width: '100%' }}
                          onClick={async () => {
                            await getOrderDetails(String(order._id));
                            setOrderModalIsOpen(true);
                          }}
                        >
                          View receipt
                        </Button>
                        <Button
                          onClick={() =>
                            history.push(`/customer/restaurant/${order?.resId}`)
                          }
                          $style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '5%',
                          }}
                        >
                          <span style={{ justifyContent: 'center' }}>
                            View store
                          </span>
                        </Button>

                        {order?.status === 'Initialized' ||
                        order?.status === 'Placed' ? (
                          <Button
                            onClick={() => cancelOrder(order?._id)}
                            $style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              marginTop: '5%',
                              backgroundColor: 'red',
                            }}
                          >
                            <span style={{ justifyContent: 'center' }}>
                              Cancel
                            </span>
                          </Button>
                        ) : null}
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
