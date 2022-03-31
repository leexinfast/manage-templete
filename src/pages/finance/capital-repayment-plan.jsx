import { Space, Button } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getCapitalOrderreturnDetailsApi } from '@/services/order'
import { useState, useRef } from 'react';

const TypeList = {
    1: '租金',
    2: '买断金'
}

export default function OrderPush() {
  const [capitalList, setCapitalList] = useState({})

  const columns = [
    {
        title: '资方',
        dataIndex: 'capitalId',
        valueType: 'select',
        valueEnum: capitalList,
        align: 'center',
        fieldProps: {
            showSearch: true
        },
        hideInTable: true
      },
    {
      title: '资方',
      dataIndex: 'capitalName',
      fixed: true,
      align: 'center',
      search: false
    },
    {
      title: '订单号',
      dataIndex: 'loanNo',
      width: 200,
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center'
    },
    {
      title: '期数',
      dataIndex: 'term',
      search: false,
      align: 'center'
    },
    {
      title: '类型',
      dataIndex: 'type',
      search: false,
      align: 'center',
      render: (text, record, index) => (
        <>
          <p>{TypeList[text]}</p>
        </>
      ),
    },{
      title: '金额',
      dataIndex: 'capital',
      search: false,
      align: 'center'
    },{
        title: '应还金额',
        dataIndex: 'capitalRentAmt',
        search: false,
        align: 'center'
      },{
        title: '应还时间',
        dataIndex: 'capitalRepayTime',
        search: false,
        align: 'center',
        valueType: 'dateTimeRange',
        hideInTable: true,
        search: {
            transform: (value) => ({ startTime: value[0], endTime: value[1] }),
        },
      },{
        title: '应还时间',
        dataIndex: 'capitalRepayTime',
        search: false,
        align: 'center',
      },{
        title: '实扣金额',
        dataIndex: 'realRepayAmt',
        search: false,
        align: 'center'
      },{
        title: '服务费',
        dataIndex: 'chargeAmt',
        search: false,
        align: 'center'
      },{
        title: '实扣时间',
        dataIndex: 'realRepayTime',
        align: 'center',
        valueType: 'dateTimeRange',
        hideInTable: true,
        search: {
            transform: (value) => ({ clearingBeginTime: value[0], clearingEndTime: value[1] }),
        },
      },{
        title: '实扣时间',
        dataIndex: 'realRepayTime',
        search: false,
        align: 'center',
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
            let params = {
              ...values,
              pageNo: values.current ? values.current - 1 : 0,
              current: undefined,
            };
            let result = await getCapitalOrderreturnDetailsApi(params)
            let obj = {};
            let _capitalList = result.capitalList || [];
            _capitalList.forEach(item => {
                obj[item.id] = item.shortName
            });
            setCapitalList(obj)
            return {
              total: result.count,
              data: result.list
            };
          }}
          pagination={{
            pageSize: 15
          }}
          scroll={{x: '100vw'}}
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
