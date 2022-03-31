import { Space, Table, Form, Modal, Select, Alert } from "antd";
import ProCard, { StatisticCard } from "@ant-design/pro-card";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import { getCapitalListApi } from "@/services/order";
import { getCapitalDetailApi } from "@/services/config";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { cloneDeep } from "lodash";
import { unPushOrder, viewPushAllView } from "@/services/finance";

export default function OrderPush() {
    const [capitalList, setCapitalList] = useState([
        {
            id: 10000003,
            shortName: "甜橙2",
        },
        {
            id: 10000007,
            shortName: "民盛2",
        },
        {
            id: 10000012,
            shortName: "北文科",
        },
        {
            id: 10000034,
            shortName: "新希望保理",
        },
        {
            id: 10000035,
            shortName: "中原",
        },
        {
            id: 10000010,
            shortName: "华泯",
        },
        {
            id: 10000030,
            shortName: "华沃",
        },
    ]);
    const [selectKeys, setSelectKeys] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [unPushOrderDataSource, setUnPushOrderDataSource] = useState([]);
    const [dataView, setDataView] = useState({
        ypzAlipay: 0,
        ypjrAlipay: 0,
        qnypAlipay: 0,
        ypzlApp: 0,
        azjAlipay: 0,
        ypzWechat: 0,
        total: 0,
    });
    const [countView, setCountView] = useState({
        signCountAmtTotal: 0,
        unPushCountAmtTotal: 0,
        allTotalArray: []
    });
    const [capitalInfo, setCapitalInfo] = useState({});
    const initColumns = [
        {
            title: "资方简称",
            dataIndex: "capitalIds",
            hideInTable: true,
            valueType: "select",
            initialValue: [
                10000003, 10000007, 10000012, 10000034, 10000035, 10000010, 10000030,
            ],
            fieldProps: {
                mode: "multiple",
            },
            request: async () => getCapitalList(),
            // valueEnum: () => {
            //     let obj = {};
            //     capitalList.map(item => {
            //         obj[item.id] = item.shortName;
            //     })
            //     return obj
            // },
        },
        {
            title: "签收时间",
            align: "center",
            dataIndex: "time",
            valueType: "dateRange",
            initialValue: [
                moment().subtract(7, "days").format("YYYY-MM-DD 00:00:00"),
                moment().format("YYYY-MM-DD 23:59:59"),
            ],
            hideInTable: true,
            transform: (value) => ({ startTime: value[0], endTime: value[1] }),
        },
        /**
         * table-columns
         */
        {
            title: "时间",
            search: false,
            dataIndex: "date",
            align: "center",
            width: 100,
        },
        {
            title: "新签收订单",
            search: false,
            dataIndex: "signCount",
            align: "center",
            width: 100,
        },
        {
            title: "未推单数",
            search: false,
            dataIndex: "unPushCount",
            align: "center",
            width: 100,
            render: (text, record) => (
                <>
                    <div
                        className="line-hover"
                        onClick={() => {
                            handleUnPushOrder(record.date);
                        }}
                    >
                        {record.unPushCount}
                    </div>
                </>
            ),
        },
    ];

    const [columns, setColumns] = useState(initColumns);
    const [form] = Form.useForm();
    const ref = useRef();

    const getCapitalList = () => {
        return getCapitalListApi().then(res => {
            const result = res.map(item => {
                return {
                    label: item.shortName,
                    value: item.id,
                }
            });
            return result;
        });
    };

    const handleUnPushOrder = (date) => {
        unPushOrder({
            date: date,
        }).then((res) => {
            // console.log(res)
            setUnPushOrderDataSource(res.list);
            setDataView({
                ypzAlipay: res.ypzAlipay,
                ypjrAlipay: res.ypjrAlipay,
                qnypAlipay: res.qnypAlipay,
                ypzlApp: res.ypzlApp,
                azjAlipay: res.azjAlipay,
                ypzWechat: res.ypzWechat,
                map: res.map,
                total: res.total,
            });
            setShowModel(true);
        });
    };

    useEffect(() => {
        // getCapitalList()
        // getMiniTypeList();
    }, []);
    const unPushOrderColumns = [
        {
            title: "订单来源",
            dataIndex: "miniTypeStr",
            width: 150
        },
        {
            title: "订单编号",
            dataIndex: "orderNo",
            width: 220
        },
        {
            title: "下单时间",
            dataIndex: "createTime",
        },
        {
            title: "签收时间",
            dataIndex: "signTime",
        },
        {
            title: "真实采购价",
            dataIndex: "actualSupplyPrice",
            align: 'center',
            width: 120
        },
        {
            title: "金融方案",
            dataIndex: "financeType",
            width: 280
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }} size={10}>
            <ProCard>
                <ProTable
                    actionRef={ref}
                    columns={columns}
                    options={false}
                    toolBarRender={false}
                    rowKey="date"
                    request={async (values) => {
                        let params = {
                            ...values,
                            // pageNo: values.current ? values.current - 1 : 0,
                            current: undefined,
                        };
                        let result = await viewPushAllView(params);
                        let signCountAmtTotal = 0;
                        let unPushCountAmtTotal = 0;
                        let columnsArray = cloneDeep(initColumns);
                        let newColumns = [];
                        let allTotalObj = {};
                        if (result.length > 0) {
                            result[0].capitalOrders.map((e) => {
                                newColumns.push({
                                    title: e.capitalName,
                                    search: false,
                                    dataIndex: "pushCount_" + e.capitalName,
                                    align: "center",
                                    width: 100,
                                });
                                allTotalObj["pushCount_" + e.capitalName] = "pushCount_" + e.capitalName
                            });
                        }
                        result.forEach(item => {
                            item.capitalOrders.map((e) => {
                                item["pushCount_" + e.capitalName] = e.pushCount;
                            });
                            signCountAmtTotal += Number(item.signCount || 0);
                            unPushCountAmtTotal += Number(item.unPushCount || 0);
                        });
                        let allTotalArray = []
                        for (let key in allTotalObj) {
                            let total = 0
                            allTotalArray.push(
                                result.reduce((total, item) => total + item[key], 0)
                            )
                        }
                        console.log(result, "result");
                        console.log(allTotalArray, 'allTotalArray')

                        setColumns([...columnsArray, ...newColumns]);
                        setCountView({
                            signCountAmtTotal: signCountAmtTotal,
                            unPushCountAmtTotal: unPushCountAmtTotal,
                            allTotalArray: allTotalArray
                        });
                        return {
                            data: result,
                            success: true,
                        };
                    }}
                    bordered
                    pagination={false}
                    scroll={{
                        x: 900,
                    }}
                    tableAlertRender={false}
                    search={{
                        defaultCollapsed: false,
                        labelWidth: "auto",
                        optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
                    }}
                    summary={pageData=>{
                        // let signCountAmtTotal = 0;
                        // let unPushCountAmtTotal = 0;
                        // console.log(pageData, 'pageData')
                        // pageData.forEach(item=>{
                        //     signCountAmtTotal += Number(item.signCount || 0)
                        //     unPushCountAmtTotal += Number(item.unPushCount || 0)
                        // })
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell align='center'>合计</Table.Summary.Cell>
                                    <Table.Summary.Cell align='center'>{countView.signCountAmtTotal}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='center'>{countView.unPushCountAmtTotal}</Table.Summary.Cell>
                                    {
                                        countView.allTotalArray.length > 0 && countView.allTotalArray.map((item, index) => {
                                            return (
                                                <Table.Summary.Cell key={index} align='center'>{item}</Table.Summary.Cell>
                                            )
                                        })
                                    }

                                </Table.Summary.Row>
                            </>
                        )
                    }}
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
                    //     <div className="pl-24 pr-24">
                    //         <Alert
                    //             message={
                    //                 <>
                    //                     <span>新签收订单：{countView.signCountAmtTotal || 0}</span>
                    //                     <span className="ml-20">
                    //                         未推单数：{countView.unPushCountAmtTotal || 0}
                    //                     </span>
                    //                     {/*<span className='ml-20'>资方审核拒绝单数：{dataView.totalRentAmt? dataView.totalRentAmt.toFixed(2): 0}</span>*/}
                    //                     {/*<span className='ml-20'>总租金：{'-'}</span>*/}
                    //                 </>
                    //             }
                    //         ></Alert>
                    //     </div>
                    // )}
                />
            </ProCard>
            <Modal
                title="未推单数"
                visible={showModel}
                footer={null}
                width={1200}
                onCancel={() => {
                    setShowModel(false);
                }}
            >
                <div className="mb-20">
                    <Alert
                        message={
                            <>
                                <div className="flex-row-h">
                                    <div className="mr-10">合计：{dataView.total}</div>
                                    {
                                        dataView.map && Object.keys(dataView.map).map((key) => {
                                            return <div className="mr-10" key={key}>{key}：{dataView.map[key]}</div>
                                        })
                                    }
                                </div>
                            </>
                        }
                    ></Alert>
                </div>
                <Table
                    dataSource={unPushOrderDataSource}
                    columns={unPushOrderColumns}
                    rowKey="orderNo"
                    scroll={{ x: 1000, y: 600 }}
                    bordered
                    pagination={false}
                />
            </Modal>
        </Space>
    );
}
