import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileAttempt } from '../actions/auth_actions';

const ProtectedRoute = ({ children }) => {
  const reduxToken = useSelector((state) => state.authReducer.login_access_token);
  const profileData = useSelector((state) => state.authReducer.getProfileData);
  const dispatch = useDispatch();

  // Use Redux token or fall back to localStorage (covers pre-rehydration)
  const token = reduxToken || localStorage.getItem('accessUserToken') || '';

  // Fetch profile once when we have a token but no profile data (e.g., page refresh)
  useEffect(() => {
    if (token && (!profileData || !profileData.firstName)) {
      dispatch(getProfileAttempt());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
