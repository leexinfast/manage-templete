import { Space, Button, Table, Form, Modal, Input, Select, Alert } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import {
    getAllowPushOrder,
    getCapitalListApi,
    operateCapitalMark,
    getMiniTypeListApi,
    getSendListApi,
    operateCapitalOrderApply, operateCapitalCreditQuery, compensatoryList
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

    const handleToFunds = (orderNo) => {
        console.log(orderNo)
        history.push({ pathname : '/finance/finance-funds' , query : { orderNo : orderNo }})
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
            dataIndex: 'mobile',
            hideInTable: true,
        },
        {
            title: '资方简称',
            dataIndex: 'capitalId',
            hideInTable: true,
            valueType: 'select',
            valueEnum: () => {
                let obj = {};
                capitalList.map(item => {
                    obj[item.id] = item.shortName;
                })
                return obj
            }
        },
        {
            title: '还款方式',
            dataIndex: 'repayType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                1: '主动支付',
                2: '冻结代扣',
                3: '红包',
                4: '区块链',
                5: '商户代扣',
                6: '直付通提前还款',
            }
            // 1-主动支付 2-冻结代扣  4-区块链代扣  5-商户代扣 "
        },
        {
            title: '还款时间',
            align: 'center',
            dataIndex: 'repayDate',
            valueType: 'dateRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ repayStartTime: value[0] + ' 00:00:00', repayEndTime: value[1] + ' 23:59:59' }),
        },
        {
            title: '代偿时间',
            align: 'center',
            dataIndex: 'compensatoryTime',
            valueType: 'dateRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ compensatoryStartTime: value[0] + ' 00:00:00', compensatoryEndTime: value[1] + ' 23:59:59' }),
        },
        {
            title: '还款状态',
            dataIndex: 'repayStatus',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                5: '已还',
                1: '未还',
            }
        },
        /**
         * table-columns
         */
        {
            title: '订单编号',
            search: false,
            dataIndex: 'orderNo',
            width: 100,
            render: (text, record, index) => (
                <>
                    <span className='line-hover' onClick={() => {handleToFunds(record.orderNo)}}>{record.orderNo}</span>
                </>
            )
        },
        {
            title: '代偿时间',
            search: false,
            dataIndex: 'compensatoryTime',
            width: 220,
        },
        {
            title: '期数',
            align: 'center',
            search: false,
            dataIndex: 'term',
            width: 80,
        },
        {
            title: '资方简称',
            dataIndex: 'capitalName',
            align: 'center',
            search: false,
            width: 120,
        },
        {
            title: '用户信息',
            search: false,
            width: 250,
            render: (text, record, index) => (
                <>
                    {
                        record && (
                            <>
                                <div>姓名：{record.customerName || '-'}</div>
                                <div>手机号：{record.mobile || '-'}</div>
                            </>
                        )
                    }
                </>
            ),
        },
        {
            title: '商品名称',
            align: 'center',
            dataIndex: 'shortName',
            search: false,
            width: 180,
        },
        {
            title: '上报金额',
            dataIndex: 'actualSupplyPrice',
            align: 'center',
            search: false,
            width: 200,
        },
        {
            title: '代偿金额',
            dataIndex: 'compensatoryAmt',
            align: 'center',
            search: false,
            width: 100,
        },
        {
            title: '还款时间',
            dataIndex: 'repayDate',
            search: false,
            width: 220,
        },
        {
            title: '还款方式',
            align: 'center',
            search: false,
            width: 120,
            render: (text, record, index) => {
                // 1-主动支付 2-冻结代扣  4-区块链代扣  5-商户代扣 "
                // ALIPAY_PAY_TYPE_PAY(1, "支付"), ALIPAY_PAY_TYPE_FREEZE(2, "冻结代扣"), ALIPAY_PAY_TYPE_RED_PACKET(3, "红包"),
                //     ALIPAY_PAY_TYPE_QKL(4, "区块链"), ALIPAY_PAY_TYPE_MCH(5, "商户代扣"), ALIPAY_PAY_TYPE_MCH_ADVANCE(6, "直付通提前还款"),
                let obj = {
                    1: '主动支付',
                    2: '冻结代扣',
                    3: '红包',
                    4: '区块链',
                    5: '商户代扣',
                    6: '直付通提前还款',
                }
                return (
                    <span>{obj[record.repayType]}</span>
                )
            }
        },
        {
            title: '代偿后还款金额',
            dataIndex: 'afterCompensatoryRepayAmt',
            align: 'center',
            search: false,
            width: 180,
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
                    pagination={{
                        pageSize: 15
                    }}
                    rowKey="id"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await compensatoryList(params)
                        setDataView({
                            compensatoryTotalAmt: result.compensatoryTotalAmt,
                            afterCompensatoryCount: result.afterCompensatoryCount,
                            afterCompensatoryRepayTotalAmt: result.afterCompensatoryRepayTotalAmt,
                            repayTotalAmt: result.repayTotalAmt,
                        })
                        console.log(result, 'result')
                        // let defaultKeys = []
                        // result.map((item, index) => {
                        //     defaultKeys.push(item.id)
                        // })
                        return {
                            data: result.list,
                            total: result.count,
                            success: true
                        };
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
                                    <span>代偿总额：{dataView.compensatoryTotalAmt || 0}</span>
                                    <span className='ml-20'>代偿后还款订单数量：{dataView.afterCompensatoryCount || 0}</span>
                                    <span className='ml-20'>代偿后还款总额：{dataView.afterCompensatoryRepayTotalAmt || 0}</span>
                                    <span className='ml-20'>用户还款总额：{dataView.repayTotalAmt || 0}</span>
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
                                capitalList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={index}>{item.shortName}</Option>
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
