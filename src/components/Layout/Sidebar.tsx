// src/components/Layout/Sidebar.tsx

import React from 'react';
import { Layout, Menu, Tooltip, Button, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  TeamOutlined,
  ShopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items: MenuItem[] = [
    getItem(t('sidebar.dashboard'), '/', <DashboardOutlined />),
    getItem(t('sidebar.userManagement'), '/users', <UserOutlined />),
    getItem(t('sidebar.products'), '/products', <ShopOutlined />),
    getItem(t('sidebar.team'), 'sub1', <TeamOutlined />, [
      getItem(t('sidebar.team1'), '/team/team1'),
      getItem(t('sidebar.team2'), '/team/team2'),
    ]),
    getItem(t('sidebar.files'), '/files', <FileOutlined />),
    getItem(t('sidebar.game'), '/game', <FileOutlined />),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const getMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems.map(item => {
      if (item && 'label' in item && 'key' in item) {
        const { label, children } = item as MenuItem & { children?: MenuItem[],label:string };
        return {
          ...item,
          label: collapsed ? (
            <Tooltip placement="right" title={label}>
              <span>{label}</span>
            </Tooltip>
          ) : (
            label
          ),
          ...(children ? { children: getMenuItems(children) } : {}),
        };
      }
      return item;
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: '#001529',
            itemColor: 'rgba(255, 255, 255, 0.65)',
            itemHoverColor: '#fff',
            itemSelectedBg: '#1890ff',
            itemSelectedColor: '#fff',
          },
        },
      }}
    >
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        className="fixed left-0 h-screen z-10"
        trigger={null}
        width={200}
        collapsedWidth={80}
      >
        <div className="flex flex-col h-full">
          <Logo />
          <Menu
            theme="dark"
            defaultSelectedKeys={['/']}
            mode="inline"
            items={getMenuItems(items)}
            onClick={onClick}
            selectedKeys={[location.pathname]}
            className="flex-1"
          />
          <div className="p-4 bg-black bg-opacity-10">
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)}
              className="w-full h-10 flex items-center justify-center text-white hover:text-blue-400"
            />
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;