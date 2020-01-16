<template>
  <div class="endCaseForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="0" width="100%" cellSpacing="0">
          <caption class="f35 h60 lh60">
            <p>结 案 审 批 表</p>
          </caption>
          <caption class="tr f16 h60 lh60">哈仲互结字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="tdb tc w120" >
              <span>申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>被申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>案由</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="输入案由..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>申请事项</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" :autosize="{minRows: 5,maxRows: 7}" v-model="form.applyContent" type="textarea" :disabled="form.editableText.split(',').indexOf('applyContent') < 0" placeholder="输入申请事项..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>独任仲裁员</span>
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.arbitratorOne" :disabled="form.editableText.split(',').indexOf('arbitratorOne') < 0" placeholder="输入独任仲裁员..." />
            </td>
            <td class="tdb tdl w100 tc">
              <span>仲裁员</span>
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.arbitratorTwo" :disabled="form.editableText.split(',').indexOf('arbitratorTwo') < 0" placeholder="输入仲裁员..." />
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.arbitratorThree" :disabled="form.editableText.split(',').indexOf('arbitratorThree') < 0" placeholder="输入仲裁员..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>仲裁结果</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" :autosize="{minRows: 5,maxRows: 7}" type="textarea" v-model="form.arbitrationResult" :disabled="form.editableText.split(',').indexOf('arbitrationResult') < 0" placeholder="输入仲裁结果..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span>秘书建议</span>
            </td>
            <td class="tdb tdl w300" colspan="2">
              <div>
                <div>
                  <Input v-model="form.secApprovalContent" :autosize="{minRows: 5,maxRows: 7}" :disabled="form.editableText.split(',').indexOf('secApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
            <td class="tdb tdl tc w120" rowspan="2">
              <span>仲裁处意见</span>
            </td>
            <td class="tdb tdl w300" colspan="2">
              <div>
                <div>
                  <Input v-model="form.groupApprovalContent" :autosize="{minRows: 5,maxRows: 7}" :disabled="form.editableText.split(',').indexOf('groupApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50" colspan="2">
              <div>
                <Row>
                  <Col span="3">
                    <b>秘书：</b>
                  </Col>
                  <Col span="4" class="">
                    <img :src="form.secNamePath" class="_img" v-show="form.secNamePath !== ''">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.secApprovalTime }}</span>
                  </Col>
                </Row>
              </div>
            </td>
            <td class="tdb tdl _h50 lh50" colspan="2">
              <div>
                  <Row>
                    <Col span="3">
                      <b>处长：</b>
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
              <span>主任批示</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <div>
                <div>
                  <Input v-model="form.dirApprovalContent" :autosize="{minRows: 5,maxRows: 7}" :disabled="form.editableText.split(',').indexOf('dirApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50" colspan="6">
              <div>
                  <Row>
                    <Col span="3">
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
            <td class="tc" >
              <span>备注</span>
            </td>
            <td class="tdl" colspan="6">
              <Input class="_input" :autosize="{minRows: 5,maxRows: 7}" v-model="form.remark" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
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
      axios.post('/approvalForm/querySettleApprovalData', {
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
          type: '23',
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
            formType: 'closecase',
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
@import "@/style/mixin.scss";
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
