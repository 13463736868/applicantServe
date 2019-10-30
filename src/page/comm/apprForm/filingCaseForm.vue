<template>
  <div class="filingForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="0" width="100%" cellSpacing="0">
          <caption class="f35 h60 lh60">
            <p>立 案 审 批 表</p>
          </caption>
          <caption class="tr f16 h60 lh60">青仲互立字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="tdb tc w120">
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
              <Input class="_input" v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>案由</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入案由..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>请求事项</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input :autosize="{minRows: 4,maxRows: 5}" v-model="form.requestContent" type="textarea" :disabled="form.editableText.split(',').indexOf('requestContent') < 0" placeholder="请输入请求事项..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" >
              <span>争议标的额</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <Input class="_input" v-model="form.money" :disabled="form.editableText.split(',').indexOf('money') < 0" placeholder="请输入争议标的额..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc">
              <span>预收仲裁费</span>
            </td>
            <td class="tdb tdl w80 tc">
              <span>受理费</span>
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.accFee" :disabled="form.editableText.split(',').indexOf('accFee') < 0" placeholder="请输入受理费..." />
            </td>
            <td class="tdb tdl w80 tc">
              <span>处理费</span>
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.procFee" :disabled="form.editableText.split(',').indexOf('procFee') < 0" placeholder="请输入处理费..." />
            </td>
            <td class="tdb tdl w80 tc">
              <span>合计</span>
            </td>
            <td class="tdb tdl">
              <Input class="_input" v-model="form.cost" :disabled="form.editableText.split(',').indexOf('cost') < 0" placeholder="请输入合计费用..." />
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span>秘书建议</span>
            </td>
            <td class="tdb tdl" colspan="6">
              <div>
                <div>
                  <Input :autosize="{minRows: 5,maxRows: 7}" v-model="form.secApprovalContent" :disabled="form.editableText.split(',').indexOf('secApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tdl _h50 lh50" colspan="6">
              <div>
                <Row>
                  <Col span="2">
                    <b>秘书：</b>
                  </Col>
                  <Col span="4">
                    <img class="_img" :src="form.secNamePath" v-show="form.secNamePath !== ''">
                  </Col>
                  <Col span="8" offset="8">
                    <span>{{form.secApprovalTime}}</span>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tdb tc" rowspan="2">
              <span>受案处意见</span>
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
                <Row>
                  <Col span="2">
                    <b>处长：</b>
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
      axios.post('/approvalForm/queryUpcaseApprovalData', {
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
        type: '21',
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
