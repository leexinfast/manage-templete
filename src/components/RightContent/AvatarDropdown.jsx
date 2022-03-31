import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Menu } from 'antd';
import HeaderDropdown from '@/components/HeaderDropdown';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import storage from '@/util/storage';
import styles from './index.less';
import { outLogin } from '@/services/user';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {} } = history.location;
  const { redirect } = query; // Note: There may be security issues, please note

  if (window.location.pathname !== '/user/login' && !redirect) {
    storage.clear();
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: window.location.pathname,
      }),
    });
  }
};

const AvatarDropdown = ({ menu }) => {
  const [userInfo, setUserInfo] = useState({});
  const { setInitialState } = useModel('@@initialState');
  useEffect(() => {
    const staff = storage.get('staff');
    setUserInfo(staff || {});
  }, []);
  const onMenuClick = useCallback((event) => {
    const { key } = event;

    if (key === 'logout') {
      loginOut();
      return;
    }

    history.push(`/account/${key}`);
  }, []);



  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src="https://data-overview.oss-cn-hangzhou.aliyuncs.com/logo/logo_w256.png"
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{userInfo.username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
