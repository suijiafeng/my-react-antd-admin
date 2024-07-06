// src/pages/Login/index.tsx

import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    // In a real app, you would make an API call here
    dispatch(login({ username: values.username, role: 'admin' }));
    message.success('Login successful');
    navigate('/');
  };

  return (
    <div className={styles.loginContainer}>
      <Form
        name="normal_login"
        className={styles.loginForm}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h1 className={styles.loginFormTitle}>Welcome Back</h1>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            size="large"
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className={styles.loginFormForgot} href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button size="large" type="primary" htmlType="submit" className={styles.loginFormButton}>
            Log in
          </Button>
        </Form.Item>
        
        <div className={styles.loginFormRegister}>
          Don't have an account? <a href="">Register now!</a>
        </div>
      </Form>
    </div>
  );
};

export default Login;