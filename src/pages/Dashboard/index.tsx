// src/pages/Dashboard/index.tsx

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>

      <h1 className='p-4 bg-blue-500 text-white'>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Users"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Products"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Revenue"
              value={15600}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;