import { message } from 'antd';
import { extend } from 'umi-request';
import { history } from 'umi';
import storage from '@/util/storage';

/** 配置request请求时的默认参数 */
const request = extend({
    responseType: 'json',
    credentials: 'include', // 默认请求是否带上cookie
    timeout: 100000, // 接口超时设置
});


const requestInterceptor = (url, options) => {
    const { headers } = options;
    const { REQUEST_URL } = process.env;
    let baseUrl = ''
    if (url.indexOf('http') > -1) {
        baseUrl = url
    } else {
        baseUrl = `${REQUEST_URL}${url}`
    }
    return {
        url: baseUrl,
        options: {
            ...options,
            headers: {
                Authorization: storage.get('token') || '',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...headers,
            },
        },
    };
};
const responseInterceptors = async (response) => {
    if (response.status === 200) {
        if (response.headers.get('content-type') === 'multipart/form-data;charset=UTF-8') {
            return response;
        }
        return response
            .clone()
            .json()
            .then(data => {
                const code = data?.code;
                if (code === 0) {
                    return data.data;
                } else {
                    message.error(data.message);
                    return Promise.reject(data);
                }
            });
    } else if (response.status === 401) {
        message.warning('登陆状态消失,请重新登陆');
        storage.clear();
        history.replace({
            pathname: '/user/login',
        });
        return Promise.reject(response);
    } else {
        message.error(response.statusText);
        return Promise.reject(response);
    }
};

request.interceptors.request.use(requestInterceptor);
request.interceptors.response.use(responseInterceptors);

export default request;
