import request from '@/util/request';

// const qnvipHttp = 'http://rm.api.qa.qnvipmall.com'

let qnvipHttp = 'https://manage.api.qnvipmall.com'
const { REQUEST_URL } = process.env;
if (REQUEST_URL.indexOf('qa') > -1) {
    qnvipHttp = 'http://rm.api.qa.qnvipmall.com'
}


export async function getCapitalOrderList(params) {
    return request(`${qnvipHttp}/admin/loan/capitalOrder/list`, {
        method: 'GET',
        params
    });
}

// 资金明细
export async function getFinanceReportFunds(params) {
    return request(`${qnvipHttp}/admin/financeReport/funds`, {
        method: 'GET',
        params
    });
}

// 获取miniType
export function getMiniTypeListApi(params) {
    return request(`${qnvipHttp}/admin/mall/mp/order/miniTypeList`, {
        method: 'GET',
        params
    });
}

// 资方列表
export function getCapitalListApi(params) {
    return request(`${qnvipHttp}/admin/capital/list`, {
        method: 'GET',
        params
    });
}

// 商品主分类
export function getMainCategoryApi(params) {
    return request(`${qnvipHttp}/admin/mainCategory`, {
        method: 'GET',
        params
    });
}

// 资方还款明细
export function getCapitalOrderreturnDetailsApi(params) {
    return request(`${qnvipHttp}/admin/loan/capitalOrder/returnDetails`, {
        method: 'GET',
        params
    });
}

// 资方放款管理
export function getSupplierCapitalRentTotalApi(params) {
    return request(`${qnvipHttp}/supplier/capital/order/capitalRentTotal/v2`, {
        method: 'GET',
        params
    });
}

// 资方放款管理概览
export function getCapitalOrderInfoApi(params) {
    return request(`${qnvipHttp}/supplier/capital/order/loanInfo/v2`, {
        method: 'GET',
        params
    })
}

//获取权限菜单
export async function getMenuRoutesData() {
    return request('/menu/router', {
      method: 'GET',
      params
    });
  }

// 可推送订单
export function getAllowPushOrder(params) {
    return request('/order/view/push/allow', {
        method: 'GET',
        params
    });
}

// 标记订单
export function operateCapitalMark(data) {
    return request('/order/operate/capital/mark', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 标记订单
export function getWaitReportOrder(params) {
    return request('/order/view/wait/report', {
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 标记订单
export function signOperateContractApi(data) {
    return request('/order/operate/contract/sign', {
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 报租赁宝
export function operateZlbReportApi(data) {
    return request('/order/operate/zlb/report', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 人保投保服务
export function operateInsureApi(data) {
    return request('/order/operate/insure', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 人保投保服务
export function reportOperateCapitalApi(data) {
    return request('/order/operate/capital/report', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 移除标记
export function removeOperateCapitalApi(data) {
    return request('/order/operate/capital/remove', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 已发货列表
export function getSendListApi(params) {
    return request(`/order/view/send/list`, {
        method: 'GET',
        params
    });
}

// 进件
export function operateCapitalOrderApply(data) {
    return request('/order/operate/capital/orderApply', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

// 查询资方授信结果
export function operateCapitalCreditQuery(data) {
    return request('/order/operate/capital/creditQuery', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}

/**
 * 需代偿订单
 * @param params
 * {
 *  capitalId 资方简称
 *  compensatoryFlag 代偿标识
 *  customerMobile 手机号
 *  customerName 姓名
 *  endTime 结束时间
 *  capitalOrigin 资方来源
 *  orderNo 订单号
 *  startTime 开始时间
 * }
 * @returns {Promise<any>}
 */
export function unCompensatoryList(params) {
    return request(`/order/view/compensatory/unCompensatoryList`, {
        method: 'GET',
        params
    });
}

/**
 * 代偿订单
 * @param params
 * {
 *  capitalId 资方简称
 *  compensatoryEndTime 代偿标识
 *  compensatoryStartTime 手机号
 *  customerName 姓名
 *  mobile 手机号
 *  orderNo 订单号
 *  repayEndTime 还款结束时间
 *  repayStartTime 还款开始时间
 *  repayStatus 还款状态
 *  repayType 还款方式
 * }
 * @returns {Promise<any>}
 */
export function compensatoryList(params) {
    return request(`/order/view/compensatory/compensatoryList`, {
        method: 'GET',
        params
    });
}

/**
 * 确认还款
 * @param data
 * @returns {Promise<any>}
 */
export function capitalConfirmRepay(data) {
    return request('/order/operate/capital/confirmRepay', {
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}









