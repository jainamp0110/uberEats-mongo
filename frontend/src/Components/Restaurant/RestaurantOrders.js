import { H3, H5, H6 } from 'baseui/typography';
import React, { useState, useEffect } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosConfig from '../../axiosConfig';
import { Button, SIZE } from 'baseui/button';
import { useHistory } from 'react-router';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import RestaurantNavbar from './RestaurantNavbar';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { StyledAction, StyledBody, StyledThumbnail } from 'baseui/card';
import { Table } from 'baseui/table-semantic';

import { Card } from 'react-bootstrap';

function RestaurantOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [customerProfile, setCustomerProfile] = useState({});
  const [filterOrderStatus, setFilterOrderStatus] = useState([
    { label: 'All' },
  ]);

  const history = useHistory();

  useEffect(() => {
    getRestOrders();
  }, []);

  const getFilteredOrders = (params) => {
    if (params[0].label === 'All') {
      getRestOrders();
      return;
    }

    const orderStatus = params[0].label;
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/orders/filterorders`, {
        params: {
          orderStatus,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        toast.error('Error Fetching Filtered Records');
      });
  };

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

  const getCustDetails = (custId) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/customers/profile/${custId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setCustomerProfile(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateOrderStatus = (oid, orderStatus) => {
    console.log(oid);
    console.log(orderStatus);
    const token = localStorage.getItem('token');
    axiosConfig
      .put(
        `/orders/updatestatus/${oid}`,
        {
          status: orderStatus,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        getRestOrders();
        toast.success('Order Status Updated');
      })
      .catch((err) => {
        toast.error('Error Updating Status');
      });
  };

  const getRestOrders = () => {
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
      <RestaurantNavbar />
      <center>
        <div style={{ marginTop: '3%', width: '50%' }}>
          <Select
            options={[
              { label: 'All', id: '#F0F8FF' },
              { label: 'Placed', id: '#F0F8FF' },
              { label: 'On the Way', id: '#FAEBD7' },
              { label: 'Picked Up', id: '#FAEBD7' },
              { label: 'Preparing', id: '#FAEBD7' },
              { label: 'Ready', id: '#FAEBD7' },
              { label: 'Delivered', id: '#FAEBD7' },
              { label: 'Cancelled', id: '#FAEBD7' },
            ]}
            valueKey="label"
            labelKey="label"
            value={filterOrderStatus}
            placeholder="Select Order Status"
            onChange={({ value }) => {
              setFilterOrderStatus(value);
              getFilteredOrders(value);
            }}
          />
        </div>
      </center>
      <Modal onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}>
        <ModalHeader>{customerProfile.c_name}</ModalHeader>
        <ModalBody>
          <Card
            overrides={{ Root: { style: { width: '328px' } } }}
            style={{ width: '100%', height: '100%' }}
          >
            <StyledThumbnail
              src={
                customerProfile?.c_profile_img
                  ? customerProfile.c_profile_img
                  : 'https://ubereats-media.s3.amazonaws.com/guest-user.jpg'
              }
            />
            <StyledBody style={{ textAlign: 'left' }}>
              <b> About: </b>
              {customerProfile?.c_about
                ? customerProfile?.c_about
                : 'Not Updated'}
              <br />
              <b> City: </b>

              {customerProfile?.c_city}
              <br />
              <b> State: </b>
              {customerProfile?.c_state}
              <br />
              <b> Country: </b>

              {customerProfile?.c_country}
              <br />
              <b> Date Of Birth: </b>

              {customerProfile
                ? new Date(customerProfile?.c_dob).toUTCString().substr(5, 11)
                : null}
              <br />
              <b> Nick Name: </b>

              {customerProfile?.c_nick_name}
              <br />
              <br />
            </StyledBody>
            <StyledAction>
              <Button
                onClick={() => setModalIsOpen(false)}
                overrides={{ BaseButton: { style: { width: '100%' } } }}
              >
                Close
              </Button>
            </StyledAction>
          </Card>
        </ModalBody>
      </Modal>
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
        <Container fluid>
          <Row>
            {allOrderDetails?.length > 0 ? (
              allOrderDetails.map((order, index) => (
                <Col
                  className="hoverPointer"
                  xs={2}
                  key={index}
                  style={{ marginTop: '30px' }}
                >
                  <Card style={{ height: '100%' }}>
                    <div
                      key={order.o_id}
                      onClick={async () => {
                        await getOrderDetails(order.o_id);
                        setOrderModalIsOpen(true);
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={
                          order?.customer?.c_profile_img
                            ? order?.customer?.c_profile_img
                            : ''
                        }
                        style={{ height: '200px' }}
                      />
                    </div>
                    <Card.Header>
                      <h5 style={{ fontWeight: 'bold' }}>
                        {order?.customer?.c_name}
                      </h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>{order.o_status}</div>
                          <div>
                            <h6>${order.o_final_price}</h6>
                          </div>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FormControl label="Update Order Status">
                          {order ? (
                            order.o_type === 'Delivery' ? (
                              <Select
                                options={[
                                  { orderStatus: 'Placed' },
                                  { orderStatus: 'Preparing' },
                                  { orderStatus: 'On the Way' },
                                  { orderStatus: 'Delivered' },
                                ]}
                                valueKey="orderStatus"
                                labelKey="orderStatus"
                                placeholder="Select Order Status"
                                value={[{ orderStatus: order.o_status }]}
                                onChange={({ value }) =>
                                  updateOrderStatus(
                                    order.o_id,
                                    value[0].orderStatus,
                                  )
                                }
                              />
                            ) : (
                              <Select
                                options={[
                                  { orderStatus: 'Placed' },
                                  { orderStatus: 'Preparing' },
                                  { orderStatus: 'Ready' },
                                  { orderStatus: 'Picked Up' },
                                ]}
                                valueKey="orderStatus"
                                labelKey="orderStatus"
                                placeholder="Select Order Status"
                                value={[{ orderStatus: order.o_status }]}
                                onChange={({ value }) =>
                                  updateOrderStatus(
                                    order.o_id,
                                    value[0].orderStatus,
                                  )
                                }
                              />
                            )
                          ) : null}
                        </FormControl>
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

        {/* <Row style={{ margin: '1% 5% 5% 5%' }}>
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
                          className="col-sm-12"
                          src={
                            order?.customer?.c_profile_img
                              ? order?.customer.c_profile_img
                              : 'https://ubereats-media.s3.amazonaws.com/guest-user.jpg'
                          }
                          alt="sans"
                          style={{ height: '100%' }}
                          onClick={async () => {
                            await getCustDetails(order?.customer?.c_id);
                            setModalIsOpen(true);
                          }}
                        />
                      </Col>
                      <Col
                        xs={7}
                        style={{ textAlign: 'left', marginLeft: '2%' }}
                      >
                        <H5>
                          <a>{order?.customer?.c_name}</a> ({order.o_status})
                        </H5>
                        <p>
                          Total Items: {order.order_dishes?.length} <br />
                          Total Price: ${order.o_final_price} <br />
                          Order Place:{' '}
                          {new Date(order.o_date_time).toUTCString()} <br />
                          Order Type: {order.o_type} <br />
                          <br />
                          <span
                            className="hoverUnderline"
                            style={{ fontWeight: 'bold' }}
                            onClick={async () => {
                              await getOrderDetails(order.o_id);
                              setOrderModalIsOpen(true);
                            }}
                          >
                            View receipt
                          </span>
                        </p>
                      </Col>
                      <Col style={{ marginRight: '45px' }}>
                        <div style={{ justifyContent: 'center' }}>
                          <FormControl label="Update Order Status">
                            {order ? (
                              order.o_type === 'Delivery' ? (
                                <Select
                                  options={[
                                    { orderStatus: 'Preparing' },
                                    { orderStatus: 'On the Way' },
                                    { orderStatus: 'Delivered' },
                                  ]}
                                  valueKey="orderStatus"
                                  labelKey="orderStatus"
                                  placeholder="Select Order Status"
                                  value={orderStatus}
                                  onChange={({ value }) =>
                                    setOrderStatus(value)
                                  }
                                />
                              ) : (
                                <Select
                                  options={[
                                    { orderStatus: 'Preparing' },
                                    { orderStatus: 'Ready' },
                                    { orderStatus: 'Picked Up' },
                                  ]}
                                  valueKey="orderStatus"
                                  labelKey="orderStatus"
                                  placeholder="Select Order Status"
                                  value={orderStatus}
                                  onChange={({ value }) =>
                                    setOrderStatus(value)
                                  }
                                />
                              )
                            ) : null}
                          </FormControl>
                          <Button
                            size={SIZE.large}
                            $style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            onClick={() => updateOrderStatus(order?.o_id)}
                          >
                            <span style={{ justifyContent: 'center' }}>
                              Update Status
                            </span>
                          </Button>
                        </div>
                      </Col>
                    </div>
                    <hr />
                  </>
                ))
              : null
            : null}
        </Row> */}
      </div>
    </div>
  );
}

export default RestaurantOrders;
