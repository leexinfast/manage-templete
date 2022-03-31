import { Space, Button, Select, Alert, Table, Row, message } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getSupplierCapitalRentTotalApi, getCapitalOrderInfoApi, getCapitalListApi } from '@/services/order'
import { useState, useRef, useEffect } from 'react';
import moment from 'moment'

const { Option } = Select

const { Statistic, Divider } = StatisticCard;

export default function OrderPush() {
  const [capitalList, setCapitalList] = useState([])
  const [capitalListNew, setCapitalListNew] = useState([])

  const [capitalIds, setCapitalIds] = useState([])
  const [loanInfo, setLoanInfo] = useState({})
  const ref = useRef()
  const whiteList = [10000010, 10000011, 10000012, 10000003, 10000007, 10000030 ]


  const columns = [
    {
      title: '资方',
      dataIndex: 'capitalIds',
      fixed: true,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        allowClear: false
      },
      hideInTable: true,
      initialValue: [whiteList[0].toString()],
      valueEnum: ()=>{
        let obj = {};
        capitalList.forEach(item=>{
          obj[item.id] = item.shortName
        })
        return obj
      }
    },
    {
      title: '资方',
      dataIndex: 'shortName',
      fixed: true,
      search: false,
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 200,
      search: false
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 200,
      valueType: 'dateRange',
      initialValue: [moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),  moment().format('YYYY-MM-DD 23:59:59')],
      search: {
          transform: (value) => ({ startDate: value[0], endDate: value[1] }),
      },
      hideInTable: true
    },
    {
      title: '预计放款额',
      dataIndex: 'reportAmt',
      search: false
    },
    {
      title: '实际放款额',
      dataIndex: 'orderAmt',
      search: false
    },
    {
      title: '当日放款差异',
      dataIndex: 'term',
      search: false,
      render: (text, record, index) => (
        <>
          <p>{parseFloat((record.reportAmt-record.orderAmt).toFixed(2)) || 0}</p>
        </>
      ),
    },
    {
      title: '上报订单数',
      dataIndex: 'count',
      search: false,
      align: 'center',
    },
  ];

  useEffect(()=>{
    getCapitalList()
  }, [])

  // useEffect(()=>{
  //   if (capitalId) {
  //     // ref.current.reload()
  //     getCapitalOrderInfo()
  //   }
  // }, [capitalId])

  const getCapitalList = ()=>{
    getCapitalListApi().then(res=>{
      let list = res || [];
      if (list.length) {

        let newList = list.filter(item=>{
          if (whiteList.includes(item.id)) {
            return item
          }
        })
        if (newList.length > 0) {
          let id = newList[0].id;
          setCapitalIds([id])
          getCapitalOrderInfo([id])
        }
        setCapitalListNew(newList)
        // 10000010, 10000011, 10000012, 10000003, 10000007, 10000030
        setCapitalList(list)
      }
    })
  }

  const getCapitalOrderInfo = (ids)=>{
    getCapitalOrderInfoApi({ capitalIds: ids}).then(res=>{
      let list = res.data || [];
      let count = 0;
      let actualSupplyPriceTotal = 0;
      let reportTotalAmount = 0;
      let balanceOfThePremium = 0;
      list.forEach(item=>{
        count += item.count || 0
        actualSupplyPriceTotal += item.actualSupplyPriceTotal || 0
        reportTotalAmount += item.reportTotalAmount || 0
        balanceOfThePremium += item.balanceOfThePremium || 0
      })
      setLoanInfo({
        count,
        actualSupplyPriceTotal,
        reportTotalAmount,
        balanceOfThePremium
      })
    })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={10}>
      <ProCard>
        <Select style={{width: 200}} mode="multiple" allowClear={false} value={capitalIds}  showSearch onChange={(value)=>{
          setCapitalIds(value)
        }}>
          {
            capitalListNew.map(item=>{
              return (
                <Option value={item.id} key={item.id}>{item.shortName}</Option>
              )
            })
          }
        </Select>
        <Button style={{marginLeft: '10px'}} type="primary" onClick={()=>{
          if (capitalIds.length === 0) {
            message.warning('请选择资方')
            return
          }
          getCapitalOrderInfo(capitalIds)
        }}>刷新</Button>
        <Row style={{marginTop: '10px'}}>
        <Alert message={
              <>
                <span>未签收订单：</span>
                <span>{loanInfo.count || 0}</span>
                <span style={{marginLeft: '20px'}}>未签收订单总额：</span>
                <span>{loanInfo.actualSupplyPriceTotal || 0 }</span>
                <span style={{marginLeft: '20px'}}>可上报订单采购价总额：</span>
                <span>{loanInfo.reportTotalAmount || 0}</span>
                <span style={{marginLeft: '20px'}}>保费余额：</span>
                <span>{loanInfo.balanceOfThePremium || 0}</span>
              </>
            }></Alert>
        </Row>

      </ProCard>
      <ProCard>
        <ProTable
          actionRef={ref}
          columns={columns}
          bordered
          toolBarRender={false}
          rowKey="id"
          // manualRequest={true}
          request={async (values) => {
            let params = {
              ...values,
              pageNo: values.current ? values.current - 1 : 0,
              current: undefined,
            };
            if (params.capitalIds.length === 0) {
              message.warning('请选择资方')
              return
            }
            if (!params.startDate && !params.endDate) {
              params.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().format('YYYY-MM-DD HH:mm:ss')
            }

            let result = await getSupplierCapitalRentTotalApi(params)
            let obj = {};
            capitalList.forEach(item=>{
              obj[item.id] = item.shortName
            })

          result.forEach(item=>{
              item.shortName = obj[item.capitalId],
                  item.capitalIds = params.capitalIds
            })
            return {
              data: result
            };
          }}
          pagination={{
            pageSize: 15
          }}
          scroll={{x: '100vw'}}
          summary={pageData=>{

            let reportAmtTotal = 0;
            let orderAmtTotal = 0;
            pageData.forEach(item=>{
              reportAmtTotal += Number(item.reportAmt || 0)
              orderAmtTotal += Number(item.orderAmt || 0)
            })
            let termTotal = reportAmtTotal - orderAmtTotal
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell>总计</Table.Summary.Cell>
                  <Table.Summary.Cell>-</Table.Summary.Cell>
                  <Table.Summary.Cell>{reportAmtTotal}</Table.Summary.Cell>
                  <Table.Summary.Cell>{orderAmtTotal}</Table.Summary.Cell>
                  <Table.Summary.Cell>{termTotal}</Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )
          }}
            search={
                {
                    defaultCollapsed: false,
                    labelWidth: 'auto',
                    optionRender: (searchConfig, formProps, dom) => [
                        ...dom.reverse()
                    ],
                }
            }
        />
      </ProCard>
    </Space>
  );
}
