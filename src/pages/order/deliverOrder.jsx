import { Space, Button, Table, Form, Modal, Input, Select, Alert } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {
    getAllowPushOrder,
    getCapitalListApi,
    operateCapitalMark,
    getMiniTypeListApi,
    getSendListApi,
    operateCapitalOrderApply, operateCapitalCreditQuery
} from '@/services/order'
import { getCapitalDetailApi } from '@/services/config'
import { useState, useRef, useEffect } from 'react';
import moment from 'moment'


const { Statistic, Divider } = StatisticCard;


const { Option } = Select;

const { confirm } = Modal;

export default function OrderPush() {
    const [capitalList, setCapitalList] = useState([])
    const [selectKeys, setSelectKeys] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [miniTypeList, setMiniTypeList] = useState([])
    const [dataView, setDataView] = useState({
        totalActualSupplyPrice: 0, //总采购价
        sendCount: 0, //发货单数
        rentTotalAmt: 0, //总租金
    })
    const [capitalInfo, setCapitalInfo] = useState({})
    const [form] = Form.useForm()
    const ref = useRef()

    const getCapitalList = () => {
        getCapitalListApi().then(res => {
            setCapitalList(res)
        })
    }

    const handleCancel = () => {
        // ref.current.reload()
        setShowModel(false)
        // setSelectKeys([])
        // ref.current.clearSelected()
        // form.resetFields()
    }

    const handleOk = () => {
        const values = form.getFieldsValue();
        if (!values.capitalId) {
            return
        }
        operateCapitalOrderApply({ capitalId: values.capitalId, orderIds: selectKeys }).then(res => {
            ref.current.reload()
            handleCancel()
        })
    }

    const getCapitalDetail = (value) => {
        getCapitalDetailApi({ capitalId: value }).then(res => {
            let data = res.data || {}
            setCapitalInfo(data)
        })
    }

    const getMiniTypeList = () => {
        getMiniTypeListApi().then(res => {
            setMiniTypeList(res.miniTypeList)
        })
    }

    const handleConfirm = () => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确认同步？',
            onOk() {

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const handleOperateCapitalCreditQuery = () => {
        operateCapitalCreditQuery({
            capitalId: '',
            orderIds: '',
        }).then(res => {

        })
    }

    /**
     * 同步资方结果
     */


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
        },
        // {
        //     title: '可标记资方',
        //     dataIndex: 'canFlagCapital',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: () => {
        //         let obj = {};
        //         capitalList.map(item => {
        //             obj[item.shortName] = item.shortName;
        //         })
        //         return obj
        //     }
        // },
        // {
        //     title: '资方审核状态',
        //     dataIndex: 'capitalStatus',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: {
        //         '全部': '全部',
        //         '通过': '通过',
        //         '拒绝': '拒绝',
        //         '未审核': '未审核'
        //     }
        // },
        // {
        //     title: '已标记资方',
        //     dataIndex: 'flagCapital',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: () => {
        //         let obj = {};
        //         capitalList.forEach(item => {
        //             obj[item.shortName] = item.shortName
        //         })
        //         return obj
        //     }
        // },
        // {
        //     title: '手机类型',
        //     dataIndex: 'mobileType',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: {
        //         'iphone': 'iphone',
        //         'android': 'android'
        //     },
        // },
        {
            title: '发货时间',
            dataIndex: 'signTime',
            align: 'center',
            valueType: 'dateRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ sendStartTime: value[0] + ' 00:00:00', sendEndTime: value[1] + ' 23:59:59' }),
        },
        {
            title: '订单来源',
            dataIndex: 'miniType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: () => {
                let obj = {};
                miniTypeList.forEach(item => {
                    obj[item.miniType] = item.miniTypeName
                })
                return obj
            }
        },
        // {
        //     title: '期数',
        //     dataIndex: 'term',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: {
        //         '全部': '全部',
        //         '12期': '12期',
        //         '非12期': '非12期',
        //     }
        // },
        {
            title: '已标资方',
            dataIndex: 'capitalName',
            search: false,
            width: 340,
            render: (text, record, index) => (
                <>
                    {
                        record.capitalRelations.map(item =>
                            <div key={item.capitalName} className='border-btm'>
                                <div>资方简称: {item.capitalName || '-'}</div>
                                <div>标记时间: {item.createTime || '-'}</div>
                            </div>
                        )
                    }
                </>
            ),
        },
        {
            title: '订单号',
            dataIndex: 'orderNo',
            search: false,
            width: 80,
        },
        {
            title: '放款状态',
            align: 'center',
            search: false,
            width: 100,
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
            title: '发货时间',
            dataIndex: 'sendTime',
            align: 'center',
            search: false,
            width: 150,
        },
        {
            title: '订单信息',
            dataIndex: 'capitalName',
            search: false,
            width: 400,
            render: (text, record, index) => (
                <>
                    <div>下单时间：{record.createTime || '-'}</div>
                    <div>商品简称：{record.shortName || '-'}</div>
                    <div>月租：{record.monthRepayment || '-'}</div>
                    <div>买断金：{record.buyoutAmt || '-'}</div>
                </>
            ),
        },
        {
            title: '用户信息',
            dataIndex: 'capitalName',
            search: false,
            width: 300,
            render: (text, record, index) => (
                <>
                    <div>姓名：{record.customerName}</div>
                    <div>手机号：{record.mobile}</div>
                    <div>身份证：{record.certNo}</div>
                </>
            ),
        },
        {
            title: '真实采购价',
            dataIndex: 'actualSupplyPrice',
            align: 'center',
            search: false,
            width: 160,
        },
        {
            title: '总租金',
            dataIndex: 'totalRentAmt',
            align: 'center',
            search: false,
            width: 110,
        },
    ]

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={10}>
            <ProCard>
                <ProTable
                    actionRef={ref}
                    columns={columns}
                    options={false}
                    toolBarRender={false}
                    rowKey="orderNo"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await getSendListApi(params)
                        console.log(result, 'result')
                        // let defaultKeys = []
                        // let _list = list.map(item => {
                        //     defaultKeys.push(item.order.id)
                        //     return { ...item, id: item.order.id }
                        // })
                        // setSelectKeys(defaultKeys)
                        setDataView({
                            totalActualSupplyPrice: result.totalActualSupplyPrice, //总采购价
                            sendCount: result.sendCount, //发货单数
                            rentTotalAmt: result.rentTotalAmt, //总租金
                        })
                        // let capitalId = '';
                        // capitalList.forEach(item => {
                        //     if (item.shortName === values.capitalShortName) {
                        //         capitalId = item.id
                        //     }
                        // })
                        // if (capitalId) {
                        //     getCapitalDetail(capitalId)
                        //     form.setFieldsValue({ capitalId: capitalId })
                        // }
                        return {
                            total: result.sendCount || 0,
                            data: result.list
                        };
                    }}
                    pagination={{
                        pageSize: 15
                    }}
                    scroll={{
                        x: 1300
                    }}
                    // rowSelection={{
                    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    //     defaultSelectedRowKeys: selectKeys,
                    //     selectedRowKeys: selectKeys,
                    //     onChange: (values) => {
                    //         setSelectKeys(values)
                    //     },
                    //     getCheckboxProps: record => ({
                    //         selectedRowKeys: []
                    //     })
                    // }}
                    tableAlertRender={false}
                    search={
                        {
                            defaultCollapsed: false,
                            labelWidth: 'auto',
                            optionRender: (searchConfig, formProps, dom) => [
                                ...dom.reverse()
                            ],
                        }
                    }
                    // toolBarRender={() => [
                    //     <Button key='mark' className='button-color-green' onClick={() => {
                    //
                    //     }} disabled={selectKeys.length === 0}>导出</Button>,
                    //     <Button key='mark' className='button-color-dust' onClick={() => {
                    //         handleConfirm()
                    //     }} disabled={selectKeys.length === 0}>同步资方结果</Button>,
                    //     <Button key='mark' className='button-color-sunset' onClick={() => {
                    //         setShowModel(true)
                    //     }} disabled={selectKeys.length === 0}>进件</Button>,
                    // ]}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>采购总额：{dataView.totalActualSupplyPrice || 0}</span>
                                    <span className='ml-20'>发货单数：{dataView.sendCount || 0}</span>
                                    <span className='ml-20'>总租金：{dataView.rentTotalAmt || 0}</span>
                                </>
                            }></Alert>
                        </div>
                    )}

                />
            </ProCard>
            <Modal title="选择资方" visible={showModel} onOk={handleOk} onCancel={handleCancel}>
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
                            onChange={(value) => {
                                if (value) getCapitalDetail(value)
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
                                    <div className='color-gray'>暂无数据</div>
                                )
                            }
                        </>

                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
