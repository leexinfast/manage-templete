import { Space, Button, Table, Form, Modal, Input, Select, Alert } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import {
    getWaitReportOrder,
    getCapitalListApi,
    signOperateContractApi,
    operateInsureApi,
    operateZlbReportApi,
    reportOperateCapitalApi,
    removeOperateCapitalApi
} from '@/services/order'
import { getCapitalDetailApi } from '@/services/config'
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const { Option } = Select;

const reportStatusList = {
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
    500: '已通过'
}
// 0=初始 50=开户 100=授信 150=授信成功 200=授信失败 250=合同签署 300=待用户合同签署 350=待上报/合同签署成功 400=待资方审核/用信申请 450=已拒绝/用信失败 500=已通过

export default function OrderPush() {
    const [capitalList, setCapitalList] = useState([])
    const [selectKeys, setSelectKeys] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [showInsure, setShowInsure] = useState(false)
    const [capitalInfo, setCapitalInfo] = useState({})
    const [errMsg, setErrMsg] = useState(null)
    const [dataView, setDataView] = useState({
        waitReportAmt: 0,
        waitReportCount: 0
    })
    const [form] = Form.useForm();
    const ref = useRef()

    const getCapitalList = () => {
        getCapitalListApi().then(res => {
            let capitalId = 10000002
            form.setFieldsValue({ capitalId })
            getCapitalDetail(capitalId)
            setCapitalList(res)
        })
    }

    const signOperateContract = () => {
        let selectRowKeys = getSelectKeys()
        let orderIds = selectRowKeys.map(item => {
            return item.orderId
        })
        signOperateContractApi({ orderIds }).then(res => {
            handleResult(res)
        })
    }

    const operateZlbReport = () => {
        let selectRowKeys = getSelectKeys()
        let orderIds = selectRowKeys.map(item => {
            return item.orderId
        })
        operateZlbReportApi({
            orderIds: orderIds,
            oneStep: 1
        }).then(res => {
            handleResult(res)
            handleCancel()
        })
    }

    const handleCancel = () => {
        ref.current.reload();
        setShowModel(false)
        setShowInsure(false)
        setSelectKeys([])
        ref.current.clearSelected();
        form.resetFields()
    }

    const operateInsure = () => {
        let selectRowKeys = getSelectKeys()
        let orderIds = selectRowKeys.map(item => {
            return item.orderId
        })
        operateInsureApi({ orderIds: orderIds, capitalId: capitalInfo.capitalId }).then(res => {
            handleResult(res)
            handleCancel()
        })
    }

    const reportOperateCapital = () => {
        let selectRowKeys = getSelectKeys()
        let orderIds = selectRowKeys.map(item => {
            return item.orderId
        })
        reportOperateCapitalApi({ orderIds: orderIds, capitalId: capitalInfo.capitalId }).then(res => {
            handleResult(res)
            handleCancel()
        })
    }

    const getSelectKeys = () => {
        let orderIds = selectKeys.map(item => {
            let arr = item.split('-');
            return { capitalId: arr[1], orderId: arr[0] }
        });
        return orderIds
    }

    const handleResult = (res) => {
        if (res.success) {
            setSelectKeys([])
            ref.current.clearSelected();
            setTimeout(() => {
                ref.current.reload()
            }, 500)
        }
    }
    const removeReport = () => {
        let orderIds = getSelectKeys();
        removeOperateCapitalApi(orderIds).then(res => {
            handleResult(res)
        })
    }

    const handleOk = () => {
        const values = form.getFieldsValue();
        if (!values.capitalId) {
            return
        }
        if (showInsure) {
            operateInsure()
        } else {
            reportOperateCapital()
        }
    }

    const getCapitalDetail = (value) => {
        getCapitalDetailApi({ capitalId: value }).then(res => {
            let data = res.data || {};
            setCapitalInfo(data)
        })
    }

    const downLoadUrl = (href) => {
        // 获取heads中的filename文件名
        let downloadElement = document.createElement('a');
        // 创建下载的链接
        downloadElement.href = href;
        // 下载后文件名
        downloadElement.download = '';
        document.body.appendChild(downloadElement);
        // 点击下载
        downloadElement.click();
        // 下载完成移除元素
        document.body.removeChild(downloadElement);
        // 释放掉blob对象
        window.URL.revokeObjectURL(href);
    }


    useEffect(() => {
        getCapitalList()
    }, [])

    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderNo',
            hideInTable: true,
        },
        {
            title: '姓名',
            dataIndex: 'customerName',
            hideInTable: true,
        },
        {
            title: '下单时间',
            dataIndex: 'createTime',
            hideInTable: true,
            valueType: 'dateRange',
            search: {
                transform: (value) => ({
                    createStartTime: value[0] + ' 00:00:00',
                    createEndTime: value[1] + ' 00:00:00'
                }),
            },
        },
        {
            title: '上报状态',
            dataIndex: 'reportStatus',
            valueEnum: reportStatusList,
            valueType: 'select',
            width: 80,
            fieldProps: {
                showSearch: true
            },
            render: (text, record, index) => (
                <>
                    {
                        record.capitalFlag && (
                            <div>{reportStatusList[record.capitalFlag.reportStatus]}</div>
                        )
                    }
                </>
            ),
        },
        {
            title: '资方简称',
            dataIndex: 'capitalShortName',
            hideInTable: true,
            valueType: 'select',
            initialValue: '甜橙',
            fieldProps: {
                showSearch: true
            },
            valueEnum: () => {
                let obj = {};
                capitalList.forEach(item => {
                    obj[item.shortName] = item.shortName
                })
                return obj
            }
        },
        {
            title: '手机号',
            dataIndex: 'customerMobile',
            hideInTable: true,
        },
        {
            title: '租赁宝是否上报',
            dataIndex: 'zlbReportStatus',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                10: '未上报',
                20: '已上报',
            }
        },
        {
            title: '投保状态',
            dataIndex: 'insureStatus',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                10: '未投保',
                20: '已投保',
            }
        }, {
            title: '标记时间',
            dataIndex: 'markTime',
            align: 'center',
            valueType: 'dateRange',
            hideInTable: true,
            transform: (value) => ({ markStartTime: value[0] + ' 00:00:00', markEndTime: value[1] + ' 00:00:00' }),
        },
        {
            title: '已报资方',
            dataIndex: 'orderNo',
            search: false,
            width: 250,
            render: (text, record, index) => (
                <>
                    <div>资方简称：{record.capitalFlag && record.capitalFlag.capitalShortName}</div>
                    <div>标记时间：{record.capitalFlag && record.capitalFlag.flagTime}</div>
                </>
            ),
        },
        {
            title: '订单号',
            dataIndex: 'orderNo',
            width: 100,
            search: false,
            render: (text, record, index) => (
                <>
                    <span>{record.order.no}</span>
                </>
            ),
        },
        {
            title: '订单信息',
            dataIndex: 'orderNo',
            width: 300,
            search: false,
            render: (text, record, index) => (
                <>
                    <div>下单时间：{record.order && record.order.createTime}</div>
                    <div>商品简称：{record.item && record.item.shortName}</div>
                    <div>月租：{record.orderFinance && record.orderFinance.monthRepayment}</div>
                    <div>买断金：{record.orderFinance && record.orderFinance.buyoutAmt}</div>
                </>
            ),
        },
        {
            title: '用户信息',
            dataIndex: 'orderNo',
            search: false,
            width: 240,
            render: (text, record, index) => (
                <>
                    {
                        record.customer && (
                            <>
                                <div>姓名：{record.customer.realName}</div>
                                <div>手机号：{record.customer.mobile}</div>
                                <div>身份证：{record.customer.idCardNo}</div>
                            </>
                        )
                    }
                </>
            ),
        },
        {
            title: '商品名称',
            dataIndex: 'orderNo',
            width: 250,
            search: false,
            render: (text, record, index) => (
                <>
                    <div>{record.item && record.item.name}</div>
                </>
            ),
        },
        {
            title: '上报资方采购价',
            dataIndex: 'reportCapitalPurchasePrice',
            search: false,
            align: 'center',
            width: 120
        },
        {
            title: '合同',
            dataIndex: 'orderNo',
            search: false,
            align: 'center',
            width: 100,
            render: (text, record, index) => (
                <>
                    <div>
                        {
                            record.contracts && record.contracts.length > 0? (
                                record.contracts.map(item => {
                                    return (
                                        <div>
                                            <a href={item.url} download="">{item.name}</a>
                                        </div>
                                    )
                                })
                            ): (
                                <span>-</span>
                            )
                        }
                    </div>
                </>
            ),
        },
        {
            title: '租赁宝上报',
            dataIndex: 'reportTwcStatus',
            search: false,
            align: 'center',
            width: 100,
            render: (text, record, index) => (
                <>
                    <div>{text === 10 ? '未上报' : '已上报'}</div>
                </>
            ),
        }, {
            title: '保单号',
            dataIndex: 'policyNo',
            search: false,
            align: 'center',
            width: 100,
        }, {
            title: '错误信息',
            dataIndex: 'errMsg',
            search: false,
            align: 'center',
            width: 100,
            render: (text, record, index) => (
                <>
                    {
                        record.errMsg? (
                            <Button type="primary" onClick={() => { setErrMsg(record.errMsg) }}>查看</Button>
                        ): (
                            <span>-</span>
                        )
                    }
                </>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={10}>

            <ProCard>
                <ProTable
                    actionRef={ref}
                    columns={columns}
                    options={false}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>待报总额：</span>
                                    <span>{dataView.waitReportAmt ? dataView.waitReportAmt.toFixed(2) : 0}</span>
                                    <span style={{ marginLeft: '20px' }}>待报总单数：</span>
                                    <span>{dataView.waitReportCount || 0}</span>
                                </>
                            }>
                            </Alert>
                        </div>
                    )}
                    toolBarRender={() => [
                        <Button key="sign" disabled={selectKeys.length === 0} onClick={() => {
                            signOperateContract()
                        }} type="primary">签署合同</Button>,
                        <Button key="report" disabled={selectKeys.length === 0} onClick={() => {
                            operateZlbReport()
                        }} type="primary">报租赁宝</Button>,
                        <Button key="insure" disabled={selectKeys.length === 0} onClick={() => {
                            setShowInsure(true)
                        }} type="primary">投保</Button>,
                        <Button key="capital" disabled={selectKeys.length === 0} onClick={() => {
                            setShowModel(true)
                        }} type="primary">上报资方</Button>,
                        <Button key="remove" disabled={selectKeys.length === 0} onClick={() => {
                            removeReport()
                        }} type="primary">移除</Button>,
                    ]
                    }
                    rowKey="id"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await getWaitReportOrder(params)
                        let list = [];
                        let _list = [];
                        if (result) {
                            list = result.list || []
                            let defaultKeys = []
                            _list = list.map(item => {
                                let capitalId = item.capitalFlag && item.capitalFlag.capitalId
                                if (!item.order) {
                                    item.order = {}
                                }
                                let id = `${item.order.id}-${capitalId}`
                                defaultKeys.push(id)
                                return { ...item, id: id }
                            })
                            let capitalId = '';
                            capitalList.forEach(item => {
                                if (item.shortName === values.capitalShortName) {
                                    capitalId = item.id
                                }
                            })
                            if (capitalId) {
                                getCapitalDetail(capitalId)
                                form.setFieldsValue({ capitalId: capitalId })
                            }
                            setSelectKeys(defaultKeys)
                            setDataView(result.dataView || {})
                        }
                        return {
                            total: result?.total || 0,
                            data: _list || []
                        };
                    }}
                    pagination={{
                        pageSize: 15
                    }}
                    scroll={{ x: 1300 }}
                    tableAlertRender={false}
                    rowSelection={{
                        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                        // 注释该行则默认不显示下拉选项
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        selectedRowKeys: selectKeys,
                        onChange: (values) => {
                            setSelectKeys(values)
                        },
                        getCheckboxProps: record => ({
                            selectedRowKeys: []
                        })
                    }}
                    search={{
                        defaultCollapsed: false,
                        labelWidth: 'auto',
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse(),
                        ],
                    }}
                />
            </ProCard>
            {/* 标记资方 */}
            <Modal title={showModel ? '上报资方' : showInsure ? '投保' : ''} visible={showModel || showInsure} onOk={handleOk}
                   onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="资方"
                        name="capitalId"
                        rules={[{ required: true, message: '请选择资方' }]}
                    >
                        <Select
                            showSearch
                            placeholder="选择资方"
                            onChange={(value) => {
                                getCapitalDetail(value)
                            }}
                        >
                            {
                                capitalList.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.shortName}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="资方要求"
                        name="capitalId"
                        rules={[{ required: true, message: '请选择资方' }]}
                    >
                        {
                            capitalInfo.capitalRequirement && (
                                <>
                                    <div>是否需要人脸: {capitalInfo.capitalRequirement.isFaceAuthRequired ? '是' : '否'}</div>
                                    <div>年龄范围: {capitalInfo.capitalRequirement.maxAge}-{capitalInfo.capitalRequirement.minAge}</div>
                                    <div>手机类型: {capitalInfo.capitalRequirement.mobileType}</div>
                                    <div>商品采购价{capitalInfo.capitalRequirement.purchaseCompareOfficialPrice === 1 ? '大于' : '小于等于'}官网价</div>
                                </>
                            )
                        }

                    </Form.Item>
                </Form>
            </Modal>
            <Modal title='错误信息' visible={errMsg ? true : false} onOk={() => {
                setErrMsg('')
            }} onCancel={() => {
                setErrMsg('')
            }}>
                <span>{errMsg}</span>
            </Modal>
        </Space>
    );
}
