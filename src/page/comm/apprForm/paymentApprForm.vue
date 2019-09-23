<template>
  <div class="paymentForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="0" width="100%" cellSpacing="0">
          <caption class="f35 h60 lh60">
            <p>仲 裁 员 酬 金 支 付 审 批 表</p>
          </caption>
          <caption class="tr f16 h60 lh60">青仲组酬字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="tdb tc w120" >
              <span>案由</span>
            </td>
            <td class="tdb tdl" colspan="5">
              <Input class="_input" v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入案由..."/>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120">申请人</td>
            <td colspan="5" class="tdb tdl">
              <Input class="_input" v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..."/>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120">被申请人</td>
            <td colspan="5" class="tdb tdl">
              <Input class="_input" v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..."/>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120">仲裁员</td>
            <td colspan="5" class="tdb tdl">
              <Row>
                <Col span="6">
                  <div>
                    <Input class="_input" v-model="form.arbitratorOne" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="请输入仲裁员..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入仲裁员..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入仲裁员..."/>
                  </div>
                </Col>
                <Col span="6">
                <div class="tdl">
                  <Input class="_input"/>
                </div>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120">实收受理费</td>
            <td colspan="5" class="tdb tdl">
              <Row>
                <Col span="4" class="lh50">
                  <b class="ml5">应收受理费:</b>
                </Col>
                <Col span="4">
                  <Input class="_input" v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入应收受理费..."/>
                </Col>
                <Col span="2" class="lh50">
                  <b class="ml5">元</b>
                </Col>
                <Col span="4" offset="4" class="lh50">
                  <b class="ml5">实收受理费:</b>
                </Col>
                <Col span="4">
                  <Input class="_input" v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入实收受理费..."/>
                </Col>
                <Col span="2" class="lh50">
                  <b class="ml5">元</b>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120">组庭时间</td>
            <td class="tdb tdl">
              <div class="">
                <Input class="_input" v-model="form.groupTime" :disabled="form.editableText.split(',').indexOf('groupTime') < 0" placeholder="请输入组庭时间..." />
              </div>
            </td>
            <td class="tdb tdl w100 tc">
              <span>结案文书发送时间</span>
            </td>
            <td class="tdb tdl">
              <div>
                <Input class="_input" v-model="form.settleTime" :disabled="form.editableText.split(',').indexOf('settleTime') < 0" placeholder="请输入结案时间..." />
              </div>
            </td>
            <td class="tdb tdl w100 tc">
              <span>结案方式</span>
            </td>
            <td class="tdb tdl">
              <div>
                <Input class="_input" v-model="form.settleType" :disabled="form.editableText.split(',').indexOf('settleType') < 0" placeholder="请输入结案方式..." />
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tc w120" rowspan="3">办案情况</td>
            <td colspan="5" class="tdl">
              <div>
                 <Row>
                    <Col span="4" class="lh50">
                      <b class="ml5">基本酬金:</b>
                    </Col>
                    <Col span="4" class="lh50">
                      <Input v-model="form.remunerationBase" class="_inp" :disabled="form.editableText.split(',').indexOf('remunerationBase  ') < 0" placeholder="请输入基本酬金..."/>
                    </Col>
                    <Col span="2" class="lh50">
                      <b class="ml5">元</b>
                    </Col>
                  </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdl">
              <div>
                <Row>
                    <Col span="4" class="lh50">
                      <b class="ml5">合计:</b>
                    </Col>
                    <Col span="4" class="lh50">
                      <Input v-model="form.remunerationTotal" class="_inp" :disabled="form.editableText.split(',').indexOf('remunerationTotal') < 0" placeholder="请输入合计..."/>
                    </Col>
                    <Col span="2" class="lh50">
                      <b class="ml5">元</b>
                    </Col>
                  </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdb tdl _h50 lh50">
              <Row class="">
                <Col span="3">
                  <b class="ml5">秘书：</b>
                </Col>
                <Col span="4" class="">
                  <img class="_img" :src="form.secNamePath" v-show="form.secNamePath !== ''">
                </Col>
                <Col span="8" offset="8">
                  <span>{{form.secApprovalTime }}</span>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td rowspan="3" class="tdb tc w120">仲裁处意见</td>
            <td colspan="5" class="tdb tdl">
              <Row>
                <Col span="6" class="lh50">
                  <span class="ml5">姓名</span>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input v-model="form.arbitratorOne" class="_input" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
                  <Col span="6">
                  <div class="tdl">
                    <Input v-model="form.arbitratorTwo" class="_input" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
                  <Col span="6">
                  <div class="tdl">
                    <Input v-model="form.arbitratorThree" class="_input" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdb tdl">
              <Row>
                <Col span="6" class="lh50">
                  <span class="ml5">酬金</span>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationOne" :disabled="form.editableText.split(',').indexOf('remunerationOne') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationTwo" :disabled="form.editableText.split(',').indexOf('remunerationTwo') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationThree" :disabled="form.editableText.split(',').indexOf('remunerationThree') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdb tdl _h50 lh50">
              <div>
                <Row class="">
                  <Col span="3">
                    <b class="ml5">处长：</b>
                  </Col>
                  <Col span="4" class="">
                    <img class="_img" :src="form.groupNamePath" v-show="form.groupNamePath !== ''">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.groupApprovalTime}}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td rowspan="3" class="tdb tc w120">主任批示</td>
            <td colspan="5" class="tdb tdl">
              <Row>
                <Col span="6" class="lh50">
                  <span class="ml5">姓名</span>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.arbitratorOne" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
                  <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
                  <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入姓名..."/>
                  </div>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdb tdl">
                <Col span="6" class="lh50">
                  <span class="ml5">酬金</span>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationOne" :disabled="form.editableText.split(',').indexOf('remunerationOne') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationTwo" :disabled="form.editableText.split(',').indexOf('remunerationTwo') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tdl">
                    <Input class="_input" v-model="form.remunerationThree" :disabled="form.editableText.split(',').indexOf('remunerationThree') < 0" placeholder="请输入酬金..."/>
                  </div>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="tdb tdl _h50 lh50">
              <div>
                <Row class="">
                  <Col span="3">
                    <b class="ml5">主任：</b>
                  </Col>
                  <Col span="4" class="">
                    <img class="_img" :src="form.dirNamePath" v-show="form.dirNamePath !== ''">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.dirApprovalTime}}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tc w120">备注</td>
            <td colspan="5" class="tdl">
              <Input v-model="form.remark" :autosize="{minRows: 4,maxRows: 5}" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">返回</Button>
        <Button type="primary" size="large" @click="alertConfirm(3)">保存</Button>
        <Button type="primary" size="large" @click="alertConfirm(2)">驳回</Button>
        <Button type="primary" size="large" @click="alertConfirm(1)">通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['caseId'],
  data () {
    return {
      alertShow: true,
      form: null,
      switchObj: false
    }
  },
  created () {
    if (this.caseId !== null) {
      this.resFormData()
    }
  },
  methods: {
    resFormData () {
      axios.post('/approvalForm/queryServiceFeeApprovalData', {
        caseId: this.caseId
      }).then(res => {
        this.form = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertConfirm (type) {
      if (this.switchObj) {
        return false
      }
      this.switchObj = true
      if (type === 3) {
        axios.post('/approvalForm/saveData', {
          caseId: this.caseId,
          type: '24',
          jsonData: JSON.stringify(this.form)
        }).then(res => {
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.switchObj = false
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
          this.switchObj = false
        })
      } else {
        axios.post('/closeCaseForm/audit', {
          caseId: this.caseId,
          formType: 'remuneration',
          state: type
        }).then(res => {
          this.$emit('alertConfirm')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.switchObj = false
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
          this.switchObj = false
        })
      }
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.tableBox {
  width: 840px;
  margin: 50px auto;
  table {
    border: 1px solid #666;
    tr td {
      height: 50px;
    }
    ._h50 {
      height: 50px;
    }
    .tdb {
      border-bottom: 1px solid #666;
    }
    .tdl {
      border-left: 1px solid #666;
    }
    ._img {
      height: 35px;
      vertical-align: middle;
    }
    .lh50{
      line-height: 50px
    }
  }
}
</style>
<style lang="scss">
.tableBox {
  table {
    ._input .ivu-input.ivu-input-default {
      box-sizing: border-box;
      height: 50px;
      color: #333;
      font-size: 14px;
    }
    ._inp .ivu-input.ivu-input-default {
      box-sizing: border-box;
      color: #333;
      font-size: 14px;
    }
  }
}
</style>
