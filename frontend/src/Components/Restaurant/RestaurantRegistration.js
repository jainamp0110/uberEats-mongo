import React from 'react';
import logo from '../../assets/images/ubereats.png';
import '../../assets/css/home.css'
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../../axiosConfig';
import { useDispatch } from 'react-redux';
import { registerRestaurantRequest, registerRestaurantSuccess, registerRestaurantFailure } from '../../actions/restaurant'
import { Datepicker } from 'baseui/datepicker';
import toast from 'react-hot-toast';
const jwt = require('jsonwebtoken')

function RestaurantRegistration() {
    const [emailId, setEmailId] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [name, setName] = React.useState('');
    // const [dateOfBirth, setDateOfBirth] = React.useState('');
    // const [city, setCity] = React.useState('');
    // const [stateName, setStateName] = React.useState('');
    // const [country, setCountry] = React.useState('');
    // const [contact, setContact] = React.useState('');
    // const [nname, setNickName] = React.useState('');

    const dispatch = useDispatch();

    const restaurantRegister = async (e) => {
        dispatch(registerRestaurantRequest());
        e.preventDefault();

        try {
            const data = {
                email: emailId,
                password: password,
                name: name,
            }
            const response = await axiosInstance.post('auth/resregister', data)

            const tokenData = jwt.decode(response.data.token);

            const id = tokenData.r_id;

            dispatch(registerRestaurantSuccess(id, response.data.token));

            localStorage.setItem('token', response.data.token)
        } catch (err) {
            toast.error(err.response.data.error)
            dispatch(registerRestaurantFailure(err.response.data.error));
            toast.error("Error while Registering! Please Try again");

        }
    }

    return (
        <div className="flexbox-container login">
            <img src={logo} alt="Logo" style={{ width: '20%' }} />
            <h1 style={{ textDecoration: 'none', fontFamily: 'sans-serif' }}> Let's Get Started with Restaurant Manager</h1>
            <form onSubmit={restaurantRegister}>
                <div style={{ width: '40vw', margin: '2%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p> Enter your email Id </p>
                    <Input
                        value={emailId}
                        onChange={event => setEmailId(event.currentTarget.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <p> Enter your password </p>

                    <Input
                        value={password}
                        onChange={event => setPassword(event.currentTarget.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <p> Enter your name </p>
                    <Input
                        value={name}
                        onChange={event => setName(event.currentTarget.value)}
                        placeholder="Name"
                        type="text"
                        required
                    />

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '40vw' }}>
                    <Button shape={SHAPE.pill}
                        className="home-button"
                        type="submit"
                    >
                        Register
                    </Button>
                </div>
            </form>
            <br></br>
            <p style={{ fontFamily: 'sans-serif', textDecoration: 'none', fontSize: 'large' }}> Already use UberEats ? <a href="/restaurantLogin" style={{ color: 'green', textDecoration: 'none' }}> login </a></p>
        </div>
    );
}

export default RestaurantRegistration;
