import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getItemsFromLocalStorage } from '../utility/utils';

const PrivateRoutes = () => {
  const { token } = getItemsFromLocalStorage();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;