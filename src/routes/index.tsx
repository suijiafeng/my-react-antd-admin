import { RouteObject } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/users',
    element: <UserManagement />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;