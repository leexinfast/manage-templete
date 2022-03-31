import { useEffect } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { redirect, adminLogin } from '@/services/user';
import { GetUrlParams } from '@/util/utils';
import storage from '@/util/storage';

const loginPath = '/user/login'
const capitalManage = '/capital-manage'

const Login = () => {
    const redirectAuth = () => {
        redirect().then((res) => {
            if (res) {
                const { redirectUrl, clientId, responseType, url } = res;
                let redirect_uri = '';
                if (process.env.UMI_ENV == 'pre') {
                    redirect_uri = redirectUrl;
                } else {
                    redirect_uri = location.origin + getWebUrl();
                }
                // storage.set('redirectUri', redirect_uri);
                let href = `${url}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
                    redirect_uri,
                )}`;
                window.location.href = href;
            }
        }).catch(err => {
            console.log('redirectAuth=>', err)
        })
    };

    const getWebUrl = () => {
        if (process.env.UMI_ENV == 'prod') {
            return capitalManage + loginPath
        } else {
            return loginPath
        }
    }

    const openFullScreen = () => {
        let str = GetUrlParams('code');
        if (str.indexOf('#') >= -1) {
            str = str.split('#')[0];
        }
        let redirect_uri = location.origin + getWebUrl() + location.search;
        adminLogin({
            code: str,
            state: GetUrlParams('state'),
            redirectUri:
                process.env.UMI_ENV == 'pre'
                    ? redirect_uri
                    : `${location.origin}${getWebUrl()}`,
        }).then((res) => {
            if (res) {
                const { Authorization, staff } = res;
                const defaultLoginSuccessMessage = '登录成功！';
                message.success(defaultLoginSuccessMessage);
                storage.set('token', Authorization);
                storage.set('staff', staff);
                /** 此方法会跳转到 redirect 参数所在的位置 */
                let href = process.env.UMI_ENV == 'prod' ? window.location.origin + capitalManage : window.location.origin
                window.location.href = href;
            }
        }).catch(err => {
            history.replace({
                pathname: '/user/login',
            });
            redirectAuth();
        })
    };
    useEffect(() => {
        if (GetUrlParams('token') || GetUrlParams('userInfo')) {
            try {
                let token = decodeURIComponent(GetUrlParams('token'));
                let userInfo = JSON.parse(decodeURIComponent(GetUrlParams('userInfo')));
                storage.set('token', token);
                storage.set('staff', userInfo);
                history.push('/');
            } catch (err) {
                console.log(err);
            }
        } else if (GetUrlParams('code')) {
            openFullScreen();
        } else {
            redirectAuth();
        }
    }, []);
    return <div>正在重定向第三页面...</div>;
};
export default Login;
