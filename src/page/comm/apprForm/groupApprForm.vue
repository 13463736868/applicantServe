<template>
  <div class="groupForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox f14" v-if="form !== null">
        <table border="0" width="100%" cellSpacing="0">
          <caption class="f35 h60 lh60">
            <p>仲 裁 庭 组 成 审 批 表</p>
          </caption>
          <caption class="tr f16 h60 lh60">青仲组庭字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="tdb tc w120">
              <span>申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>被申请人</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>案由</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入案由..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>争议标的额</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.money" :disabled="form.editableText.split(',').indexOf('money') < 0" placeholder="请输入争议的额..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>当事人组庭选定情况</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <div>
                <div>
                  <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.groupSelectionContent" :disabled="form.editableText.split(',').indexOf('groupSelectionContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span>副处长建议人选</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <div>
                <div>
                  <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.groupApprovalContent" :disabled="form.editableText.split(',').indexOf('groupApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50" colspan="6">
              <div>
                <Row class="">
                  <Col span="3">
                    <b>副处长：</b>
                  </Col>
                  <Col span="4" class="">
                    <img class="_img" :src="form.groupNamePath" v-show="form.groupNamePath !== ''">
                  </Col>
                  <Col span="8" offset="7">
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
                  <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.dirApprovalContent" :disabled="form.editableText.split(',').indexOf('dirApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50" colspan="6">
              <div>
                <Row class="">
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
              <span>备注</span>
            </td>
            <td class="tdl" colspan="6">
              <Input :autosize="{minRows: 4,maxRows: 5}" v-model="form.remark" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">返回</Button>
        <Button type="primary" size="large" @click="alertConfirm">保存</Button>
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
      axios.post('/approvalForm/queryGroupApprovalData', {
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
    alertConfirm () {
      if (this.switchObj) {
        return false
      }
      this.switchObj = true
      axios.post('/approvalForm/saveData', {
        caseId: this.caseId,
        type: '22',
        jsonData: JSON.stringify(this.form)
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
