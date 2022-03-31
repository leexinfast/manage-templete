import request from '@/util/request';
import qs from 'qs';

// 重定向第三方接口数据
export async function redirect(params?: { [key: string]: any }) {
  return request('/login/app', {
    method: 'GET',
    params,
  });
}
//登陆
export async function adminLogin(params?: { [key: string]: any }) {
  return request('/login/login', {
    method: 'POST',
    data: qs.stringify(params),
  });
}
//退出登陆
export async function outLogin(params?: { [key: string]: any }) {
  return request('/login/logout', {
    method: 'POST',
    data: qs.stringify(params),
  });
}
