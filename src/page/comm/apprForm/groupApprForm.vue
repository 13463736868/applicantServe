<template>
  <div class="groupForm">
    <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="1000">
      <div class="tableBox" v-if="form !== null">
        <table border="1" width="100%">
          <caption class="title">
            <p>仲 裁 庭 组 成 审 批 表</p>
          </caption>
          <caption class="rightDe">青仲组庭字({{form.codeYear}})第{{form.codeNum}}号</caption>
          <tr>
            <td class="h70 w120" >
              <span>申请人</span>
            </td>
            <td class="h70" colspan="6">
              <Input v-model="form.propName" :disabled="form.editableText.split(',').indexOf('propName') < 0" placeholder="请输入申请人..." />
            </td>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>被申请人</span>
            </td>
            <td class="h70" colspan="6">
              <Input v-model="form.repoName" :disabled="form.editableText.split(',').indexOf('repoName') < 0" placeholder="请输入被申请人..." />
            </td>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>案由</span>
            </td>
            <td class="h70" colspan="6">
              <Input v-model="form.disputeType" :disabled="form.editableText.split(',').indexOf('disputeType') < 0" placeholder="请输入案由..." />
            </td>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>争议标的额</span>
            </td>
            <td class="h70" colspan="6">
              <Input v-model="form.money" :disabled="form.editableText.split(',').indexOf('money') < 0" placeholder="请输入争议的额..." />
            </td>
          </tr>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>当事人组庭选定情况</span>
            </td>
            <td class="h180" colspan="6">
              <div style="height:100%">
                <div style="height:75%">
                  <Input v-model="form.groupSelectionContent" :disabled="form.editableText.split(',').indexOf('groupSelectionContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
                <div style="height:25%">
                  <Row class="_labelFor">
                    <Col class="tl" span="3">
                      <b class="pl10">秘书：</b>
                    </Col>
                    <Col span="4" class="tl">
                      <img :src="form.secNamePath" class="h30" v-show="form.secNamePath !== ''">
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
            <td class="h70 w120" >
              <span>组庭专员意见</span>
            </td>
            <td class="h150" colspan="6">
              <div style="height:100%">
                <div style="height:70%">
                  <Input v-model="form.groupApprovalContent" :disabled="form.editableText.split(',').indexOf('groupApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
                <div style="height:30%">
                  <Row class="_labelFor">
                    <Col span="3">
                      <b>组庭专员：</b>
                    </Col>
                    <Col span="4" class="tl">
                      <img :src="form.groupNamePath" v-show="form.groupNamePath !== ''" class="h30">
                    </Col>
                    <Col span="8" offset="7">
                      <span>{{form.groupApprovalTime}}</span>
                    </Col>
                  </Row>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>主任批示</span>
            </td>
            <td class="h150" colspan="6">
              <div style="height:100%">
                <div style="height:70%">
                  <Input v-model="form.dirApprovalContent" :disabled="form.editableText.split(',').indexOf('dirApprovalContent') < 0" type="textarea" placeholder="请输入意见..."/>
                </div>
                <div style="height:30%">
                  <Row class="_labelFor">
                    <Col span="2">
                      <b>主任：</b>
                    </Col>
                    <Col span="4">
                      <img :src="form.dirNamePath" v-show="form.dirNamePath !== ''" class="h30">
                    </Col>
                    <Col span="8" offset="8">
                      <span>{{form.dirApprovalTime}}</span>
                    </Col>
                  </Row>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="h70 w120" >
              <span>备注</span>
            </td>
            <td class="h70" colspan="6">
              <Input v-model="form.remark" type="textarea" :disabled="form.editableText.split(',').indexOf('remark') < 0" placeholder="请输入备注..." />
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
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
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
  p {
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
  height: 100% !important;
  border: 0 !important;
  font-size: 14px;
}
.tableBox .ivu-input-wrapper-default {
  height: 100% !important;
}
.ivu-input[disabled]{
  color: black
}

.tableBox ._labelFor {
  height: 40px;
  /* margin-bottom: 10px; */
  line-height: 30px;
  .ivu-col-span-2,.ivu-col-span-4,.ivu-col-span-8{
    padding-top: 2px
  }
}
</style>
