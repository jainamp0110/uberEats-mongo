/* eslint-disable */
import React from 'react';
import jwt from 'jsonwebtoken';

function AccessComponent(ComposedComponent) {
    class Authenticate extends React.Component {
        constructor(props) {
          super(props);
    
          this.state = {
            isAuthenticated: false,
          };
        }
    
        componentDidMount() {
            console.log(this.props.history.location.pathname);
          this.checkAndRedirect();
        }
    
        // componentDidUpdate() {
        //   this.checkAndRedirect();
        // }
    
        goToLogin = () => {
          // toast.error("Please login first!");
          this.props.history.push('/');
        };
    
        checkAndRedirect = () => {
          const token = localStorage.getItem('token');
          if (!token) {
            this.goToLogin();
            return;
          }
          const decoded = jwt.decode(token);
          if (!decoded.hasOwnProperty('role')) {
            this.goToLogin();
            return;
          }
          const resRegex = /^\/restaurant(.)*/;
          const custRegex = /^\/customer(.)*/;
          if (
            decoded.role === 'restaurant' &&
            resRegex.test(this.props.history.location.pathname)
          ) {
            this.setState({ isAuthenticated: true });
          } else if (
            decoded.role === 'customer' &&
            custRegex.test(this.props.history.location.pathname)
          ) {
            this.setState({ isAuthenticated: true });
          } else {
            this.goToLogin();
          }
        };
    
        render() {
          return (
            <div>
              {this.state.isAuthenticated ? (
                <ComposedComponent {...this.props} />
              ) : null}
            </div>
          );
        }
      }
    
      return Authenticate;
}

export default AccessComponent