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
            message.success('ζδΊ€ζε');
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
            title: 'θ?’εε·',
            dataIndex: 'orderNo',
            hideInTable: true,
        },
        {
            title: 'ε§ε',
            dataIndex: 'customerName',
            hideInTable: true,
        },
        {
            title: 'ζζΊε·',
            dataIndex: 'customerMobile',
            hideInTable: true,
        }, {
            title: 'ζζΊη±»ε',
            dataIndex: 'mobileType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                'iphone': 'iphone',
                'android': 'android'
            },
        }, {
            title: 'ε·²ζ θ?°θ΅ζΉ',
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
            title: 'θ΅ζΉη?η§°',
            dataIndex: 'capitalShortName',
            hideInTable: true,
            valueType: 'select',
            initialValue: 'ηζ©',
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
            title: 'ζ θ?°θ΅ζΉ',
            dataIndex: 'capitalName',
            search: false,
            width: 160,
            render: (text, record, index) => (
                <>
                    <div>θ΅ζΉη?η§°οΌ{record.capitalFlag && record.capitalFlag.capitalShortName || '-'}</div>
                    <div>ζ θ?°ζΆι΄οΌ{record.capitalFlag && record.capitalFlag.flagTime || '-'}</div>
                </>
            ),
        }, {
            title: 'θ?’εε·',
            width: 80,
            search: false,
            render: (text, record, index) => (
                <>
                    <span>{record.order.no}</span>
                </>
            ),
        }, {
            title: 'ζΎζ¬ΎηΆζ',
            dataIndex: 'capitalIsAmt',
            align: 'center',
            search: false,
            width: 90,
            render: (text, record, index) => (
                <>
                    {
                        record.capitalFlag ? (
                            <span>{record.capitalFlag.capitalIsAmt ? 'ε·²ζΎζ¬Ύ' : 'ζͺζΎζ¬Ύ'}</span>
                        ) : (
                            <span>ζͺζΎζ¬Ύ</span>
                        )
                    }

                </>
            ),
        },

        {
            title: 'θ?’εδΏ‘ζ―',
            dataIndex: 'capitalName',
            search: false,
            width: 300,
            render: (text, record, index) => (
                <>
                    <div>δΈεζΆι΄οΌ{record.order.createTime}</div>
                    <div>εεη?η§°οΌ{record.item.shortName}</div>
                    <div>ζη§οΌ{record.orderFinance && record.orderFinance.monthRepayment}</div>
                    <div>δΉ°ζ­ιοΌ{record.orderFinance && record.orderFinance.buyoutAmt}</div>
                </>
            ),
        }, {
            title: 'η¨ζ·δΏ‘ζ―',
            dataIndex: 'capitalName',
            search: false,
            width: 160,
            render: (text, record, index) => (
                <>
                    {
                        record.customer && (
                            <>
                                <div>ε§εοΌ{record.customer.realName}</div>
                                <div>ζζΊε·οΌ{record.customer.mobile}</div>
                                <div>θΊ«δ»½θ―οΌ{record.customer.idCardNo}</div>
                            </>
                        )
                    }
                </>
            ),
        }, {
            title: 'δΈζ₯θ΅ζΉιθ΄­δ»·',
            dataIndex: 'reportCapitalPurchasePrice',
            align: 'center',
            search: false,
            width: 100,
        },
        {
            title: 'η­ΎζΆζΆι΄',
            dataIndex: 'signTime',
            align: 'center',
            search: false,
            width: 100
            // valueType: 'dateTimeRange',
            // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),  moment().format('YYYY-MM-DD HH:mm:ss')],

        }, {
            title: 'η­ΎζΆζΆι΄',
            dataIndex: 'signTime',
            align: 'center',
            valueType: 'dateRange',
            initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
            hideInTable: true,
            transform: (value) => ({ signedStartTime: value[0] + ' 00:00:00', signedEndTime: value[1] + ' 00:00:00' }),
        },
        {
            title: 'ζ θ?°ζΆι΄',
            dataIndex: 'markTime',
            align: 'center',
            valueType: 'dateRange',
            hideInTable: true,
            transform: (value) => ({ markStartTime: value[0] + ' 00:00:00', markEndTime: value[1] + ' 00:00:00' }),
        },
        {
            title: 'θ?’εζ₯ζΊ',
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
                        // θͺε?δΉιζ©ι‘Ήεθ: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                        // ζ³¨ιθ―₯θ‘ει»θ?€δΈζΎη€ΊδΈζιι‘Ή
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
                        }} disabled={selectKeys.length === 0}>ζ θ?°θ΅ζΉ</Button>,
                    ]}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>ε―ζ¨ζ»ι’οΌ</span>
                                    <span>{dataView.allowPushAmt ? dataView.allowPushAmt.toFixed(2) : 0}</span>
                                    <span style={{ marginLeft: '20px' }}>ζ¨ιζ»εζ°οΌ</span>
                                    <span>{dataView.allowPushCount || 0}</span>
                                    <span style={{ marginLeft: '20px' }}>ζ»η§ιοΌ</span>
                                    <span>{dataView.totalRentAmt ? dataView.totalRentAmt.toFixed(2) : 0}</span>
                                </>
                            }></Alert>
                        </div>
                    )}
                />
            </ProCard>
            <Modal title="ζ θ?°θ΅ζΉ" visible={showModel} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="θ΅ζΉ"
                        name="capitalId"
                        rules={[{ required: true, message: 'θ―·ιζ©θ΅ζΉ' }]}
                    >
                        <Select
                            showSearch
                            placeholder="ιζ©θ΅ζΉ"
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
                        label="θ΅ζΉθ¦ζ±"
                        name="capitalId"
                        rules={[{ required: false, message: 'θ―·ιζ©θ΅ζΉ' }]}
                    >
                        <>
                            {
                                capitalInfo.capitalRequirement? (
                                    <>
                                        <div>ζ―ε¦ιθ¦δΊΊθΈ: {capitalInfo.capitalRequirement.isFaceAuthRequired ? 'ζ―' : 'ε¦'}</div>
                                        <div>εΉ΄ιΎθε΄: {capitalInfo.capitalRequirement.maxAge}-{capitalInfo.capitalRequirement.minAge}</div>
                                        <div>ζζΊη±»ε: {capitalInfo.capitalRequirement.mobileType}</div>
                                        <div>εειθ΄­δ»·{capitalInfo.capitalRequirement.purchaseCompareOfficialPrice === 1 ? 'ε€§δΊ' : 'ε°δΊη­δΊ'}ε?η½δ»·</div>
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
