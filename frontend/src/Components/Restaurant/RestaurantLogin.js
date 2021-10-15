import React from 'react';
import logo from '../../assets/images/ubereats.png';
import '../../assets/css/home.css'
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../../axiosConfig';
import { useDispatch } from 'react-redux';
import { loginRestaurantRequest, loginRestaurantSuccess, loginRestaurantFailure } from '../../actions/restaurant'
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
const jwt = require( 'jsonwebtoken');

function RestaurantLogin() {
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();

  const dispatch = useDispatch();

  const RestaurantLogin = async (e) => {
    dispatch(loginRestaurantRequest());
    e.preventDefault();
    try {
      const response = await axiosInstance.post('auth/reslogin', { email: emailId, password: password})
      const tokenData = jwt.decode(response.data.token);
      const id = tokenData.r_id;
      dispatch(loginRestaurantSuccess(id, response.data.token));
      localStorage.setItem('token', response.data.token)
      history.push("/restaurant/dashboard");
    } catch (err) {
      console.log(err)
      dispatch(loginRestaurantFailure(err));
      toast.error("Error while Login! Please Try again");
    }
  }

  return (
    <div className="flexbox-container login">
      <img src={logo} alt="Logo" style={{ width: '20%' }} />
      <h1 style={{  fontFamily: 'sans-serif' }}> Welcome Back Restaurant Manager </h1>
      <form onSubmit={RestaurantLogin}>
        <div style={{ width: '40vw', margin: '2%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p> Email Id </p>
          <Input
            value={emailId}
            onChange={event => setEmailId(event.currentTarget.value)}
            placeholder="Email"
            type="email"
          />
          <p> Password </p>

          <Input
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
            placeholder="Password"
            type="password"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '40vw' }}>
          <Button shape={SHAPE.pill}
            className="home-button"
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>
      <br></br>
      <p style={{fontFamily: 'sans-serif', textDecoration: 'none', fontSize: 'large'}}> New to UberEats? <a href="/restaurantRegister" style={{color: 'green', textDecoration: 'none'}}> Create an account </a></p>
    </div>
  );
}

export default RestaurantLogin;
