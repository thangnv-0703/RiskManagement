import Footer from '@/components/Footer';
import { login } from '@/services/api';
import { getFakeCaptcha } from '@/services/login';
import { KEY_AUTH_TOKEN } from '@/shared/constant';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };
  const handleSubmit = async (values) => {
    try {
      // Đăng nhập
      const msg = await login({ ...values });
      if (msg.status) {
        localStorage.setItem(KEY_AUTH_TOKEN, msg.data.token);
        const defaultLoginSuccessMessage = 'Login successful!';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      }

      setUserLoginState(msg);
    } catch (error) {
      console.log('Error', error);
      const defaultLoginFailureMessage = 'Login failed, please try again!';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="RiDX"
          subTitle={'Managing Risk in Digital Transformation'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          submitter={{
            searchConfig: {
              submitText: 'Login',
            },
            submitButtonProps: {
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
        >
          {status === 'error' && <LoginMessage content={'Incorrect username/password'} />}
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'Email'}
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'Password'}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Remember me
            </ProFormCheckbox>
            {/* <a
              style={{
                float: 'right',
              }}
            >
              Forgot Password ?
            </a> */}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
