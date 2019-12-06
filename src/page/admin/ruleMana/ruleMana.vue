<template>
  <div class="ruleMana">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2" offset="22">
          <Button type="primary" @click="resAddRule('add')">添加</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
    <alert-btn-info :alertShow="userObj.stateShow" @alertConfirm="stateSave" @alertCancel="alertCanc('state')" alertTitle="操作">
      <p v-if="userObj.stateCode === 2">确定要停用吗？</p>
      <p v-else-if="userObj.stateCode === 1">确定要启用吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.addRule" @alertConfirm="addRuleSave" @alertCancel="alertCanc('addRule')" alertTitle="添加">
      <div>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><span class="_span">*</span><b>规则名称：</b></p>
          </Col>
          <Col span="6">
            <Input style="width:78px" v-model="addData.arbitrateTypeName"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>标的起始金额（元）（包含）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.startMoney"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>标的结束金额（元）（不包含）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.endMoney"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>仲裁类型（1速裁;2普裁）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.arbitrateType"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>时间单位（1自然日;2工作日）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.dateUnit"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>缴费后受理时限（天）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.acceptLimitTime"></InputNumber>
          </Col>
        </Row>
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>在受理通知5日内（请求变更受理限制天数）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.changeRequestAcceptTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>在受理通知5日内（反请求变更受理限制天数）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.changeRequestAcceptTimeBack"></InputNumber>
          </Col>
        </Row> -->
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>答辩期（自送达仲裁通知之日起）/ 反请求答辩期（自送达反请求受理通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.replyOpinion"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>提出反请求时限（自送达仲裁通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.replyOpinionBack"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>管辖权异议期间（自送达仲裁通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.jurisdictionLimitTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭时限（自送达受理通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.selectArbitratorLimitTime"></InputNumber>
          </Col>
        </Row>
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>选择仲裁员个数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.arbitratorNum"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>起始指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.startOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>最大指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.endOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>起始重新指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.restartOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>最大重新指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.reendOpenCourtTime"></InputNumber>
          </Col>
        </Row> -->
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭成功后,仲裁员回避限制天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.avoidLimitTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭后限期作出裁决天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.adjudicationTimeLimit"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>仲裁员结案可延期天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.postponedTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>文书补正：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="addData.correctionTime"></InputNumber>
          </Col>
        </Row> -->
      </div>
    </alert-btn-info>
    <alert-btn-info :isSaveBtn="alertShow.saveBtn" :alertShow="alertShow.editRule" @alertConfirm="editRuleSave" @alertCancel="alertCanc('editRule')" :alertTitle="alertShow.typeName">
      <div>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><span class="_span">*</span><b>规则名称：</b></p>
          </Col>
          <Col span="6">
            <Input style="width:78px" v-model="editData.arbitrateTypeName"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>标的起始金额（元）（包含）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.startMoney"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>标的结束金额（元）（不包含）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.endMoney"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>仲裁类型（1速裁;2普裁）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.arbitrateType"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>时间单位（1自然日;2工作日）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.dateUnit"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>缴费后受理时限（天）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.acceptLimitTime"></InputNumber>
          </Col>
        </Row>
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>在受理通知5日内（请求变更受理限制天数）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.changeRequestAcceptTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>在受理通知5日内（反请求变更受理限制天数）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.changeRequestAcceptTimeBack"></InputNumber>
          </Col>
        </Row> -->
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>答辩期（自送达仲裁通知之日起）/ 反请求答辩期（自送达反请求受理通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.replyOpinion"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>提出反请求时限（自送达仲裁通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.replyOpinionBack"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>管辖权异议期间（自送达仲裁通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.jurisdictionLimitTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭时限（自送达受理通知之日起）：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.selectArbitratorLimitTime"></InputNumber>
          </Col>
        </Row>
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>选择仲裁员个数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.arbitratorNum"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>起始指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.startOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>最大指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.endOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>起始重新指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.restartOpenCourtTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>最大重新指定开庭时间限制：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.reendOpenCourtTime"></InputNumber>
          </Col>
        </Row> -->
        <!-- <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭成功后,仲裁员回避限制天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.avoidLimitTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>组庭后限期作出裁决天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.adjudicationTimeLimit"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>仲裁员结案可延期天数：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.postponedTime"></InputNumber>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="16" offset="1">
            <p><b>文书补正：</b></p>
          </Col>
          <Col span="6">
            <InputNumber :min="-1" v-model="editData.correctionTime"></InputNumber>
          </Col>
        </Row> -->
      </div>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'rule_mana',
  mixins: [resMess],
  components: { spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: false,
      caseList: {
        loading: false,
        header: [
          {
            title: '仲裁规则名称',
            key: 'arbitrateTypeName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.status === 1 ? '启用' : (params.row.status === 2 ? '停用' : '未知'))
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
          }
        ],
        bodyList: []
      },
      alertShow: {
        addRule: false,
        type: '',
        typeName: '',
        saveBtn: false,
        editRule: false
      },
      addData: {
        arbitrateTypeName: '',
        acceptLimitTime: -1,
        adjudicationTimeLimit: -1,
        arbitrateType: -1,
        arbitratorNum: -1,
        avoidLimitTime: -1,
        changeRequestAcceptTime: -1,
        changeRequestAcceptTimeBack: -1,
        correctionTime: -1,
        dateUnit: -1,
        endMoney: -1,
        endOpenCourtTime: -1,
        jurisdictionLimitTime: -1,
        postponedTime: -1,
        reendOpenCourtTime: -1,
        replyOpinion: -1,
        replyOpinionBack: -1,
        restartOpenCourtTime: -1,
        selectArbitratorLimitTime: -1,
        startMoney: -1,
        startOpenCourtTime: -1
      },
      stateList: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '停用'
        }
      ],
      userId: null,
      userObj: {
        stateShow: false,
        stateCode: null
      },
      editData: {}
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.status === 1) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resStatusRule(2, params.index)
              }
            }
          }, '停用'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resEditRule(params.index)
              }
            }
          }, '修改'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resSeeRule(params.index)
              }
            }
          }, '查看')
        ])
      } else if (_obj.status === 2) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resStatusRule(1, params.index)
              }
            }
          }, '启用'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resEditRule(params.index)
              }
            }
          }, '修改'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resSeeRule(params.index)
              }
            }
          }, '查看')
        ])
      } else {
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/arbitrationRule/findArbitrationRuleList').then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data === null ? [] : _data
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resStatusRule (type, index) {
      this.userObj.stateCode = type
      this.userId = this.caseList.bodyList[index].id
      this.userObj.stateShow = true
    },
    stateSave () {
      this.userObj.stateShow = false
      axios.put('/arbitrationRule/updateArbitrationRule', {
        id: this.userId,
        status: this.userObj.stateCode
      }, {
        headers: {
          'content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.alertCanc('state')
        this.resMessage('success', '操作成功')
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('state')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resEditRule (index) {
      let _res = this.caseList.bodyList[index]
      this.editData = JSON.parse(JSON.stringify(_res))
      this.alertShow.type = 'edit'
      this.alertShow.typeName = '修改'
      this.alertShow.editRule = true
    },
    resSeeRule (index) {
      let _res = this.caseList.bodyList[index]
      this.editData = JSON.parse(JSON.stringify(_res))
      this.alertShow.saveBtn = true
      this.alertShow.type = 'see'
      this.alertShow.typeName = '查看'
      this.alertShow.editRule = true
    },
    resAddRule (type) {
      this.alertShow.addRule = true
    },
    addRuleSave () {
      if (this.addData.arbitrateTypeName === '') {
        this.resMessage('warning', '规则名称不能为空')
      } else {
        this.alertShow.addRule = false
        axios.post('/arbitrationRule/addArbitrationRule', this.addData).then(res => {
          this.alertCanc('addRule')
          this.resMessage('success', '操作成功')
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addRule')
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    editRuleSave () {
      if (this.editData.arbitrateTypeName === '') {
        this.resMessage('warning', '规则名称不能为空')
      } else {
        this.alertShow.editRule = false
        axios.put('/arbitrationRule/updateArbitrationRule', this.editData, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('editRule')
          this.resMessage('success', '操作成功')
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('editRule')
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    alertCanc (type) {
      if (type === 'addRule') {
        this.alertShow.addRule = false
        this.addData.arbitrateTypeName = ''
      } else if (type === 'state') {
        this.userId = null
        this.userObj.stateShow = false
        this.userObj.stateCode = null
      } else if (type === 'editRule') {
        this.alertShow.editRule = false
        this.editData = {}
        this.alertShow.saveBtn = false
        this.alertShow.type = ''
        this.alertShow.typeName = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
  ._search {
    max-width: 450px;
    margin-bottom: 20px;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
}
</style>
