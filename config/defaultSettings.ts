import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '资方管理后台',
  pwa: false,
  logo: 'https://data-overview.oss-cn-hangzhou.aliyuncs.com/logo/logo_w256.png',
  iconfontUrl: '',
  menu: {
    locale: false
  }
};

export default Settings;
