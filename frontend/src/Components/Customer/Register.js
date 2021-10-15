import React from 'react';
import logo from '../../assets/images/ubereats.png';
import '../../assets/css/home.css';
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../../axiosConfig';
import { useDispatch } from 'react-redux';
import {
  registerCustomerRequest,
  registerCustomerSuccess,
  registerCustomerFailure,
} from '../../actions/customer';
import { Datepicker } from 'baseui/datepicker';
import toast from 'react-hot-toast';
import { Select } from 'baseui/select';
import {
  registerRestaurantFailure,
  registerRestaurantRequest,
  registerRestaurantSuccess,
} from '../../actions/restaurant';
import { useHistory } from 'react-router';
const jwt = require('jsonwebtoken');

function Register() {
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState([]);

  const [name, setName] = React.useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const register = async (e) => {
    dispatch(registerCustomerRequest());
    e.preventDefault();

    if (role.length === 0) {
      toast.error('Select role first!');
      return;
    }

    if (role[0].label === 'Customer') {
      try {
        const data = {
          email: emailId,
          password: password,
          name: name,
        };
        const response = await axiosInstance.post('auth/register', data);
        const tokenData = jwt.decode(response.data.token);
        const id = tokenData.c_id;

        dispatch(registerCustomerSuccess(id, response.data.token));

        localStorage.setItem('token', response.data.token);
        toast.success('Successfully registered!');
        history.push('/customer/dashboard');
      } catch (err) {
        toast.error(err.response.data.error);
        dispatch(registerCustomerFailure(err.response.data.error));
        toast.error('Error while Registering! Please Try again');
      }
    }
    if (role[0].label === 'Restaurant') {
      dispatch(registerRestaurantRequest());
      try {
        const data = {
          email: emailId,
          password: password,
          name: name,
        };
        const response = await axiosInstance.post('auth/resregister', data);
        const tokenData = jwt.decode(response.data.token);
        const id = tokenData.r_id;
        dispatch(registerRestaurantSuccess(id, response.data.token));
        localStorage.setItem('token', response.data.token);
        toast.success('Successfully registered!');
        history.push('/restaurant/dashboard');
      } catch (err) {
        toast.error(err.response.data.error);
        dispatch(registerRestaurantFailure(err.response.data.error));
        toast.error('Error while Registering! Please Try again');
      }
    }
  };

  return (
    <div className="flexbox-container login">
      <img src={logo} alt="Logo" style={{ width: '20%' }} />
      <h1 style={{ textDecoration: 'none', fontFamily: 'sans-serif' }}>
        {' '}
        Let's Get Started{' '}
      </h1>
      <center>
        <form onSubmit={register}>
          <div
            style={{
              width: '30vw',
              margin: '2%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '15px',
              }}
            >
              {' '}
              Enter your email Id{' '}
            </p>
            <Input
              value={emailId}
              onChange={(event) => setEmailId(event.currentTarget.value)}
              placeholder="Email"
              type="email"
              required
            />
            <p
              style={{
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '15px',
              }}
            >
              {' '}
              Enter your password{' '}
            </p>

            <Input
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Password"
              type="password"
              required
            />
            <p
              style={{
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '15px',
              }}
            >
              {' '}
              Enter your name{' '}
            </p>
            <Input
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Name"
              type="text"
              required
            />

            <p
              style={{
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '15px',
              }}
            >
              Role
            </p>

            <div style={{ width: '100%' }}>
              <Select
                options={[
                  { label: 'Restaurant', id: '#F0F8FF' },
                  { label: 'Customer', id: '#FAEBD7' },
                ]}
                value={role}
                placeholder="Select Role"
                onChange={(params) => setRole(params.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '40vw',
              marginTop: '30px',
            }}
          >
            <Button shape={SHAPE.pill} className="home-button" type="submit">
              Register
            </Button>
          </div>
        </form>
      </center>
      <br></br>
      <p
        style={{
          fontFamily: 'sans-serif',
          textDecoration: 'none',
          fontSize: 'large',
          marginTop: '30px',
        }}
      >
        {' '}
        Already use UberEats ?{' '}
        <a href="/login" style={{ color: 'green', textDecoration: 'none' }}>
          {' '}
          login{' '}
        </a>
      </p>
    </div>
  );
}

export default Register;
