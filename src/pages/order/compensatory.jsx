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
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '???????????????',
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
     * ??????????????????
     */


    useEffect(() => {
        getCapitalList()
        getMiniTypeList()
    }, [])

    const columns = [
        {
            title: '?????????',
            dataIndex: 'orderNo',
            hideInTable: true,
        },
        {
            title: '??????',
            dataIndex: 'customerName',
            hideInTable: true,
        },
        {
            title: '?????????',
            dataIndex: 'mobile',
            hideInTable: true,
        },
        {
            title: '????????????',
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
            title: '????????????',
            dataIndex: 'repayType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                1: '????????????',
                2: '????????????',
                3: '??????',
                4: '?????????',
                5: '????????????',
                6: '?????????????????????',
            }
            // 1-???????????? 2-????????????  4-???????????????  5-???????????? "
        },
        {
            title: '????????????',
            align: 'center',
            dataIndex: 'repayDate',
            valueType: 'dateRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ repayStartTime: value[0] + ' 00:00:00', repayEndTime: value[1] + ' 23:59:59' }),
        },
        {
            title: '????????????',
            align: 'center',
            dataIndex: 'compensatoryTime',
            valueType: 'dateRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ compensatoryStartTime: value[0] + ' 00:00:00', compensatoryEndTime: value[1] + ' 23:59:59' }),
        },
        {
            title: '????????????',
            dataIndex: 'repayStatus',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                5: '??????',
                1: '??????',
            }
        },
        /**
         * table-columns
         */
        {
            title: '????????????',
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
            title: '????????????',
            search: false,
            dataIndex: 'compensatoryTime',
            width: 220,
        },
        {
            title: '??????',
            align: 'center',
            search: false,
            dataIndex: 'term',
            width: 80,
        },
        {
            title: '????????????',
            dataIndex: 'capitalName',
            align: 'center',
            search: false,
            width: 120,
        },
        {
            title: '????????????',
            search: false,
            width: 250,
            render: (text, record, index) => (
                <>
                    {
                        record && (
                            <>
                                <div>?????????{record.customerName || '-'}</div>
                                <div>????????????{record.mobile || '-'}</div>
                            </>
                        )
                    }
                </>
            ),
        },
        {
            title: '????????????',
            align: 'center',
            dataIndex: 'shortName',
            search: false,
            width: 180,
        },
        {
            title: '????????????',
            dataIndex: 'actualSupplyPrice',
            align: 'center',
            search: false,
            width: 200,
        },
        {
            title: '????????????',
            dataIndex: 'compensatoryAmt',
            align: 'center',
            search: false,
            width: 100,
        },
        {
            title: '????????????',
            dataIndex: 'repayDate',
            search: false,
            width: 220,
        },
        {
            title: '????????????',
            align: 'center',
            search: false,
            width: 120,
            render: (text, record, index) => {
                // 1-???????????? 2-????????????  4-???????????????  5-???????????? "
                // ALIPAY_PAY_TYPE_PAY(1, "??????"), ALIPAY_PAY_TYPE_FREEZE(2, "????????????"), ALIPAY_PAY_TYPE_RED_PACKET(3, "??????"),
                //     ALIPAY_PAY_TYPE_QKL(4, "?????????"), ALIPAY_PAY_TYPE_MCH(5, "????????????"), ALIPAY_PAY_TYPE_MCH_ADVANCE(6, "?????????????????????"),
                let obj = {
                    1: '????????????',
                    2: '????????????',
                    3: '??????',
                    4: '?????????',
                    5: '????????????',
                    6: '?????????????????????',
                }
                return (
                    <span>{obj[record.repayType]}</span>
                )
            }
        },
        {
            title: '?????????????????????',
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
                    //     }} disabled={selectKeys.length === 0}>??????</Button>,
                    //     <Button key='mark' className='button-color-dust' onClick={() => {
                    //         handleConfirm()
                    //     }} disabled={selectKeys.length === 0}>??????????????????</Button>,
                    //     <Button key='mark' className='button-color-sunset' onClick={() => {
                    //         setShowModel(true)
                    //     }} disabled={selectKeys.length === 0}>??????</Button>,
                    // ]}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>???????????????{dataView.compensatoryTotalAmt || 0}</span>
                                    <span className='ml-20'>??????????????????????????????{dataView.afterCompensatoryCount || 0}</span>
                                    <span className='ml-20'>????????????????????????{dataView.afterCompensatoryRepayTotalAmt || 0}</span>
                                    <span className='ml-20'>?????????????????????{dataView.repayTotalAmt || 0}</span>
                                </>
                            }></Alert>
                        </div>
                    )}
                />
            </ProCard>
            <Modal title="????????????" visible={showModel} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="??????"
                        name="capitalId"
                        rules={[{ required: true, message: '???????????????' }]}
                    >
                        <Select
                            showSearch
                            placeholder="????????????"
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
                        label="????????????"
                        name="capitalId"
                    >
                        <>
                            {
                                capitalInfo.capitalRequirement? (
                                        <>
                                            <div>??????????????????: {capitalInfo.capitalRequirement.isFaceAuthRequired ? '???' : '???'}</div>
                                            <div>????????????: {capitalInfo.capitalRequirement.maxAge}-{capitalInfo.capitalRequirement.minAge}</div>
                                            <div>????????????: {capitalInfo.capitalRequirement.mobileType}</div>
                                            <div>???????????????{capitalInfo.capitalRequirement.purchaseCompareOfficialPrice === 1 ? '??????' : '????????????'}?????????</div>
                                        </>
                                ): (
                                    <div className='color-gray'>????????????</div>
                                )
                            }
                        </>

                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
