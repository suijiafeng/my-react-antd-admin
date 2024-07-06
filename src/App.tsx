// src/App.tsx

import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import routes from './routes';
import './i18n';  // 导入 i18n 配置

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;