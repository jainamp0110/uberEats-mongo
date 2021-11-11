import React from 'react';
import logo from '../../assets/images/ubereats.png';
import '../../assets/css/home.css';
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../../axiosConfig';
import { useDispatch } from 'react-redux';
import {
  loginCustomerRequest,
  loginCustomerSuccess,
  loginCustomerFailure,
} from '../../actions/customer';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import { Select } from 'baseui/select';
import {
  loginRestaurantRequest,
  loginRestaurantSuccess,
} from '../../actions/restaurant';

const jwt = require('jsonwebtoken');

function Login() {
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const [role, setRole] = React.useState([]);

  const login = async (e) => {
    e.preventDefault();

    if (role.length === 0) {
      toast.error('Select role first!');
      return;
    }

    try {
      const data = {
        email: emailId,
        password: password,
      };
      if (role[0].label === 'Customer') {
        dispatch(loginCustomerRequest());
        const response = await axiosInstance.post('auth/login', data);
        const tokenData = jwt.decode(response.data.token);
        const id = tokenData.id;
        dispatch(loginCustomerSuccess(id, response.data.token));
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in!');
        history.push('/customer/dashboard');
      }
      if (role[0].label === 'Restaurant') {
        dispatch(loginRestaurantRequest());
        const response = await axiosInstance.post('auth/reslogin', {
          email: emailId,
          password: password,
        });
        const tokenData = jwt.decode(response.data.token);
        const id = tokenData.id;
        dispatch(loginRestaurantSuccess(id, response.data.token));
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in!');
        history.push('/restaurant/dashboard');
      }
    } catch (err) {
      toast.error(`Login error for ${role[0].label}!`);
    }
  };

  return (
    <div className="flexbox-container login">
      <img
        src={logo}
        alt="Logo"
        onClick={() => history.push('/')}
        style={{ width: '20%' }}
      />
      <h1 style={{ fontFamily: 'sans-serif' }}> Welcome Back </h1>
      <center>
        <form onSubmit={login}>
          <div
            style={{
              width: '30vw',
              margin: '2%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <p style={{ fontSize: '20px', marginBottom: '5px' }}> Email Id </p>
            <Input
              value={emailId}
              onChange={(event) => setEmailId(event.currentTarget.value)}
              placeholder="Email"
              type="email"
            />
            <p
              style={{
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '15px',
              }}
            >
              {' '}
              Password{' '}
            </p>

            <Input
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Password"
              type="password"
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
              marginTop: '50px',
            }}
          >
            <Button shape={SHAPE.pill} className="home-button" type="submit">
              Login
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
          marginTop: '50px',
        }}
      >
        {' '}
        New to UberEats?{' '}
        <a href="/register" style={{ color: 'green', textDecoration: 'none' }}>
          {' '}
          Create an account{' '}
        </a>
      </p>
    </div>
  );
}

export default Login;
