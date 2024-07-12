// src/routes/index.tsx

import { RouteObject } from 'react-router-dom';
import AppLayout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import Products from '../pages/Products';
import Team1 from '../pages/Team/Team1';
import Team2 from '../pages/Team/Team2';
import Files from '../pages/Files';
import NotFound from '../pages/NotFound';
import Tetris from '../pages/Game/Tetris'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'products', element: <Products /> },
      { path: 'team/team1', element: <Team1 /> },
      { path: 'team/team2', element: <Team2 /> },
      { path: 'files', element: <Files /> },
      { path: 'game', element: <Tetris /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export default routes;