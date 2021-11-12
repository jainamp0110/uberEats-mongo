import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import axiosConfig from '../../axiosConfig';
import { useHistory, match } from 'react-router';
import { H2, H3, H4 } from 'baseui/typography';
import { Button, KIND } from 'baseui/button';
import { Button as ReactButton } from 'react-bootstrap';
import logo from '../../assets/images/ubereats.png';
import { ANCHOR, Drawer } from 'baseui/drawer';
import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';

import { Modal } from 'baseui/modal';
import { Input } from 'baseui/input';
import toast from 'react-hot-toast';

function PlaceOrder({ match }) {
  const [addresses, setAddresses] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressModalIsOpen, setAddressModalIsOpen] = useState(false);

  const [delTypeOptions, setDelTypeOptions] = useState([]);
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newZipcode, setNewZipcode] = useState(null);
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const getAddresses = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/customers/address', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAddresses(res.data);
        const addrOpt = [];

        const temp =
          res.data.length > 0
            ? res.data.forEach((ele) => {
                addrOpt.push({
                  address:
                    ele.addressLine +
                    ', ' +
                    ele.zipcode +
                    ', ' +
                    ele.city +
                    ', ' +
                    ele.state +
                    ', ' +
                    ele.country,
                });
              })
            : null;
        // if(res?.data?.)
        setAddressOptions(addrOpt);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.error('Session Expired! Please Login Again!');
          history.push('/login');
        }
        console.log(err.response.data.error);
      });
  };

  const createNewAddress = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axiosConfig
      .post(
        '/customers/address',
        {
          addressLine: newAddressLine,
          zipcode: newZipcode,
          city: newCity,
          state: newState,
          country: newCountry,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        setNewZipcode(null);
        setNewAddressLine('');
        setNewCity('');
        setNewState('');
        setNewCountry('');
        toast.success('New Address Created');
        getAddresses();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.error('Session Expired! Please Login Again!');
          history.push('/login');
        }
        toast.error(err.response.data.error);
      });
    setAddressModalIsOpen(false);
  };

  const getOrderDetails = () => {
    console.log('GETTTING ORDER');
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/orders/${match.params.oid}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log('Order Dera', res.data);
        const delOpt = [];
        if (res.data.deliveryType === 'Both') {
          delOpt.push({ deliveryType: 'Pickup' });
          delOpt.push({ deliveryType: 'Delivery' });
          setDelTypeOptions(delOpt);
        } else {
          delOpt.push({ deliveryType: res?.data?.deliveryType });
          setDelTypeOptions({ deliveryType: delOpt });
        }
        setOrderDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Order Not Found');
        // history.push('/customer/dashboard');
        console.log(err.response.data);
      });
  };

  const placeOrder = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (address.length > 0 && deliveryType.length > 0) {
      axiosConfig
        .put(
          `/orders/finalorder/${match.params.oid}`,
          {
            addressId: address[0].address,
            orderType: deliveryType[0].deliveryType,
            notes: newNotes,
          },
          {
            headers: { Authorization: token },
          }
        )
        .then((res) => {
          history.push('/customer/dashboard');
          toast.success('Order Placed!!');
        })
        .catch((err) => {
          toast.error('Error Placing Order');
        });
    } else {
      toast.error('Please select Delivery Address and Delivery Type');
    }
  };

  useEffect(() => {
    setAddressOptions([]);
    getAddresses();
    getOrderDetails();
  }, [addressModalIsOpen]);

  return (
    <div>
      <Modal
        isOpen={addressModalIsOpen}
        onClose={() => setAddressModalIsOpen(false)}
      >
        <div
          style={{
            paddingLeft: '50px',
            paddingRight: '50px',
            marginTop: '20px',
            textAlign: 'left',
          }}
        >
          <H3>Add New Address </H3>
          <FormControl label='Address Line'>
            <Input
              id='newAddressLine'
              autoComplete='off'
              placeholder='Enter Address Line'
              value={newAddressLine}
              onChange={(e) => setNewAddressLine(e.target.value)}
            />
          </FormControl>
          <FormControl label='Zipcode'>
            <Input
              id='zipcode'
              autoComplete='off'
              placeholder='Enter Zipcode'
              value={newZipcode}
              onChange={(e) => setNewZipcode(e.target.value)}
              type='Number'
            />
          </FormControl>
          <FormControl label='City'>
            <Input
              id='city'
              autoComplete='off'
              placeholder='Enter City'
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
          </FormControl>
          <FormControl label='State'>
            <Input
              id='state'
              autoComplete='off'
              placeholder='Enter State'
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
            />
          </FormControl>
          <FormControl label='Country'>
            <Input
              id='country'
              autoComplete='off'
              placeholder='Enter Country'
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
            />
          </FormControl>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Button onClick={createNewAddress}> Add </Button>
          </div>
        </div>
      </Modal>
      <HeaderNavigation style={{ height: '70px' }}>
        <NavigationList $align={ALIGN.left}>
          <Drawer
            isOpen={isDrawerOpen}
            autoFocus
            anchor={ANCHOR.left}
            onClose={() => setIsDrawerOpen(false)}
          >
            {/* <div style={{ marginTop: '10%' }}>
            <div style={{ marginTop: '5%' }}>
              <Button
                style={{ width: '100%' }}
                // onClick={() => history.push('/customer/update')}
              >
                Update Profile
              </Button>
            </div>
            <div style={{ marginTop: '5%' }}>
              <Button style={{ width: '100%' }}> Past Orders </Button>
            </div>
            <div style={{ marginTop: '5%' }}>
              <Button style={{ width: '100%' }}> Favorites </Button>
            </div>
          </div> */}
          </Drawer>
          <NavigationItem>
            <a href='/customer/dashboard'>
              <img src={logo} style={{ width: '120px', height: '70px' }} />
            </a>
          </NavigationItem>
        </NavigationList>
      </HeaderNavigation>
      <Row>
        <Col
          style={{ textAlign: 'left', paddingLeft: '50px', paddingTop: '20px' }}
        >
          {/* <H2>{orderDetails?.restaurant?.name}</H2> */}
          <div style={{ width: '50%', marginTop: '30px' }}>
            <FormControl
              label='Select Delivery Address'
              style={{ marginTop: '30px' }}
            >
              <Select
                options={addressOptions}
                value={address}
                onChange={(e) => setAddress(e.value)}
                valueKey='address'
                labelKey='address'
                placeholder='Select address'
              />
            </FormControl>
            <Button onClick={() => setAddressModalIsOpen(true)}>
              Add New Address
            </Button>
            <div style={{ marginTop: '40px' }} />
            <FormControl label='Notes'>
            <Input
              id='notes'
              autoComplete='off'
              placeholder='Enter Notes'
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
            </FormControl>
            <FormControl label='Select Delivery Type'>
              <Select
                options={delTypeOptions}
                value={deliveryType}
                valueKey='deliveryType'
                labelKey='deliveryType'
                placeholder='Select delivery Type'
                onChange={(e) => setDeliveryType(e.value)}
              />
            </FormControl>
          </div>
        </Col>
        <Col
          xs={5}
          style={{
            backgroundColor: 'rgb(240, 239, 239)',
            paddingLeft: '35px',
            paddingRight: '35px',
          }}
        >
          <form onSubmit={placeOrder}>
            <Button
              style={{
                width: '100%',
                height: '36px',
                backgroundColor: 'rgb(32, 112, 32)',
                marginTop: '70px',
              }}
            >
              Place Order
            </Button>
          </form>
          <p
            style={{
              fontSize: '12px',
              textAlign: 'left',
              marginTop: '2%',
              color: 'grey',
            }}
          >
            If you're not around when the delivery person arrives, they'll leave
            your order at the door. By placing your order, you agree to take
            full responsibility for it once it's delivered.
          </p>
          <hr />
          <Row>
            <Col style={{ textAlign: 'left' }}>
              <h6> Subtotal </h6>
              <h6> Taxes & Fees </h6>
              <h6> Delivery Fee </h6>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              {orderDetails ? (
                <h6>
                  {parseFloat(orderDetails?.finalPrice) -
                    parseFloat(orderDetails?.tax)}
                </h6>
              ) : null}
              {orderDetails ? <h6> {orderDetails?.tax?.toFixed(2)}</h6> : null}
              <h6> $0</h6>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col style={{ textAlign: 'left' }}>
              <h6> Total </h6>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              {orderDetails ? (
                <h6> {orderDetails?.finalPrice?.toFixed(2)}</h6>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrder;
