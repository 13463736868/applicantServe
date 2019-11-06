<template>
  <div v-if="alertShow">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16" class="lh32">
          <RadioGroup v-model="objShow.docuType">
            <Radio :label="4" disabled>撤案决定书（组庭前）</Radio>
            <Radio :label="5" disabled>撤案决定书（组庭后）</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>选择模版：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="objShow.endNewTempCode">
            <Option v-if="item.tempDocumentType === objShow.docuType" v-for="item in objShow.endNewTempList" :value="item.tempCode" :key="item.tempCode">{{ item.tempName }}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'alert_withdraw_info',
  components: { alertBtnInfo },
  props: [ 'withdrawInfoId', 'withdrawType' ],
  data () {
    return {
      alertShow: true,
      objShow: {
        docuType: null,
        endNewTempCode: '',
        endNewTempList: []
      }
    }
  },
  created () {
    if (this.withdrawType) {
      this.objShow.docuType = parseInt(this.withdrawType)
      this.resAllTemplateList()
    }
  },
  methods: {
    resAllTemplateList () {
      axios.post('/caseType/findAllTemplate').then(res => {
        this.objShow.endNewTempList = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertSave () {
      if (this.objShow.endNewTempCode === '' || this.objShow.endNewTempCode === undefined) {
        this.$Message.warning({
          content: '请选择模版',
          duration: 5
        })
      } else {
        let _o = {}
        _o[this.withdrawInfoId] = this.objShow.endNewTempCode
        axios.post('/batchCaseDocument/decisionDocument', {
          documentType: this.objShow.docuType,
          caseDocumentDataJson: JSON.stringify([_o])
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
    alertCanc () {
      this.$emit('alertCancel')
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
