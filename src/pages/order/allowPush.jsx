import { Space, Button, Table, Form, Modal, Input, Select, Alert, message } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getAllowPushOrder, getCapitalListApi, operateCapitalMark, getMiniTypeListApi } from '@/services/order'
import { getCapitalDetailApi } from '@/services/config'
import { useState, useRef, useEffect } from 'react';
import moment from 'moment'


const { Statistic, Divider } = StatisticCard;


const { Option } = Select;

export default function OrderPush() {
    const [capitalList, setCapitalList] = useState([])
    const [selectKeys, setSelectKeys] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [miniTypeList, setMiniTypeList] = useState([])
    const [dataView, setDataView] = useState({
        allowPushAmt: 0,
        allowPushCount: 0,
        totalRentAmt: 0,
        waitReportAmt: 0,
        waitReportCount: 0
    })
    const [capitalInfo, setCapitalInfo] = useState({})
    const [form] = Form.useForm();
    const ref = useRef()

    const getCapitalList = () => {
        getCapitalListApi().then(res => {
            setCapitalList(res)
        })
    }

    const handleCancel = () => {
        // ref.current.reload();
        setShowModel(false)
        // setSelectKeys([])
        // ref.current.clearSelected();
        form.resetFields()
    }

    const handleOk = () => {
        const values = form.getFieldsValue();
        if (!values.capitalId) {
            return
        }
        operateCapitalMark({ capitalId: values.capitalId, orderIds: selectKeys }).then(res => {
            message.success('提交成功');
            ref.current.reload();
            handleCancel()
        })
    }

    const getCapitalDetail = (value) => {
        getCapitalDetailApi({ capitalId: value }).then(res => {
            let data = res.data || {};
            setCapitalInfo(data)
        })
    }

    const getMiniTypeList = () => {
        getMiniTypeListApi().then(res => {
            setMiniTypeList(res.miniTypeList)
        })
    }

    useEffect(() => {
        getCapitalList()
        getMiniTypeList()
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
            title: '手机号',
            dataIndex: 'customerMobile',
            hideInTable: true,
        }, {
            title: '手机类型',
            dataIndex: 'mobileType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                'iphone': 'iphone',
                'android': 'android'
            },
        }, {
            title: '已标记资方',
            dataIndex: 'flagCapital',
            hideInTable: true,
            fieldProps: {
                showSearch: true
            },
            valueType: 'select',
            valueEnum: () => {
                let obj = {};
                capitalList.forEach(item => {
                    obj[item.shortName] = item.shortName
                })
                return obj
            }
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
        // mobileType
        {
            title: '标记资方',
            dataIndex: 'capitalName',
            search: false,
            width: 160,
            render: (text, record, index) => (
                <>
                    <div>资方简称：{record.capitalFlag && record.capitalFlag.capitalShortName || '-'}</div>
                    <div>标记时间：{record.capitalFlag && record.capitalFlag.flagTime || '-'}</div>
                </>
            ),
        }, {
            title: '订单号',
            width: 80,
            search: false,
            render: (text, record, index) => (
                <>
                    <span>{record.order.no}</span>
                </>
            ),
        }, {
            title: '放款状态',
            dataIndex: 'capitalIsAmt',
            align: 'center',
            search: false,
            width: 90,
            render: (text, record, index) => (
                <>
                    {
                        record.capitalFlag ? (
                            <span>{record.capitalFlag.capitalIsAmt ? '已放款' : '未放款'}</span>
                        ) : (
                            <span>未放款</span>
                        )
                    }

                </>
            ),
        },

        {
            title: '订单信息',
            dataIndex: 'capitalName',
            search: false,
            width: 300,
            render: (text, record, index) => (
                <>
                    <div>下单时间：{record.order.createTime}</div>
                    <div>商品简称：{record.item.shortName}</div>
                    <div>月租：{record.orderFinance && record.orderFinance.monthRepayment}</div>
                    <div>买断金：{record.orderFinance && record.orderFinance.buyoutAmt}</div>
                </>
            ),
        }, {
            title: '用户信息',
            dataIndex: 'capitalName',
            search: false,
            width: 160,
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
        }, {
            title: '上报资方采购价',
            dataIndex: 'reportCapitalPurchasePrice',
            align: 'center',
            search: false,
            width: 100,
        },
        {
            title: '签收时间',
            dataIndex: 'signTime',
            align: 'center',
            search: false,
            width: 100
            // valueType: 'dateTimeRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),  moment().format('YYYY-MM-DD HH:mm:ss')],

        }, {
            title: '签收时间',
            dataIndex: 'signTime',
            align: 'center',
            valueType: 'dateRange',
            initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
            hideInTable: true,
            transform: (value) => ({ signedStartTime: value[0] + ' 00:00:00', signedEndTime: value[1] + ' 00:00:00' }),
        },
        {
            title: '标记时间',
            dataIndex: 'markTime',
            align: 'center',
            valueType: 'dateRange',
            hideInTable: true,
            transform: (value) => ({ markStartTime: value[0] + ' 00:00:00', markEndTime: value[1] + ' 00:00:00' }),
        },
        {
            title: '订单来源',
            dataIndex: 'miniType',
            hideInTable: true,
            valueType: 'select',
            fieldProps: {
                showSearch: true
            },
            valueEnum: () => {
                let obj = {};
                miniTypeList.forEach(item => {
                    obj[item.miniType] = item.miniTypeName
                })
                return obj
            }
        },

    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={10}>
            <ProCard>
                <ProTable
                    actionRef={ref}
                    columns={columns}
                    options={false}
                    toolBarRender={false}
                    rowKey="id"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await getAllowPushOrder(params)
                        let list = result.list || []
                        let defaulyKeys = []
                        let _list = list.map(item => {
                            defaulyKeys.push(item.order.id)
                            return { ...item, id: item.order.id }
                        })
                        setSelectKeys(defaulyKeys)
                        setDataView(result.dataView || {})
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
                        return {
                            total: result.total || 0,
                            data: _list
                        }
                    }}
                    pagination={{
                        pageSize: 15
                    }}
                    search={{
                        labelWidth: 'auto'
                    }}
                    scroll={{ x: 1300 }}
                    rowSelection={{
                        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                        // 注释该行则默认不显示下拉选项
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        defaultSelectedRowKeys: selectKeys,
                        selectedRowKeys: selectKeys,
                        onChange: (values) => {
                            setSelectKeys(values)
                        },
                        getCheckboxProps: record => ({
                            selectedRowKeys: []
                        })
                    }}
                    tableAlertRender={false}
                    search={{
                        defaultCollapsed: false,
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse()
                        ]
                    }}
                    toolBarRender={() => [
                        <Button key='mark' type="primary" onClick={() => {
                            setShowModel(true)
                        }} disabled={selectKeys.length === 0}>标记资方</Button>,
                    ]}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>可推总额：</span>
                                    <span>{dataView.allowPushAmt ? dataView.allowPushAmt.toFixed(2) : 0}</span>
                                    <span style={{ marginLeft: '20px' }}>推送总单数：</span>
                                    <span>{dataView.allowPushCount || 0}</span>
                                    <span style={{ marginLeft: '20px' }}>总租金：</span>
                                    <span>{dataView.totalRentAmt ? dataView.totalRentAmt.toFixed(2) : 0}</span>
                                </>
                            }></Alert>
                        </div>
                    )}
                />
            </ProCard>
            <Modal title="标记资方" visible={showModel} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
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
                            allowClear={true}
                            key='id'
                            optionFilterProp="children"
                            onChange={(value) => {
                                if (value) getCapitalDetail(value)
                            }}
                        >
                            {
                                capitalList.map(item => {
                                    return (
                                        <Option value={item.id} key={item.shortName}>{item.shortName}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="资方要求"
                        name="capitalId"
                        rules={[{ required: false, message: '请选择资方' }]}
                    >
                        <>
                            {
                                capitalInfo.capitalRequirement? (
                                    <>
                                        <div>是否需要人脸: {capitalInfo.capitalRequirement.isFaceAuthRequired ? '是' : '否'}</div>
                                        <div>年龄范围: {capitalInfo.capitalRequirement.maxAge}-{capitalInfo.capitalRequirement.minAge}</div>
                                        <div>手机类型: {capitalInfo.capitalRequirement.mobileType}</div>
                                        <div>商品采购价{capitalInfo.capitalRequirement.purchaseCompareOfficialPrice === 1 ? '大于' : '小于等于'}官网价</div>
                                    </>
                                ): (
                                    <span>-</span>
                                )
                            }
                        </>

                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    )
}
