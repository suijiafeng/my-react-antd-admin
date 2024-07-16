// src/pages/UserManagement/index.tsx

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age?: number;
  address?: string;
  title?: string;
  email?: string;
}

const columns1: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button>Edit</Button>
        <Button danger>Delete</Button>
      </Space>
    ),
  },
];

const columns2: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button>Edit</Button>
        <Button danger>Delete</Button>
      </Space>
    ),
  },
];

const generateRandomData = (count: number, type: 'type1' | 'type2'): DataType[] => {
  const names = ['John Brown', 'Jim Green', 'Joe Black', 'Jane Smith', 'Anna White'];
  const addresses = [
    'New York No. 1 Lake Park',
    'London No. 1 Bridge Street',
    'Sydney No. 1 York Street',
    'Tokyo No. 1 Hill Road',
    'Paris No. 1 River Lane',
  ];
  const titles = ['Manager', 'Developer', 'Designer', 'Consultant', 'Intern'];
  const emails = [
    'john@example.com',
    'jim@example.com',
    'joe@example.com',
    'jane@example.com',
    'anna@example.com',
  ];

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return Array.from({ length: count }, (_, i) => ({
    key: (i + 1).toString(),
    name: getRandomElement(names),
    ...(type === 'type1'
      ? {
          age: Math.floor(Math.random() * 60) + 18,
          address: getRandomElement(addresses),
        }
      : {
          title: getRandomElement(titles),
          email: getRandomElement(emails),
        }),
  }));
};

const fetchRandomData = async (type: 'type1' | 'type2'): Promise<DataType[]> => {
  return new Promise((resolve) => {
    const randomCount = Math.floor(Math.random() * 10) + 1; // 生成1到10条随机数据
    const randomDelay = Math.floor(Math.random() * 3000) + 500; // 模拟500ms到3500ms的随机延迟

    setTimeout(() => {
      resolve(generateRandomData(randomCount, type));
    }, randomDelay);
  });
};

const UserManagement: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [columns, setColumns] = useState<ColumnsType<DataType>>(columns1);
  const [loading, setLoading] = useState<boolean>(false);
  const [cachedData, setCachedData] = useState<{ [key: string]: DataType[] }>({});

  const loadData = async (key: string) => {
    setLoading(true);
    const type = key === '1' ? 'type1' : 'type2';
    if (cachedData[key]) {
      setData(cachedData[key]);
      setColumns(key === '1' ? columns1 : columns2);
    } else {
      const result = await fetchRandomData(type);
      setCachedData((prev) => ({ ...prev, [key]: result }));
      setData(result);
      setColumns(key === '1' ? columns1 : columns2);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData('1'); // 默认加载第一个标签的数据
  }, []);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: <Table loading={loading} columns={columns} dataSource={data} />,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <Table loading={loading} columns={columns} dataSource={data} />,
    },
  ];

  const onChange = async (key: string) => {
    console.log(`Tab changed to: ${key}`);
    await loadData(key); // 切换标签时加载相应的数据
  };

  return (
    <div>
      <h1>User Management</h1>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default UserManagement;
