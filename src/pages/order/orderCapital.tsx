import {Space, Button} from 'antd';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import type {ProColumns} from '@ant-design/pro-table';
import {getCapitalOrderList} from '@/services/order'
import {useState} from 'react';

const capitalVerifyResultList = {
    0: '初始',
    50: '开户',
    100: '授信',
    150: '授信成功',
    200: '授信失败',
    250: '合同签署',
    300: '待用户合同签署',
    350: '待上报/合同签署成功',
    400: '待资方审核/用信申请',
    450: '已拒绝/用信失败',
    500: '已通过',
}


export default function OrderPush() {
    const [capitalList, setCapitalList] = useState({})

    const columns: ProColumns<OrderAPI.ListCapital>[] = [
        {
            title: '资方简称',
            dataIndex: 'capitalName',
            fixed: true,
            width: 100,
            valueType: 'select',
            fieldProps: {
                showSearch: true
            },
            valueEnum: capitalList,
            align: 'center'
        },
        {
            title: '订单号',
            dataIndex: 'loanNo',
            width: 190,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 100,
            hideInTable: true,
            align: 'center',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            width: 120,
            hideInTable: true,
            align: 'center'
        },
        {
            title: '用户信息',
            width: 200,
            search: false,
            render: (text, record, index) => (
                <>
                    <div>姓名：{record.name}</div>
                    <div>手机号：{record.mobile}</div>
                </>
            )
        },
        {
            title: '上报状态',
            dataIndex: 'capitalVerifyResult',
            align: 'center',
            fieldProps: {
                showSearch: true
            },
            hideInTable: true,
            valueEnum: {
                ...capitalVerifyResultList
            }
        },
        {
            title: '商品名称',
            dataIndex: 'brand',
            search: false,
            width: 220,
        },
        {
            title: '上报资方采购价',
            dataIndex: 'reportAmt',
            valueType: 'digit',
            width: 120,
            search: false,
            align: 'center'
        },
        {
            title: '上报状态',
            dataIndex: 'reportStatus',
            valueType: 'digit',
            width: 170,
            search: false,
            align: 'center',
            render: (text, record, index) => (
                <>
                    <span>{capitalVerifyResultList[record.reportStatus]}</span>
                </>
            ),
        },
        {
            title: '上报时间',
            dataIndex: 'reportTime',
            search: false,
            width: 170,
            align: 'center'
        },
        {
            title: '放款时间',
            dataIndex: 'orderAmtTime',
            valueType: 'dateRange',
            hideInTable: true,
            align: 'center',
            search: {
                transform: (value: any) => ({startTime: value[0] + ' 00:00:00', endTime: value[1] + ' 23:59:59' }),
            },
        },
        {
            title: '放款额',
            dataIndex: 'orderAmt',
            search: false,
            width: 100,
            align: 'center'
        },
        {
            title: '放款时间',
            dataIndex: 'orderAmtTime',
            align: 'center',
            width: 170,
            search: false
        },
        {
            title: '发货时间',
            dataIndex: 'sendTime',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value: any) => ({sendStartTime: value[0] + ' 00:00:00', sendEndTime: value[1] + ' 23:59:59' }),
            },
            align: 'center'
        },
        {
            title: '发货时间',
            dataIndex: 'sendTime',
            width: 170,
            search: false,
            align: 'center'
        },

        {
            title: '资方合同',
            dataIndex: 'contractUrl',
            search: false,
            width: 100,
            align: 'center',
            render: (text, record, index) => (
                <>
                    {
                        record.contractUrl? (
                            <Button type="primary" onClick={() => {
                                downLoadUrl(record.contractUrl)
                            }}>下载</Button>
                        ): (
                            <span>-</span>
                        )
                    }
                </>
            ),
        },
    ];

    const downLoadUrl = (href: string) => {
        window.open(href,'_blank');
        // // 获取heads中的filename文件名
        // let downloadElement = document.createElement('a');
        // // 创建下载的链接
        // downloadElement.href = href;
        // // 下载后文件名
        // downloadElement.download = '';
        // document.body.appendChild(downloadElement);
        // // 点击下载
        // downloadElement.click();
        // // 下载完成移除元素
        // document.body.removeChild(downloadElement);
        // // 释放掉blob对象
        // window.URL.revokeObjectURL(href);
    }
    return (
        <Space direction="vertical" style={{width: '100%'}} size={10}>
            <ProCard>
                <ProTable
                    columns={columns}
                    toolBarRender={false}
                    rowKey="orderId"
                    search={{
                        defaultCollapsed: false,
                        labelWidth: 'auto',
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse()
                        ]
                    }}
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await getCapitalOrderList(params)
                        let capitalListObj = {};
                        result.capitalList.map((item: any) => {
                            capitalListObj[item.shortName] = item.shortName
                        })
                        setCapitalList(capitalListObj)
                        return {
                            total: result.count,
                            data: result.list
                        };
                    }}
                    pagination={{
                        pageSize: 15
                    }}
                    scroll={{x: 1200 }}
                />
            </ProCard>
        </Space>
    );
}
