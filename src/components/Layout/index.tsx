// src/components/Layout/index.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <Layout className={styles.appLayout}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className={styles.siteLayout} style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header className={styles.siteLayoutBackground} />
        <Content className={styles.siteLayoutContent}>
          {loading ? (
            <div className={styles.spinContainer}>
              <Spin size="large" />
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
        <Footer className={styles.siteLayoutFooter}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;