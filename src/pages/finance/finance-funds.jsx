import { Space, Button } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getFinanceReportFunds, getMiniTypeListApi, getCapitalListApi, getMainCategoryApi } from '@/services/order'
import { useState, useRef, useEffect } from 'react';
import { accountList,amountTypeList} from '@/util/data'
import { history } from 'umi';

const screenRisksType = {
  1: '甜橙',
  2: '中保',
  3: '优品'
}

const FilterRefundStatus = {
  0: "未退款",
  5: "退款失败",
  10: "全部退款",
  15: '部分退款'
}

const PayTypeStr = {
  0: '未付款',
  1: '支付中',
  10: '付款成功',
  5: '付款失败'
}

const AliPayPayTypeList = {
  1: '支付',
  2: '冻结代扣',
  3: '活动红包转账',
  4: '区块链代扣',
  5: '商户代扣',
  6: '支付通提前还款'
}

const BusinessTypeList = {
  1: '车辆业务',
  2: '优品租赁',
  3: '借款业务'
}

export default function OrderPush() {
  const [capitalList, setCapitalList] = useState([])
  const [miniTypeList, setMiniTypeList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    getMiniTypeList()
    getCapitalList()
    getMainCategory()
  }, []);

  const getMiniTypeList = () =>{
    getMiniTypeListApi().then(res=>{
      setMiniTypeList(res.miniTypeList)
    })
  }
  const getCapitalList = () => {
    getCapitalListApi().then(res=>{
      setCapitalList(res)
    })
  }

  const getMainCategory = () => {
    getMainCategoryApi().then(res=>{
      setCategoryList(res)
    })
  }


  const columns = [
    {
      title: '业务编号',
      dataIndex: 'loanNo',
      hideInTable: true,
        initialValue: history.location?.query.orderNo,
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      hideInTable: true
    },{
      title: '手机号',
      dataIndex: 'mobile',
      hideInTable: true
    },{
      title: '支付场景',
      dataIndex: 'amountType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...amountTypeList
      }
    },{
      title: '支付通道',
      dataIndex: 'payConfig',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...accountList
      }
    },{
      title: '订单来源',
      dataIndex: 'miniType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: ()=>{
        let obj = {};
        miniTypeList.forEach(item=>{
          obj[item.miniType] = item.name
        })
        return obj
      }
    },
    {
      title: '支付类型',
      dataIndex: 'alipayPayType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...AliPayPayTypeList
      }
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...BusinessTypeList
      }
    },
    {
      title: '支付场景',
      dataIndex: 'amountTypeStr',
      search: false,
      width: 120,
      fixed: true
    },
    {
      title: '实际支付金额',
      dataIndex: 'payAmount',
      width: 200,
      align: 'center',
      search: false,
      render: (text, record, index) => (
        <>
          <p>{text}</p>
          {
              record.anotherPay === 1 && (
                <p>(代付)</p>
              )
          }
        </>
      ),
    },
    {
      title: '支付通道',
      dataIndex: 'channelAccount',
      align: 'center',
      width: 100,
      search: false
    },
    {
      title: '资方',
      dataIndex: 'capitalName',
      align: 'center',
      search: false,
      width: 100
    },{
      title: '资方',
      dataIndex: 'capitalId',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: ()=>{
        let obj = {};
        capitalList.forEach(item=>{
          obj[item.id] = item.shortName
        })
        return obj
      }
    },
    {
      title: '发货时间',
      dataIndex: 'sendEndTime',
      align: 'center',
      hideInTable: true,
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({ supplierSendBeginTime: value[0], supplierSendEndTime: value[1] }),
      },
    },{
      title: '碎屏险公司',
      dataIndex: 'screenRisksType',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        ...screenRisksType
      }
    },
    {
      title: '是否使用支付宝优惠券',
      dataIndex: 'platformDiscount',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        1: '使用',
        0: '未使用'
      }
    },
    {
      title: '商品主分类',
      dataIndex: 'typeClass',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: ()=>{
        let obj = {};
        categoryList.forEach(item=>{
          obj[item.id] = item.name
        })
        return obj
      }
    },
    {
      title: '订单编号',
      dataIndex: 'no',
      search: false,
      align: 'center',
      width: 200
    },
    {
      title: '客户信息',
      dataIndex: 'capitalVerifyResult',
      align: 'center',
      width: 150,
      search: false,
      render: (text, record, index) => (
        <>
          <p>{record.customerName}</p>
          <p>{record.mobile}</p>
        </>
      ),
    },
    {
      title: '金融方案',
      dataIndex: 'financeTemplateTitle',
      search: false,
      align: 'center',
      width: 150
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      align: 'center',
      width: 150,
      search: false
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      align: 'center',
      width: 150,
      search: false
    },
    {
      title: '商户名称',
      dataIndex: 'shopName',
      align: 'center',
      width: 150,
      hideInTable: true
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueType: 'digit',
      search: false,
      align: 'center',
      width: 100,
      render: (text, record, index) => (
        <>
          <span>{PayTypeStr[record.payStatus]}</span>
        </>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'payTypeStr',
      align: 'center',
      width: 100,
      search: false
    },
    {
      title: '支付宝支付类型',
      dataIndex: 'aliPayPayTypeStr',
      align: 'center',
      search: false,
      width: 130,
    },{
      title: '业务类型',
      dataIndex: 'businessTypeStr',
      search: false,
      align: 'center',
      width: 100
    },{
      title: '碎屏险金额',
      dataIndex: 'businessTypeStr',
      search: false,
      align: 'center',
      width: 100,
      render: (text, record, index) => (
        <>
        <p>¥{record.screenRisksAmount}</p>
        <p>{screenRisksType[record.screenRisksType]}</p>
        </>
      ),
    },{
      title: '来源平台',
      dataIndex: 'miniTypeStr',
      search: false,
      align: 'center',
      width: 150
    },{
      title: '支付宝优惠金额',
      dataIndex: 'platformDiscountAmt',
      search: false,
      align: 'center',
      width: 120,
    },{
      title: '优惠券金额',
      dataIndex: 'discountAmt',
      search: false,
      align: 'center',
      width: 100,
    },{
      title: '保证金抵扣',
      dataIndex: 'bondDeductionAmt',
      search: false,
      align: 'center',
      width: 100
    },{
      title: '支付时间',
      dataIndex: 'payTime',
      hideInTable: true,
      align: 'center',
      width: 200,
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({ startTime: value[0], endTime: value[1] }),
      },
    },{
      title: '支付时间',
      dataIndex: 'payTime',
      search: false,
      align: 'center',
      width: 200,
    },{
      title: '第三方订单号',
      dataIndex: 'outOrderNo',
      align: 'center',
      width: 270
    },{
      title: '商户订单号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 270
    },{
      title: '是否退款',
      dataIndex: 'refundStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: ()=>{
        let obj = {}
        for (let key in FilterRefundStatus) {
          if (key != 5) {
            obj[key] = FilterRefundStatus[key]
          }
        }
        return obj
      },
      render: (text, record, index) => (
        <>
          <p>{FilterRefundStatus[record.refundStatus]}</p>
        </>
      ),
    },{
      title: '退款时间',
      dataIndex: 'refundTime',
      hideInTable: true,
      align: 'center',
      width: 200,
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({ refundBeginTime: value[0], refundEndTime: value[1] }),
      },
    },{
      title: '退款时间',
      dataIndex: 'refundTime',
      search: false,
      align: 'center',
      width: 200,
    },
  ];



  return (
    <Space direction="vertical" style={{ width: '100%' }} size={10}>
      <ProCard>
        <ProTable
          columns={columns}
          toolBarRender={false}
          bordered
          rowKey="id"
          request={async (values) => {
              values.loanNo = history.location?.query?.orderNo || ''
            let params = {
              ...values,
              pageNo: values.current ? values.current - 1 : 0,
              current: undefined,
              payStatus: 10
            };
            let result = await getFinanceReportFunds(params)
            return {
              total: result.count,
              data: result.list
            };
          }}
          pagination={{
            pageSize: 15
          }}
          scroll={{x: '100vw'}}
          search={{
              labelWidth: 'auto',
              optionRender: (searchConfig, formProps, dom) => [
                  ...dom.reverse()
              ],
            }}
        />
      </ProCard>
    </Space>
  );
}
