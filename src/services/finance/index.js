import request from '@/util/request';

// const qnvipHttp = 'http://rm.api.qa.qnvipmall.com'

let qnvipHttp = 'https://manage.api.qnvipmall.com'
const { REQUEST_URL } = process.env;
if (REQUEST_URL.indexOf('qa') > -1) {
    qnvipHttp = 'http://rm.api.qa.qnvipmall.com'
}

/**
 * 结算汇总
 * @param {
*   capitalIds 资方简称
 *  startTime
 *  endTime
 * }
 * @returns {Promise<any>}
 */
export function viewOrderTotal(params) {
    return request(`/order/view/order/total`, {
        method: 'GET',
        params
    });
}

/**
 * 推单总览
 * @param params
 * {
 *  capitalIds 资方简称
 *  startTime
 *  endTime
 * }
 * @returns {Promise<any>}
 */
export function viewPushAllView(params) {
    return request(`/order/view/push/allView`, {
        method: 'GET',
        params
    });
}

/**
 * 未推单数据
 * @param params
 * {
 *  date
 * }
 * @returns {Promise<any>}
 */
export function unPushOrder(params) {
    return request(`/order/view/push/unPushOrder`, {
        method: 'GET',
        params
    });
}
