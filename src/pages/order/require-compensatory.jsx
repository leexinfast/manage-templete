import { Space, Button, Table, Form, Modal, Input, Select, Alert, DatePicker, Radio, message } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {
    getAllowPushOrder,
    getCapitalListApi,
    operateCapitalMark,
    getMiniTypeListApi,
    getSendListApi,
    operateCapitalOrderApply,
    operateCapitalCreditQuery,
    unCompensatoryList, capitalConfirmRepay
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
    const [selectRowsObj, setSelectRowsObj] = useState({
        capitalNames: '',
        compensatoryAmtAll: 0,
        compensatoryLength: 0,
    })
    const [showModel, setShowModel] = useState(false)
    const [miniTypeList, setMiniTypeList] = useState([])
    const [dataView, setDataView] = useState({
        totalAmt: 0,
        total: 0,
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
        ref.current.reload()
        setShowModel(false)
        setSelectKeys([])
        ref.current.clearSelected()
        form.resetFields()
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.ids = selectKeys
            values.repayTime = moment().format('YYYY-MM-DD HH:mm:ss')
            // console.log(values, 'values')
            capitalConfirmRepay(values).then(res => {
                message.success('????????????')
                handleCancel()
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
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

    useEffect(() => {
        getCapitalList()
        // getMiniTypeList()
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
            dataIndex: 'customerMobile',
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
        // {
        //     title: '????????????',
        //     dataIndex: 'compensatoryFlag',
        //     hideInTable: true,
        //     valueType: 'select',
        //     valueEnum: {
        //         0: '??????',
        //         1: '?????????',
        //         2: '????????????',
        //     }
        // },
        // {
        //     title: '????????????',
        //     align: 'center',
        //     valueType: 'dateRange',
        //     // initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        //     hideInTable: true,
        //     transform: (value) => ({ startTime: value[0] + ' 00:00:00', endTime: value[1] + ' 00:00:00' }),
        // },
        {
            title: '????????????',
            dataIndex: 'capitalOrigin',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                1: '??????',
                2: '??????',
            }
        },
        {
            title: '????????????',
            search: false,
            dataIndex: 'capitalName',
            width: 100,
        },
        {
            title: '????????????',
            dataIndex: 'capitalOrigin',
            search: false,
            width: 80,
            render: (text, record, index) => (
                <>
                    {
                        record.capitalOrigin == 1? (
                            <span>??????</span>
                        ): (
                            <span>??????</span>
                        )
                    }
                </>
            )
        },
        /**
         * table-columns
         */
        {
            title: '????????????',
            search: false,
            dataIndex: 'orderNo',
            width: 100,
        },
        {
            title: '??????',
            align: 'center',
            dataIndex: 'term',
            search: false,
            width: 80,
        },
        {
            title: '????????????',
            dataIndex: 'capitalName',
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
            width: 120,
        },
        {
            title: '??????????????????',
            dataIndex: 'capitalRepayAmt',
            align: 'center',
            search: false,
            width: 100,
        },

        {
            title: '???????????????',
            dataIndex: 'compensatoryAmt',
            align: 'center',
            search: false,
            width: 100,
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
                    rowKey="id"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await unCompensatoryList(params)
                        // console.log(result, 'result')
                        let list = result.capitalCompensatoryVOList || []
                        // let defaultKeys = []
                        // list.map(item => {
                        //     defaultKeys.push(item.id)
                        // })
                        // setSelectKeys(defaultKeys)
                        setDataView({
                            totalAmt: result.totalAmt,
                            total: result.total,
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
                            total: result.total || 0,
                            data: list
                        };
                    }}
                    pagination={{
                        pageSize: 15
                    }}
                    scroll={{
                        x: 1300
                    }}
                    rowSelection={{
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        defaultSelectedRowKeys: selectKeys,
                        selectedRowKeys: selectKeys,
                        onChange: (values, selectedRows) => {
                            // console.log(values, 'values')
                            // console.log(selectedRows, 'selectedRows')
                            setSelectKeys(values)
                            let capitalNames = []
                            let compensatoryAmtAll = 0
                            selectedRows.map(item => {
                                capitalNames.push(item.capitalName)
                                compensatoryAmtAll += Number(item.compensatoryAmt)
                            })
                            setSelectRowsObj({
                                capitalNames: [...new Set(capitalNames)].toString(),
                                compensatoryAmtAll: compensatoryAmtAll.toFixed(2),
                                compensatoryLength: selectedRows.length,
                            })
                        },
                        getCheckboxProps: record => ({
                            selectedRowKeys: []
                        })
                    }}
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
                    toolBarRender={() => [
                        // <Button key='mark' className='button-color-green' onClick={() => {
                        //
                        // }} disabled={selectKeys.length === 0}>??????</Button>,
                        // <Button key='mark' className='button-color-dust' onClick={() => {
                        //     handleConfirm()
                        // }} disabled={selectKeys.length === 0}>??????????????????</Button>,
                        <Button key='mark' className='button-color-sunset' onClick={() => {
                            setShowModel(true)
                        }} disabled={selectKeys.length === 0}>????????????</Button>,
                    ]}
                    tableExtraRender={() => (
                        <div className='pl-24 pr-24'>
                            <Alert message={
                                <>
                                    <span>????????????????????????{dataView.total || 0}</span>
                                    <span className='ml-20'>??????????????????{dataView.totalAmt || 0}</span>
                                </>
                            }></Alert>
                        </div>
                    )}

                />
            </ProCard>
            <Modal title="????????????" visible={showModel} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        clearType: 1,
                        repayType: 1,
                    }}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="????????????"
                    >
                        <>
                            <span>{selectRowsObj.capitalNames}</span>
                        </>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <>
                            <span>{selectRowsObj.compensatoryAmtAll}</span>
                        </>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <>
                            <span>{selectRowsObj.compensatoryLength}</span>
                        </>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        name="repayType"
                        rules={[{ required: true, message: '?????????????????????' }]}
                    >
                        <Select
                            placeholder="?????????"
                            allowClear={true}
                        >
                            <Option value={1}>????????????</Option>
                            <Option value={2}>??????</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        name="repayTime"
                        rules={[{ required: true, message: '?????????????????????' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        name="clearType"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>???</Radio>
                            <Radio value={0}>???</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
