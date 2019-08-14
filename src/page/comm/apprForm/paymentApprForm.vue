<template>
  <div class="paymentForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="1" width="100%">
          <caption class="title">
            <p>仲 裁 员 酬 金 支 付 审 批 表</p>
          </caption>
          <caption class="rightDe">青仲组酬字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="h50 w120" >
              <span>案由</span>
            </td>
            <td class="h50" colspan="5">
              <Input v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入案由..." />
            </td>
          </tr>
          <tr>
            <td class="h50">申请人</td>
            <td colspan="5" class="h50">
              <Input v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..." />
            </td>
          </tr>
          <tr>
            <td class="h50">被申请人</td>
            <td colspan="5" class="h50">
              <Input v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="h50">仲裁员</td>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="rightName oneRightBor">
                  <Input v-model="form.arbitratorOne" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="请输入仲裁员..." />
                </div>
                <div class="rightName">
                  <Input v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入仲裁员..." />
                </div>
                <div class="rightName threeRightBor">
                  <Input v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入仲裁员..." />
                </div>
                <div class="rightName">
                  <!-- <Input v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="Enter something..." /> -->
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="h50">实收受理费</td>
            <td colspan="5">
              <!-- <p>应收受理费： accFee元；实收受理费： accFee元。</p> -->
              <Row>
                <Col span="4">
                  <b>应收受理费:</b>
                </Col>
                <Col span="4">
                  <Input v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入应收受理费..."/>
                </Col>
                <Col span="2">
                  <b>元</b>
                </Col>
                <Col span="4" offset="4">
                  <b>实收受理费:</b>
                </Col>
                <Col span="4">
                  <Input v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入实收受理费..."/>
                </Col>
                <Col span="2">
                  <b>元:</b>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td class="h50">组庭时间</td>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="TimeBox oneRightBor">
                  <Input v-model="form.groupTime" :disabled="form.editableText.split(',').indexOf('groupTime') < 0" placeholder="请输入组庭时间..." />
                </div>
                <div class="TimeBox oneRightBor">结案时间</div>
                <div class="TimeBox">
                  <Input v-model="form.settleTime" :disabled="form.editableText.split(',').indexOf('settleTime') < 0" placeholder="请输入结案时间..." />
                </div>
                <div class="TimeBox threeRightBor">结案方式</div>
                <div class="TimeBox">
                  <Input v-model="form.settleType" :disabled="form.editableText.split(',').indexOf('settleType') < 0" placeholder="请输入结案方式..." />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="h150">办案情况</td>
            <td colspan="5" class="h150">
              <div class="rightTd">
                <div class="caseDetails h50">
                  <Row>
                    <Col span="4">
                      <b>基本酬金:</b>
                    </Col>
                    <Col span="4">
                      <Input v-model="form.remunerationBase  " :disabled="form.editableText.split(',').indexOf('remunerationBase  ') < 0" placeholder="请输入基本酬金..."/>
                    </Col>
                    <Col span="2">
                      <b>元</b>
                    </Col>
                  </Row>
                </div>
                <div class="caseDetails h50">
                  <Row>
                    <Col span="4">
                      <b>合计:</b>
                    </Col>
                    <Col span="4">
                      <Input v-model="form.remunerationTotal" :disabled="form.editableText.split(',').indexOf('remunerationTotal') < 0" placeholder="请输入合计..."/>
                    </Col>
                    <Col span="2">
                      <b>元</b>
                    </Col>
                  </Row>
                </div>
                <div class="h50">
                  <Row class="_labelFor">
                    <Col span="2" offset="1">
                      <b>秘书：</b>
                    </Col>
                    <Col span="4">
                      <img :src="form.secNamePath" v-show="form.secNamePath !== ''" class="h60">
                    </Col>
                    <Col span="8" offset="8">
                      <span>{{form.secApprovalTime }}</span>
                    </Col>
                  </Row>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td rowspan="3" class="h150">仲裁处意见</td>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="rightName oneRightBor">姓名</div>
                <div class="rightName">
                  <Input v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入姓名..." />
                </div>
                <div class="rightName threeRightBor">
                  <Input v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入姓名..." />
                </div>
                <div class="rightName">
                  <Input v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入姓名..." />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="rightName oneRightBor">酬金</div>
                <div class="rightName">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationOne" :disabled="form.editableText.split(',').indexOf('remunerationOne') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
                <div class="rightName threeRightBor">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationTwo" :disabled="form.editableText.split(',').indexOf('remunerationTwo') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
                <div class="rightName">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationThree" :disabled="form.editableText.split(',').indexOf('remunerationThree') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <Row class="_labelFor">
                  <Col span="2" offset="1">
                    <b class="lh50">处长：</b>
                  </Col>
                  <Col span="4">
                    <img :src="form.groupNamePath" v-show="form.groupNamePath !== ''" class="h60">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.groupApprovalTime}}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td rowspan="3" class="h150">主任批示</td>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="rightName oneRightBor">姓名</div>
                <div class="rightName">
                  <Input v-model="form.arbitratorOne" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="请输入姓名..." />
                </div>
                <div class="rightName threeRightBor">
                  <Input v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="请输入姓名..." />
                </div>
                <div class="rightName">
                  <Input v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="请输入姓名..." />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <div class="rightName oneRightBor">酬金</div>
                <div class="rightName">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationOne" :disabled="form.editableText.split(',').indexOf('remunerationOne') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
                <div class="rightName threeRightBor">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationTwo" :disabled="form.editableText.split(',').indexOf('remunerationTwo') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
                <div class="rightName">
                  <div class="monyeInput">
                    <Input v-model="form.remunerationThree" :disabled="form.editableText.split(',').indexOf('remunerationThree') < 0" placeholder="请输入酬金..." />
                  </div>
                  <div class="moneyY">
                    元
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="h50">
              <div class="rightTd">
                <Row class="_labelFor">
                  <Col span="2" offset="1">
                    <b>主任：</b>
                  </Col>
                  <Col span="4">
                    <img :src="form.dirNamePath" v-show="form.dirNamePath !== ''" class="h60">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.dirApprovalTime }}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td class="h50">备注</td>
            <td colspan="5" class="lh50">
              <Input v-model="form.remark" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
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
      form: null
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
      if (type === 3) {
        axios.post('/approvalForm/saveData', {
          caseId: this.caseId,
          type: '24',
          jsonData: JSON.stringify(this.form)
        }).then(res => {
          this.alertShow = false
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
        }).catch(e => {
          this.alertShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
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
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
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
@import "@/style/mixin.scss";
.tableBox {
  width: 800px;
  margin: 60px auto;
  font-size: 14px;
  // text-align: center;
  .title p {
    font-size: 35px;
    height: 60px;
    line-height: 50px;
  }
  .rightDe {
    text-align: right;
    height: 60px;
    line-height: 50px;
    font-size: 16px;
  }
  .rightTd{
    width: 100%;
    height: 100%;
    clear: both;
    .TimeBox{
      width: 20%;
      height: 100%;
    }
    .rightName{
      width: 25%;
      height: 100%;
      .monyeInput{
        width: 80%;
        height: 100%;
        float: left;
      }
      .moneyY{
        width: 19%;
        float: left;
        line-height: 50px;
      }
    }
    .TimeBox,.rightName{
      float: left;
      // line-height: 70px
    }
    .caseDetails,.rowDiv,.TimeBox,.rightName{
      box-sizing: border-box;
      // border: 1px solid black;
    }
    .oneRightBor,.threeRightBor{
      border-right: 1px solid black;
      line-height: 46px;
    }
    .threeRightBor{
      border-left: 1px solid black;
    }
    .caseDetails{
      .ivu-col-span-4,b{
        line-height: 50px;
      }
    }
  }
}
table {
  border-collapse: collapse;
  text-align: center;
  margin: 0 auto;
}
table span {
  display: inline-block;
  // width: 120px;
}
</style>
<style lang="scss">
.tableBox .ivu-input {
  height: 99% !important;
  width: 99% !important;
  border: 0 !important;
  font-size: 14px;
}
.tableBox .ivu-input-wrapper-default {
  height: 99% !important;
}
.ivu-input[disabled]{
  color: black
}
.rightName .ivu-input-wrapper{
  line-height: inherit;
}
.tableBox ._labelFor {
  height: 50px;
  /* margin-bottom: 10px; */
  // line-height: 70px;
  .ivu-col-span-2,.ivu-col-span-8 {
    line-height: 48px;
    padding-top: 2px
  }
  img{
    padding: auto
  }
}
</style>
