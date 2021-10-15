import React from 'react';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import restLogo from '../../assets/images/ubereats-restaurant-logo.png';
import '../../assets/css/restaurantHome.css';
import { restaurantLogout } from '../../actions/restaurant';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import logo from '../../assets/images/ubereats.png';

const RestaurantNavbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutHandler = () => {
    dispatch(restaurantLogout());
    history.push('/login');
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/restaurant/dashboard">
          <img src={logo} style={{ height: '100px', width: '200px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link style={{ fontSize: '20px' }} href="/restaurant/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link style={{ fontSize: '20px' }} href="/restaurant/dishes">
              Dishes
            </Nav.Link>
            <Nav.Link style={{ fontSize: '20px' }} href="/restaurant/orders">
              Orders
            </Nav.Link>

            <Nav.Link style={{ fontSize: '20px' }} onClick={logoutHandler}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default RestaurantNavbar;
