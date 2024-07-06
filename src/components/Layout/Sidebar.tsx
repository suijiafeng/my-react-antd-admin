// src/components/Layout/Sidebar.tsx

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  TeamOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    getItem('Dashboard', '/', <DashboardOutlined />),
    getItem('User Management', '/users', <UserOutlined />),
    getItem('Products', '/products', <ShopOutlined />),
    getItem('Team', 'sub1', <TeamOutlined />, [
      getItem('Team 1', '/team/team1'),
      getItem('Team 2', '/team/team2'),
    ]),
    getItem('Files', '/files', <FileOutlined />),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Logo />
      <Menu
        theme="dark"
        defaultSelectedKeys={['/']}
        mode="inline"
        items={items}
        onClick={onClick}
        selectedKeys={[location.pathname]}
      />
    </Sider>
  );
};

export default Sidebar;