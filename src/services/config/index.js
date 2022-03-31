import request from '@/util/request';

// 资方列表
export async function getCapitalListConfigApi(params) {
    return request('/capital/list/v2', {
        method: 'GET',
        params
    });
}

// 重置密码
export async function resetCapitalPasswordApi(data) {
    return request('/capital/password/reset', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 资方详情
export async function getCapitalDetailApi(params) {
    return request('/capital/detail', {
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 添加资方
export async function addCapitalConfiguration(data) {
    return request('/capital/configuration/add', {
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 修改资方
export async function modifyCapitalConfiguration(data) {
    return request('/capital/configuration/modify', {
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}














