import React from 'react';
import logo from '../assets/images/ubereats.png';
import '../assets/css/home.css';
import { Select } from 'baseui/select';
import { Button, SHAPE } from 'baseui/button';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';

function Home(props) {
  const [role, setRole] = React.useState([]);
  const history = useHistory();

  const login = async (e) => {
    e.preventDefault();

    if (role.length === 0) {
      toast.error('Select a role first!');
    } else if (role[0].label === 'Restaurant') {
      history.push('/restaurant/login');
    } else if (role[0].label === 'Customer') {
      history.push('/customer/login');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    if (role.length === 0) {
      toast.error('Select a role first!');
    } else if (role[0].label === 'Restaurant') {
      history.push('/restaurant/register');
    } else if (role[0].label === 'Customer') {
      history.push('/customer/register');
    }
  };

  return (
    <form>
      <div className="flexbox-container home">
        <img src={logo} alt="Logo" style={{ width: '20%' }} />
        <div>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '40vw',
          }}
        >
          <Button shape={SHAPE.default} className="home-button" onClick={login}>
            Login
          </Button>
          <Button
            shape={SHAPE.default}
            className="home-button"
            onClick={register}
          >
            Register
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Home;
