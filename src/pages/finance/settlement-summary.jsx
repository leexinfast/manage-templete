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
import { viewOrderTotal } from "@/services/finance";


const { Statistic, Divider } = StatisticCard;


const { Option } = Select;

const { confirm } = Modal;

export default function OrderPush() {
    const [capitalList, setCapitalList] = useState([
        {
            id: 10000010,
            shortName: "华沃公司"
        }
    ])
    const [selectKeys, setSelectKeys] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [miniTypeList, setMiniTypeList] = useState([])
    const [timeData, setTimeData] = useState({
        startTime: '',
        endTime: '',
    })
    const [dataView, setDataView] = useState({
        allowPushAmt: 0,
        allowPushCount: 0,
        totalRentAmt: 0,
        waitReportAmt: 0,
        waitReportCount: 0
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
            title: '资方简称',
            dataIndex: 'capitalIds',
            hideInTable: true,
            valueType: 'select',
            fieldProps: {
                mode: 'multiple'
            },
            initialValue: ['10000010'],
            valueEnum: () => {
                let obj = {};
                capitalList.map(item => {
                    obj[item.id] = item.shortName;
                })
                return obj
            }
        },
        {
            title: '结算时间',
            align: 'center',
            dataIndex: 'time',
            valueType: 'dateRange',
            initialValue: [moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
            hideInTable: true,
            transform: (value) => ({ startTime: value[0], endTime: value[1] }),
        },
        /**
         * table-columns
         */
        {
            title: '资方简称',
            search: false,
            dataIndex: 'capitalId',
            width: 100,
            render: (text, record, index) => (
                capitalList.map(item => {
                    if (item.id == record.capitalId) {
                        return item.shortName
                    }
                })
            )
        },
        {
            title: '日期',
            search: false,
            dataIndex: 'date',
            width: 140,
            render: (text, record, index) => (
                <>
                    <div>{timeData.startTime}</div>
                    <div>{timeData.endTime}</div>
                </>
            )
        },
        {
            title: '应收服务费',
            search: false,
            dataIndex: 'repayServiceCharge',
            width: 120,
        },
        {
            title: '应还总额',
            search: false,
            dataIndex: 'repayTotalAmt',
            width: 100,
        },
        {
            title: '应还笔数',
            search: false,
            dataIndex: 'repayCount',
            width: 110,
        },
        {
            title: '已收服务费',
            search: false,
            dataIndex: 'realRepayServiceCharge',
            width: 120,
        },
        {
            title: '已还总额',
            search: false,
            dataIndex: 'realRepayAmt',
            width: 100,
        },
        {
            title: '已还笔数',
            search: false,
            dataIndex: 'realRepayCount',
            width: 110,
        },
        {
            title: '用户还款总额',
            search: false,
            dataIndex: 'realRepayTotalAmt',
            width: 140,
        },
        {
            title: '代偿金额',
            search: false,
            dataIndex: 'compensatoryAmt',
            width: 100,
        },
        {
            title: '代偿后还款金额',
            search: false,
            align: 'center',
            dataIndex: 'afterCompensatoryRepayAmt',
            width: 160,
        },
        {
            title: '用户还款率',
            search: false,
            align: 'center',
            dataIndex: 'repayRate',
            width: 130,
            render: (text, record, index) => (
                <>
                    <span>{(record.repayRate*100).toFixed(2)}%</span>
                </>
            )
        },
        {
            title: '代偿率',
            search: false,
            align: 'center',
            dataIndex: 'compensatoryRate',
            width: 110,
            render: (text, record, index) => (
                <>
                    <span>{(record.compensatoryRate*100).toFixed(2)}%</span>
                </>
            )
        },
        {
            title: '代偿后用户还款率',
            search: false,
            dataIndex: 'afterCompensatoryRepayRate',
            align: 'center',
            width: 180,
            render: (text, record, index) => (
                <>
                    <span>{(record.afterCompensatoryRepayRate*100).toFixed(2)}%</span>
                </>
            )
        },
    ]

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={10}>
            <ProCard>
                <ProTable
                    actionRef={ref}
                    columns={columns}
                    options={false}
                    bordered
                    toolBarRender={false}
                    rowKey="capitalId"
                    request={async (values) => {
                        let params = {
                            ...values,
                            pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                            capitalIds: values.capitalIds? values.capitalIds: '10000010',
                        };
                        setTimeData({
                            startTime: values.startTime.split(' ')[0],
                            endTime: values.endTime.split(' ')[0],
                        })
                        let result = await viewOrderTotal(params)
                        return {
                            data: result,
                            success: true
                        };
                    }}
                    pagination={false}
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
                    // tableExtraRender={() => (
                    //     <div className='pl-24 pr-24'>
                    //         <Alert message={
                    //             <>
                    //                 <span>采购总额：{dataView.allowPushAmt? dataView.allowPushAmt.toFixed(2): 0}</span>
                    //                 <span className='ml-20'>进件单数：{dataView.allowPushCount || '-'}</span>
                    //                 <span className='ml-20'>资方审核拒绝单数：{dataView.totalRentAmt? dataView.totalRentAmt.toFixed(2): 0}</span>
                    //                 <span className='ml-20'>总租金：{'-'}</span>
                    //             </>
                    //         }></Alert>
                    //     </div>
                    // )}

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
