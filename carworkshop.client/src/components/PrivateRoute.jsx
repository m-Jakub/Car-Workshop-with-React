import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element, isAuthenticated, userRole, requiredRole }) => {
  return isAuthenticated && userRole === requiredRole ? element : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userRole: PropTypes.string,
  requiredRole: PropTypes.string,
};

export default PrivateRoute;