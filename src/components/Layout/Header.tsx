// src/components/Layout/Header.tsx

import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageMenu: MenuProps['items'] = [
    {
      key: 'en',
      label: t('header.english'),
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'zh',
      label: t('header.chinese'),
      onClick: () => changeLanguage('zh'),
    },
  ];

  return (
    <Header style={{ background: '#fff', padding: 0 }}>
      <div style={{ float: 'right', marginRight: '20px' }}>
        <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
          <GlobalOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;