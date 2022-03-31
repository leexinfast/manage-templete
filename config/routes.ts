export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user',
                routes: [
                    {
                        name: '登录',
                        path: '/user/login',
                        component: './user/Login',
                    },
                ],
            },
            {
                component: './404',
            },
        ],
    },
    {
        path: '/order',
        name: '订单列表',
        icon: 'crown',
        access: 'canAdmin',
        routes: [
            {
                path: '/order',
                redirect: '/order/orderCapital',
            },
            {
                path: '/order/allowPush',
                name: '可推送订单',
                icon: 'smile',
                component: './order/allowPush',
            },
            {
                path: '/order/reportWaitOrder',
                name: '待报订单',
                icon: 'smile',
                component: './order/reportWaitOrder',
            },
            {
                path: '/order/orderCapital',
                name: '资方订单',
                icon: 'smile',
                component: './order/orderCapital',
            },
            {
                path: '/order/deliverOrder',
                name: '已发货列表',
                icon: 'smile',
                hideInMenu: false,
                component: './order/deliverOrder',
            },
            {
                path: '/order/require-compensatory',
                name: '需代偿订单',
                icon: 'smile',
                hideInMenu: false,
                component: './order/require-compensatory',
            },
            {
                path: '/order/compensatory',
                name: '代偿订单',
                icon: 'smile',
                hideInMenu: false,
                component: './order/compensatory',
            }
        ],
    }, {
        path: '/finance',
        name: '财务管理',
        icon: 'crown',
        access: 'canAdmin',
        routes: [
            {
                path: '/finance',
                redirect: '/finance/finance-funds',
            },
            {
                path: '/finance/finance-funds',
                name: '资金明细',
                icon: 'smile',
                component: './finance/finance-funds',
            },
            {
                path: '/finance/capital-repayment-plan',
                name: '资方还款明细',
                icon: 'smile',
                component: './finance/capital-repayment-plan',
            },
            {
                path: '/finance/capital-make-loans',
                name: '放款管理',
                icon: 'smile',
                component: './finance/capital-make-loans',
            },
            {
                path: '/finance/settlement-summary',
                name: '结算汇总',
                icon: 'smile',
                hideInMenu: false,
                component: './finance/settlement-summary',
            },
            {
                path: '/finance/push-list-overview',
                name: '推单总览',
                icon: 'smile',
                hideInMenu: false,
                component: './finance/push-list-overview',
            },
        ],
    },
    {
        path: '/config',
        name: '配置',
        icon: 'crown',
        access: 'canAdmin',
        routes: [
            {
                path: '/config',
                redirect: '/config/capitalConfig',
            },
            {
                path: '/config/capitalConfig',
                name: '资方配置',
                icon: 'smile',
                component: './config/capitalConfig',
            },
        ],
    },
    {
        path: '/',
        redirect: '/order',
    },
    {
        component: './404',
    },
    {
        path: '/',
        redirect: '/order'
    },
]
