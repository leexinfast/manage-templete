import { Space, Button, Table, Form, Modal, Input, Select, Col, Row, Alert, Checkbox } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { getCapitalListConfigApi, resetCapitalPasswordApi, getCapitalDetailApi, addCapitalConfiguration, modifyCapitalConfiguration } from '@/services/config'
import { getCapitalListApi } from '@/services/order'
import { useState, useRef, useEffect } from 'react';

const { Option } = Select;

const { TextArea } = Input

const capitalInitValues = {
  name: '',
  standardAnnualInterestRate: '',
  totalLimit: '',
  shortName: '',
  payeeAccount: '',
  password: '',
  isInsuranceRequired: 0,
  originIRR: '',
  contractSwitch: 0,
  contractPermission: 1,
  smsMobile: '',
  type: 1,
  applicationId: '',
  clearScoreTenantId: '',
  capitalTenantId: '',
  leaseTenantId: '',
  capitalDivisionMid: '',
  capitalDivisionRate: '',
  ypDivisionMid: '',
  ypDivisionRate: '',
  legalPerson: '',
  legalPersonPhone: '',
  idCardNumber: '',
  maxAge: '',
  minAge: '',
  mobileType: [],
  orderManagementMenu: 1,
  assetManagementMenu: 1,
  hireMenuOption: [],
  refundMenuOption: [],
  waitSignMenuOption: [],
  propertyMenuOption: [],
  monthMenuOption: []
}

export default function OrderPush() {
  const [capitalList, setCapitalList] = useState([])
  const [selectKeys, setSelectKeys] = useState([])
  const [showModel, setShowModel] = useState(false)
  const [resetBtnShow, setResetBtnShow] = useState(false)
  const [capitalInfo, setCapitalInfo] = useState({})
  const [form] = Form.useForm();
  const [formDisabled, setFormDisabled] = useState(false)
  const [capitalForm] = Form.useForm();
  const ref = useRef()

  const capitalType = [
    { value: 1, label: '线上' },
    { value: 2, label: '线下' },
  ]

  const capitalContractPermission = [
    { value: 1, label: '开' },
    { value: 0, label: '关' },
  ]

  const capitalInsuranceRequired = [
    { value: 1, label: '是' },
    { value: 0, label: '否' },
  ]

  const plainOptions = [
    { label: 'iphone', value: 'iphone' },
    { label: 'android', value: 'android' },
  ]

  const hireMenuOption = [
    { label: '搜索', value: 'searchInRenting' },
    { label: '导出', value: 'exportInRenting' },
    { label: '批量下载合同', value: 'batchDownloadContractInRenting' },
    { label: '批量下载保单', value: 'batchDownloadInsurancePolicyInRenting' },
    { label: '查看保单', value: 'viewInsurancePolicyInRenting' },
    { label: '租赁合同', value: 'rentContractInRenting' },
    { label: '身份证', value: 'idCardInRenting' },
    { label: '账单信息', value: 'billInfoInRenting' },
    { label: '案调报告', value: 'caseInvestigationReportInRenting' },
    { label: '快递信息', value: 'expressInfoInRenting' },
    { label: '还款列表', value: 'repaymentListInRenting' },
  ]

  const refundMenuOption = [
    { label: '搜索', value: 'searchInRepaymentList' },
    { label: '导出', value: 'exportInRepaymentList' },
  ]

  const waitSignMenuOption = [
    { label: '搜索', value: 'searchInWaitSignedList' },
    { label: '导出', value: 'exportInWaitSignedList' },
    { label: '批量签署', value: 'batchSignInWaitSignedList' },
  ]

  const propertyMenuOption = [
    { label: '搜索', value: 'searchInAssetSummary' },
  ]

  const monthMenuOption = [
    { label: '搜索', value: 'searchInMonthlySummary' },
  ]

  const columns = [
    // shortNameList
    {
      title: '资方名称',
      dataIndex: 'shortNameList',
      search: true,
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        mode: 'multiple'
      },
      valueEnum: () => {
        let obj = {};
        capitalList.forEach(item => {
          obj[item.shortName] = item.shortName
        })
        return obj
      }
    }, {
      title: '资方名称',
      dataIndex: 'name',
      search: false,
      align: 'center',
      width: 100
    }, {
      title: '资方简称',
      dataIndex: 'shortName',
      search: false,
      align: 'center',
      width: 100
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      align: 'center',
      width: 200
    }, {
      title: '资方账号',
      dataIndex: 'capitalDivisionMid',
      search: false,
      align: 'center',
      width: 120
    }, {
      title: '资方来源',
      dataIndex: 'type', // 1: 线上 2: 线下
      search: false,
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        let str = '';
        capitalType.forEach(item => {
          if (item.value === text) {
            str = item.label
          }
        })
        return (
          <>
            <span>{str}</span>
          </>
        )
      }
    }, {
      title: '资方总额度',
      dataIndex: 'totalLimit',
      search: false,
      align: 'center',
      width: 150
    }, {
      title: '标准年化',
      dataIndex: 'standardAnnualInterestRate',
      search: false,
      align: 'center',
      width: 120
    }, {
      title: '原始IRR',
      dataIndex: 'originIRR',
      search: false,
      align: 'center',
      width: 100
    }, {
      title: '合同签订开关',
      dataIndex: 'contractPermission',
      search: false,
      align: 'center',
      width: 180,
      render: (text, record, index) => {
        let str = '';
        capitalContractPermission.forEach(item => {
          let value = item.value === 1
          if (value === text) {
            str = item.label
          }
        })
        return (
          <>
            <div>{str}</div>
          </>
        )
      }
    }, {
      title: '需要投保',
      dataIndex: 'isInsuranceRequired',
      search: false,
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        let str = ''
        capitalInsuranceRequired.forEach(item => {
          let value = item.value == 1
          if (value === text) {
            str = item.label
          }
        })
        return (
          <>
            <span>{str}</span>
          </>
        )
      }
    }, {
      title: '资方要求',
      dataIndex: 'capitalRequirement',
      search: false,
      align: 'center',
      width: 230,
      render: (text, record, index) => (
        <>
          {
            text && (
              <>
                <div>是否需要人脸: {text.isFaceAuthRequired ? '是' : '否'}</div>
                <div>年龄范围: {text.maxAge}-{text.minAge}</div>
                <div>手机类型: {text.mobileType}</div>
                <div>商品采购价{text.purchaseCompareOfficialPrice === 1 ? '大于' : '小于等于'}官网价</div>
              </>
            )
          }
        </>
      ),
    }, {
      title: '备注',
      dataIndex: 'capitalRequirement',
      align: 'center',
      search: false,
      width: 200,
      render: (text, record, index) => (
        <>
          <div>{text && text.remark}</div>
        </>
      ),
    }, {
      title: '操作',
      dataIndex: 'capitalId',
      align: 'center',
      search: false,
      width: 280,
      render: (text, record, index) => (
        <>
          <Button style={{ marginRight: '5px' }} type="primary" size="small" onClick={() => {
            setShowModel(true)
            getCapitalDetail(record.capitalId)
            setFormDisabled(true)
          }}>查看</Button>
          <Button style={{ marginRight: '5px' }} type="primary" size="small" onClick={() => {
            let params = {
              ...record
            }
            capitalForm.setFieldsValue({ ...params })
            setShowModel(true)
            getCapitalDetail(record.capitalId)
          }}>编辑</Button>
          <Button type="primary" size="small"
            onClick={() => {
              setResetBtnShow(true);
              setCapitalInfo(record)
            }}>重置密码</Button>
        </>
      ),
    },

  ];

  const handleOkReset = () => {
    let password = form.getFieldValue('password')
    if (!password) {
      return
    }

    resetCapitalPasswordApi({ capitalId: capitalInfo.capitalId, password }).then(res => {
      handleCancelReset()
    })
    //
  }

  const getCapitalList = () => {
    getCapitalListApi().then(res => {
      setCapitalList(res)
    })
  }

  const getCapitalDetail = (capitalId) => {
    getCapitalDetailApi({ capitalId }).then(res => {
      let data = res.data || {};
      let _hireMenuOption = [];
      let _refundMenuOption = [];
      let _waitSignMenuOption = [];
      let _propertyMenuOption = [];
      let _monthMenuOption = []
      if (!data.configInfo) {
        data.configInfo = {}
      }
      hireMenuOption.forEach(item => {
        if (data.configInfo[item.value]) {
          _hireMenuOption.push(item.value)
        }
      })
      refundMenuOption.forEach(item => {
        if (data.configInfo[item.value]) {
          _refundMenuOption.push(item.value)
        }
      })
      waitSignMenuOption.forEach(item => {
        if (data.configInfo[item.value]) {
          _waitSignMenuOption.push(item.value)
        }
      })
      propertyMenuOption.forEach(item => {
        if (data.configInfo[item.value]) {
          _propertyMenuOption.push(item.value)
        }
      })
      monthMenuOption.forEach(item => {
        if (data.configInfo[item.value]) {
          _monthMenuOption.push(item.value)
        }
      })

      data.isInsuranceRequired = data.isInsuranceRequired ? 1 : 0;
      data.contractPermission = data.contractPermission ? 1 : 0;
      data.contractSwitch = data.contractSwitch ? 1 : 0;
      data.hireMenuOption = _hireMenuOption;
      data.refundMenuOption = _refundMenuOption;
      data.waitSignMenuOption = _waitSignMenuOption;
      data.propertyMenuOption = _propertyMenuOption;
      data.monthMenuOption = _monthMenuOption;
      if (data.capitalRequirement) {
        data.isFaceAuthRequired = data.capitalRequirement.isFaceAuthRequired ? 1 : 0
        data.maxAge = data.capitalRequirement.maxAge,
          data.minAge = data.capitalRequirement.minAge,
          data.mobileType = data.capitalRequirement.mobileType && data.capitalRequirement.mobileType.split(','),
          data.purchaseCompareOfficialPrice = data.capitalRequirement.purchaseCompareOfficialPrice,
          data.remark = data.capitalRequirement.remark
          data.esSearchScript = data.capitalRequirement.esSearchScript;
      }
      data.assetManagementMenu = data.configInfo.assetManagementMenu ? 1 : 0
      data.orderManagementMenu = data.configInfo.orderManagementMenu ? 1 : 0
      data.rentingMenu = data.configInfo.rentingMenu ? 1 : 0
      data.repaymentListMenu = data.configInfo.repaymentListMenu ? 1 : 0
      data.waitSignedListMenu = data.configInfo.waitSignedListMenu ? 1 : 0
      data.assetSummaryMenu = data.configInfo.assetSummaryMenu ? 1 : 0
      data.monthlySummaryMenu = data.configInfo.monthlySummaryMenu ? 1 : 0

      data.type = data.type == 0 ? '' : data.type
      capitalForm.setFieldsValue({ ...data })
      setCapitalInfo({ ...data })
    })
  }

  const handleCancelReset = () => {
    setResetBtnShow(false)
    form.setFieldsValue({ password: '' })
    setCapitalInfo(capitalInitValues)

  }

  const handleCancel = () => {
    setShowModel(false)
  }

  const handleOk = () => {

  }



  const handleResult = () => {
    handleCancel()
    ref.current.reload()
  }

  const onFinish = (values) => {
    let params = { ...values };
    params.configInfo = {}
    params.capitalId = capitalInfo.capitalId
    params.capitalDivisionRate = Number(values.capitalDivisionRate || 0)
    params.configInfo.assetManagementMenu = values.assetManagementMenu === 1
    params.configInfo.orderManagementMenu = values.orderManagementMenu === 1

    params.configInfo.rentingMenu = values.rentingMenu === 1 // 租用中显示/隐藏
    params.configInfo.repaymentListMenu = values.repaymentListMenu === 1 // 还款列表显示/隐藏
    params.configInfo.waitSignedListMenu = values.waitSignedListMenu === 1 // 待签署列表显示/隐藏
    params.configInfo.assetSummaryMenu = values.assetSummaryMenu === 1 // 资产汇总显示/隐藏
    params.configInfo.monthlySummaryMenu = values.monthlySummaryMenu === 1 // 月度汇总显示/隐藏


    if (values.hireMenuOption && values.hireMenuOption.length) {
      values.hireMenuOption.forEach(item => {
        params.configInfo[item] = true
      })
    }
    if (values.refundMenuOption && values.refundMenuOption.length) {
      values.refundMenuOption.forEach(item => {
        params.configInfo[item] = true
      })
    }
    if (values.waitSignMenuOption && values.waitSignMenuOption.length) {
      values.waitSignMenuOption.forEach(item => {
        params.configInfo[item] = true
      })
    }
    if (values.propertyMenuOption && values.propertyMenuOption.length) {
      values.propertyMenuOption.forEach(item => {
        params.configInfo[item] = true
      })
    }
    if (values.monthMenuOption && values.monthMenuOption.length) {
      values.monthMenuOption.forEach(item => {
        params.configInfo[item] = true
      })
    }

    params.capitalRequirement = {
      isFaceAuthRequired: true,
      maxAge: values.maxAge,
      minAge: values.minAge,
      mobileType: values.mobileType && values.mobileType.join(','),
      purchaseCompareOfficialPrice: values.purchaseCompareOfficialPrice,
      remark: values.remark,
      esSearchScript: values.esSearchScript
    }
    params.isInsuranceRequired = values.isInsuranceRequired === 1
    params.contractPermission = values.contractPermission === 1
    params.contractSwitch = values.contractSwitch === 1

    if (capitalInfo.capitalId) {
      if (values.password !== capitalInfo.password) {
        params.password = `modify:${values.password}`
      }
      modifyCapitalConfiguration({ ...params }).then(res => {
        handleResult()
      })
    } else {
      addCapitalConfiguration({ ...values }).then(res => {
        handleResult()
      })
    }
  }

  useEffect(() => {
    getCapitalList()
  }, [])

  useEffect(() => {
    if (!showModel) {
      capitalForm.resetFields()
      setFormDisabled(false)
    }
  }, [showModel])



  return (
    <Space direction="vertical" style={{ width: '100%' }} size={10}>
      <ProCard>
        <ProTable
          actionRef={ref}
          columns={columns}
          toolBarRender={false}
          rowKey="capitalId"
          request={async (values) => {
            let params = {
              ...values,
              pageNo: values.current ? values.current - 1 : 0,
              current: undefined,
            };
            let result = await getCapitalListConfigApi(params)
            return {
              total: result.total || 0,
              data: result.list
            };
          }}
          pagination={{
            pageSize: 15
          }}
          scroll={{ x: '100vw' }}
          search={{
            defaultCollapsed: false,
              labelWidth: 'auto',
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Button key="add" onClick={() => {
                setShowModel(true);
                setCapitalInfo(capitalInitValues)

              }} type="primary">新增</Button>,
            ],
          }
          }
        />
      </ProCard>
      <Modal forceRender title="重置密码" visible={resetBtnShow} onOk={handleOkReset} onCancel={handleCancelReset} >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          autoComplete="off"
          form={form}
          preserve={false}
        >
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              {
                required: true,
                message: '输入新密码',
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal forceRender title="新增/编辑" visible={showModel} onOk={handleOk} onCancel={handleCancel} width={800} footer={null}>
        <ProCard>
          <Form
            name="basic"
            form={capitalForm}
            preserve={false}
            onFinish={onFinish}
            initialValues={capitalInitValues}
          >
            <Alert message="基础信息" type="success" />
            <Row gutter={24} style={{ marginTop: '10px' }}>
              <Col span={12}>
                <Form.Item
                  label="资方名称"
                  name="name"
                  rules={[{ required: true, message: '请输入', }]}
                  labelCol
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="标准年化"
                  name="standardAnnualInterestRate"
                  required={false}
                >
                  <Input type="number" disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方总额度"
                  name="totalLimit"
                >
                  <Input type="number" disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方简称"
                  name="shortName"
                  rules={[{ required: true, message: '请输入', }]}
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方收款账号"
                  name="payeeAccount"
                  required={false}
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方收款名称"
                  name="payeeName"
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方密码"
                  name="password"
                  rules={[{ required: true, message: '请输入', }]}
                >
                  <Input type="password" disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="是否需要投保"
                  name="isInsuranceRequired"
                  rules={[{ required: true, message: '请输入', }]}
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    {
                      capitalInsuranceRequired.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="原始IRR"
                  name="originIRR"
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}><Form.Item
                label="合同签订开关"
                name="contractSwitch"
                rules={[{ required: true, message: '请输入', }]}
              >
                <Select style={{ width: 120 }} disabled={formDisabled}>
                  {
                    capitalContractPermission.map(item => {
                      return (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item></Col>
              <Col span={12}>
                <Form.Item
                  label="签署合同权限"
                  name="contractPermission"
                  required={false}
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    {
                      capitalContractPermission.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.contractPermission !== currentValues.contractPermission}
              >
                {({ getFieldValue }) => {
                  const contractPermission = getFieldValue('contractPermission')
                  return (
                    <Col span={12}>
                      <Form.Item
                        label="接收验证码手机号"
                        name="smsMobile"
                        required={false}
                      >
                        <Input disabled={formDisabled} />
                      </Form.Item>
                    </Col>
                  )
                }}
              </Form.Item>

              <Col span={12}>
                <Form.Item
                  label="资方来源"
                  name="type"
                  required={false}
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    {
                      capitalType.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }) => {
                  const type = getFieldValue('type')
                  let dom = null;
                  if (type == 1) {
                    dom =
                      (
                        <>
                          <Col span={12}>
                            <Form.Item
                              label="合约ID"
                              name="applicationId"
                            >
                              <Input disabled={formDisabled} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="清分方租户ID"
                              name="clearScoreTenantId"
                            >
                              <Input disabled={formDisabled} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="资方租户ID"
                              name="capitalTenantId"
                            >
                              <Input disabled={formDisabled} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              label="租赁方租户ID"
                              name="leaseTenantId"
                            >
                              <Input disabled={formDisabled} />
                            </Form.Item>
                          </Col>
                        </>

                      )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>



              <Col span={12}>
                <Form.Item
                  label="资方收款账号"
                  name="capitalDivisionMid"
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资方收款比例"
                  name="capitalDivisionRate"
                >
                  <Input type="number" disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="优品收款账号"
                  name="ypDivisionMid"
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="优品收款比例"
                  name="ypDivisionRate"
                >
                  <Input type="number" disabled={formDisabled} />
                </Form.Item>
              </Col>
            </Row>
            <Alert message="法人信息" type="success" />
            <Row gutter={24} style={{ marginTop: '10px' }}>
              <Col span={12}>
                <Form.Item
                  label="法人姓名"
                  name="legalPerson"
                  required={false}
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="法人手机号"
                  name="legalPersonPhone"
                  required={false}
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="法人身份证号"
                  name="idCardNumber"
                  required={false}
                >
                  <Input disabled={formDisabled} />
                </Form.Item>
              </Col>
            </Row>
            <Alert message="资方要求" type="success" />
            <Row gutter={24} style={{ marginTop: '10px' }}>
              <Col span={12}>
                <Form.Item
                  label="用户年龄范围"
                >
                  <Row gutter={12}>
                    <Col span={5}>
                      <Form.Item
                        label=""
                        name="maxAge"
                      >
                        <Input disabled={formDisabled} />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      -
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label=""
                        name="minAge"
                      >
                        <Input disabled={formDisabled} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="手机类型"
                  name="mobileType"
                >
                  <Checkbox.Group options={plainOptions} disabled={formDisabled} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="商品采购价"
                >
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      label="商品采购价"
                      name="purchaseCompareOfficialPrice"
                    >
                      <Select style={{ width: 120 }} disabled={formDisabled}>
                        <Option value={1}>大于</Option>
                        <Option value={2}>小于等于</Option>
                      </Select>
                    </Form.Item>
                    <span style={{ marginTop: '5px' }}>官方价</span>
                  </div>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="是否需要人脸"
                  name="isFaceAuthRequired"
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="备注"
                  name="remark"
                >
                  <TextArea autoSize={{ minRows: 2, maxRows: 6 }} disabled={formDisabled}></TextArea>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="SQL"
                  name="esSearchScript"
                >
                  <TextArea autoSize={{ minRows: 2, maxRows: 6 }} disabled={formDisabled}></TextArea>
                </Form.Item>
              </Col>

            </Row>
            <Alert message="按钮权限" />
            <Row style={{ marginTop: '10px' }}>
              <Col span={24}>
                <Form.Item
                  label="订单管理"
                  name="orderManagementMenu"
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    <Option value={1}>显示</Option>
                    <Option value={0}>不显示</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.orderManagementMenu !== currentValues.orderManagementMenu}
              >
                {({ getFieldValue }) => {
                  const orderManagementMenu = getFieldValue('orderManagementMenu')
                  let dom = null;
                  if (orderManagementMenu === 1) {
                    dom = (
                      <Col span={20} offset={2}>
                        <Form.Item
                          label="租用中"
                          name="rentingMenu"
                          initialValue={1}
                        >
                          <Select style={{ width: 120 }} disabled={formDisabled}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>不显示</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.rentingMenu !== currentValues.rentingMenu}
                        >
                          {({ getFieldValue }) => {
                            let rentingMenu = getFieldValue('rentingMenu')
                            let orderManagementMenu = getFieldValue('orderManagementMenu')
                            let dom = null;
                            if (rentingMenu === 1) {
                              dom = (
                                <Col span={20} offset={4}>
                                  <Form.Item
                                    label=""
                                    name="hireMenuOption"
                                    initialValue={capitalInfo.hireMenuOption}
                                  >
                                    <Checkbox.Group options={hireMenuOption} disabled={formDisabled} />
                                  </Form.Item>
                                </Col>
                              )
                            } else {
                              dom = null
                            }
                            return dom
                          }}
                        </Form.Item>
                      </Col>
                    )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.orderManagementMenu !== currentValues.orderManagementMenu}
              >
                {({ getFieldValue }) => {
                  const orderManagementMenu = getFieldValue('orderManagementMenu')
                  let dom = null;
                  if (orderManagementMenu === 1) {
                    dom = (
                      <Col span={20} offset={2}>
                        <Form.Item
                          label="还款列表"
                          name="repaymentListMenu"
                          initialValue={1}
                        >
                          <Select style={{ width: 120 }} disabled={formDisabled}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>不显示</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.repaymentListMenu !== currentValues.repaymentListMenu}
                        >
                          {({ getFieldValue }) => {
                            const repaymentListMenu = getFieldValue('repaymentListMenu')
                            let dom = null;
                            if (repaymentListMenu === 1) {
                              dom = (
                                <Col span={20} offset={4}>
                                  <Form.Item
                                    label=""
                                    name="refundMenuOption"
                                    initialValue={capitalInfo.refundMenuOption}
                                  >
                                    <Checkbox.Group options={refundMenuOption} disabled={formDisabled} />
                                  </Form.Item>
                                </Col>
                              )
                            } else {
                              dom = null
                            }
                            return dom
                          }}
                        </Form.Item>
                      </Col>
                    )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.orderManagementMenu !== currentValues.orderManagementMenu}
              >
                {({ getFieldValue }) => {
                  const orderManagementMenu = getFieldValue('orderManagementMenu')
                  let dom = null;
                  if (orderManagementMenu === 1) {
                    dom = (
                      <Col span={20} offset={2}>
                        <Form.Item
                          label="待签署列表"
                          name="waitSignedListMenu"
                          initialValue={1}
                        >
                          <Select style={{ width: 120 }} disabled={formDisabled}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>不显示</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.waitSignedListMenu !== currentValues.waitSignedListMenu}
                        >
                          {({ getFieldValue }) => {
                            const waitSignedListMenu = getFieldValue('waitSignedListMenu')
                            let dom = null;
                            if (waitSignedListMenu === 1) {
                              dom = (
                                <Col span={20} offset={4}>
                                  <Form.Item
                                    label=""
                                    name="waitSignMenuOption"
                                    initialValue={capitalInfo.waitSignMenuOption}
                                  >
                                    <Checkbox.Group options={waitSignMenuOption} disabled={formDisabled} />
                                  </Form.Item>
                                </Col>
                              )
                            } else {
                              dom = null
                            }
                            return dom
                          }}
                        </Form.Item>
                      </Col>
                    )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>

              <Col>
                <Form.Item
                  label="资产管理"
                  name="assetManagementMenu"
                >
                  <Select style={{ width: 120 }} disabled={formDisabled}>
                    <Option value={1}>显示</Option>
                    <Option value={0}>不显示</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.assetManagementMenu !== currentValues.assetManagementMenu}
              >
                {({ getFieldValue }) => {
                  const assetManagementMenu = getFieldValue('assetManagementMenu')
                  let dom = null;
                  if (assetManagementMenu === 1) {
                    dom = (
                      <Col span={20} offset={2}>
                        <Form.Item
                          label="资产汇总"
                          name="assetSummaryMenu"
                          initialValue={1}
                        >
                          <Select style={{ width: 120 }} disabled={formDisabled}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>不显示</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.assetSummaryMenu !== currentValues.assetSummaryMenu}
                        >
                          {({ getFieldValue }) => {
                            const assetSummaryMenu = getFieldValue('assetSummaryMenu')
                            let dom = null;
                            if (assetSummaryMenu === 1) {
                              dom = (
                                <Col span={20} offset={4}>
                                  <Form.Item
                                    label=""
                                    name="propertyMenuOption"
                                    initialValue={capitalInfo.propertyMenuOption}
                                  >
                                    <Checkbox.Group options={propertyMenuOption} disabled={formDisabled} />
                                  </Form.Item>
                                </Col>
                              )
                            } else {
                              dom = null
                            }
                            return dom
                          }}
                        </Form.Item>
                      </Col>
                    )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.assetManagementMenu !== currentValues.assetManagementMenu}
              >
                {({ getFieldValue }) => {
                  const assetManagementMenu = getFieldValue('assetManagementMenu')
                  let dom = null;
                  if (assetManagementMenu === 1) {
                    dom = (
                      <Col span={20} offset={2}>
                        <Form.Item
                          label="月度汇总"
                          name="monthlySummaryMenu"
                          initialValue={1}
                        >
                          <Select style={{ width: 120 }} disabled={formDisabled}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>不显示</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.monthlySummaryMenu !== currentValues.monthlySummaryMenu}
                        >
                          {({ getFieldValue }) => {
                            const monthlySummaryMenu = getFieldValue('monthlySummaryMenu')
                            let dom = null;
                            if (monthlySummaryMenu === 1) {
                              dom = (
                                <Col span={20} offset={4}>
                                  <Form.Item
                                    label=""
                                    name="monthMenuOption"
                                    initialValue={capitalInfo.monthMenuOption}
                                  >
                                    <Checkbox.Group options={monthMenuOption} disabled={formDisabled} />
                                  </Form.Item>
                                </Col>
                              )
                            } else {
                              dom = null
                            }
                            return dom
                          }}
                        </Form.Item>
                      </Col>
                    )
                  } else {
                    dom = null
                  }
                  return dom
                }}
              </Form.Item>

              {/* <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.assetManagementMenu !== currentValues.assetManagementMenu}
            >
              {({ getFieldValue }) => {
                const assetManagementMenu = getFieldValue('assetManagementMenu')
                let dom = null;
                if (assetManagementMenu === 1) {
                  dom = (
                    <>
                       <Col span={20} offset={2}>
                        <Form.Item
                            label="资产汇总"
                            name="propertyMenuOption"
                            initialValue={capitalInfo.propertyMenuOption}
                          >
                          <Checkbox.Group options={propertyMenuOption} disabled={formDisabled}/>
                        </Form.Item>
                      </Col>
                      <Col span={20} offset={2}>
                        <Form.Item
                            label="月度汇总"
                            name="monthMenuOption"
                            initialValue={capitalInfo.monthMenuOption}
                          >
                          <Checkbox.Group options={monthMenuOption} disabled={formDisabled}/>
                        </Form.Item>
                      </Col>
                    </>
                  )
                } else {
                  dom = null
                }
                return dom
              }}
              </Form.Item> */}
            </Row>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={formDisabled}>
                提交
              </Button>
              <Button style={{ marginLeft: '10px' }} type="primary" type="default" htmlType="reset" onClick={() => { handleCancel() }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      </Modal>
    </Space>
  );
}
