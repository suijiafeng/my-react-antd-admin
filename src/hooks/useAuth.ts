import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { login, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically verify the token with your backend
      dispatch(login({ username: 'testuser', role: 'admin' }));
    }
    setLoading(false);
  }, [dispatch]);

  const loginUser = (username: string, password: string) => {
    // Here you would typically make an API call to authenticate the user
    dispatch(login({ username, role: 'admin' }));
    localStorage.setItem('token', 'fake-jwt-token');
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return { user, loading, loginUser, logoutUser };
};