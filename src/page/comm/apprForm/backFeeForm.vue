<template>
  <div class="backFeeForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="0" width="100%" cellSpacing="0">
          <caption class="f35 h60 lh60">
            <p>退 还 仲 裁 费 审 批 表</p>
          </caption>
          <caption class="tr f16 h60 lh60">青仲互退费字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="tdb tc w120">
              <span class="fls5">申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span class="fls5">被申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span class="block m5 fls5">仲裁费</span>
              <span class="block m5 fls5">预交情况</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Row>
                <Col span="4" class="lh50 tr">
                  <b class="ml5">案件受理费：</b>
                </Col>
                <Col span="4">
                  <Input class="_input" v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入应收受理费..."/>
                </Col>
                <Col span="2" class="lh50">
                  <b class="ml5">元</b>
                </Col>
                <Col span="4" offset="4" class="lh50 tr">
                  <b class="ml5">案件处理费:</b>
                </Col>
                <Col span="1" class="lh50 tr">
                  <b class="ml5">0</b>
                  <!-- <Input class="_input" v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入实收处理费..."/> -->
                </Col>
                <Col span="2" class="lh50">
                  <b class="ml5">元</b>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span class="block m5">退</span>
              <span class="block m5">费</span>
              <span class="block m5">建</span>
              <span class="block m5">议</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <div>
                <div>
                  <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.suggest" :disabled="form.editableText.split(',').indexOf('suggest') < 0" type="textarea" placeholder="请输入退费建议..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50 pl5" colspan="6">
              <div>
                <Row>
                  <Col span="3">
                    <b>办案秘书：</b>
                  </Col>
                  <Col span="4">
                    <img class="_img" :src="form.secNamePath" v-show="form.secNamePath !== ''">
                  </Col>
                  <Col span="8" offset="7">
                    <span>{{form.secApprovalTime}}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span class="block m5 fls5">仲裁处</span>
              <span class="block m5 fls5">意&nbsp;&nbsp;见</span>
            </td>
            <td class="tdb tdl pl5" colspan="6">
              <div>
                <div>
                  同意
                  <!-- <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.dirApprovalContent" :disabled="form.editableText.split(',').indexOf('dirApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/> -->
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50 pl5" colspan="6">
              <div>
                <Row>
                  <Col span="2">
                    <b>审批人：</b>
                  </Col>
                  <Col span="4">
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
            <td class="tdb tc" rowspan="2">
              <span class="block m5 fls5">主&nbsp;&nbsp;任</span>
              <span class="block m5 fls5">批&nbsp;&nbsp;示</span>
            </td>
            <td class="tdb tdl pl5" colspan="6">
              <div>
                <div>
                  同意
                  <!-- <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.dirApprovalContent" :disabled="form.editableText.split(',').indexOf('dirApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/> -->
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50 pl5" colspan="6">
              <div>
                <Row>
                  <Col span="2">
                    <b>主任：</b>
                  </Col>
                  <Col span="4">
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
            <td class="tc">
              <span class="block m5 fls5">备&nbsp;&nbsp;注</span>
            </td>
            <td class="tdl" colspan="6">
              <Input :autosize="{minRows: 4,maxRows: 5}" v-model="form.remark" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">返回</Button>
        <Button type="primary" size="large" @click="alertConfirm(3)">保存</Button>
        <Button v-if="usersInfo.roleCode === 'ROLE_BAMS'" type="primary" size="large" @click="alertConfirm(2)">退回</Button>
        <Button type="primary" size="large" @click="alertConfirm(1)">通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  props: ['caseId'],
  data () {
    return {
      alertShow: true,
      form: null,
      switchObj: false,
      passSubmit: false
    }
  },
  created () {
    if (this.caseId !== null) {
      this.resFormData()
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resFormData () {
      axios.post('/approvalForm/queryGivebackFeeApprovalData', {
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
          type: '25',
          jsonData: JSON.stringify(this.form)
        }).then(res => {
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.switchObj = false
          this.passSubmit = true
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
          this.switchObj = false
        })
      } else {
        if (this.passSubmit) {
          axios.post('/closeCaseForm/audit', {
            caseId: this.caseId,
            formType: 'givebackfee',
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
        } else {
          this.$Message.warning({
            content: '请点击保存按钮，进行签名信息的保存',
            duration: 2
          })
          this.switchObj = false
          this.passSubmit = false
        }
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
  }
}
</style>
