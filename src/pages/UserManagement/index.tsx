// src/pages/UserManagement/index.tsx

import React, { useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } from '../../store/slices/userSlice';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsersStart());
    // Simulating API call
    setTimeout(() => {
      dispatch(fetchUsersSuccess([
        { id: 1, username: 'john_doe', email: 'john@example.com' },
        { id: 2, username: 'jane_doe', email: 'jane@example.com' },
      ]));
    }, 1000);
  }, [dispatch]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <Table columns={columns} dataSource={users} rowKey="id" />
    </div>
  );
};

export default UserManagement;