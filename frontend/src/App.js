import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

import { LightTheme, BaseProvider } from 'baseui';

import Login from './Components/Customer/Login';
import { Toaster } from 'react-hot-toast'
import RestaurantRegistration from './Components/Restaurant/RestaurantRegistration';
import RestaurantLogin from './Components/Restaurant/RestaurantLogin';
import RestaurantDashboard from './Components/Restaurant/RestaurantDashboard'
import MediaUploader from './Components/MediaUploader';
import CustomerDashboard from './Components/Customer/CustomerDashboard';
import PlaceOrder from './Components/Customer/PlaceOrder';
import UpdateCustomer from './Components/Customer/UpdateCustomer';
import RestaurantDetails from './Components/Customer/RestaurantDetails';
import CustomerOrders from './Components/Customer/CustomerOrders';
import CustomerFavorites from './Components/Customer/CustomerFavorites';
import RestaurantOrders from './Components/Restaurant/RestaurantOrders';
import AccessComponent from './Components/AccessComponent';
import Register from './Components/Customer/Register';
import RestaurantDishes from './Components/Restaurant/RestaurantDishes';

const engine = new Styletron();

function App() {
  return (
    <div className='App'>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme} zIndex={1500}>
          <React.Suspense fallback={<span> Loading...</span>}>
            <Toaster />
            <Router>
              <Switch>
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <Route path='/restaurant/login' component={ RestaurantLogin } />
                <Route path='/restaurant/register' component={RestaurantRegistration} />
                <Route path='/restaurant/dashboard' component={AccessComponent(RestaurantDashboard)} />
                <Route path='/customer/dashboard' component={AccessComponent(CustomerDashboard)} />
                <Route path='/customer/fvrts' component={AccessComponent(CustomerFavorites)} />
                <Route path='/customer/orders' component={AccessComponent(CustomerOrders)} />
                <Route path='/customer/update' component={AccessComponent(UpdateCustomer)} />
                <Route path='/customer/restaurant/:restId' component={AccessComponent(RestaurantDetails)} />
                <Route path='/customer/placeorder/:oid' component={AccessComponent(PlaceOrder)} />
                <Route path='/mediaUploader' component={MediaUploader} />
                <Route path='/restaurant/orders/' component={AccessComponent(RestaurantOrders)} />   
                <Route path='/restaurant/dishes' component={AccessComponent(RestaurantDishes)} />  
                <Route path='/' component={Login} />
              </Switch>
            </Router>
          </React.Suspense>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
