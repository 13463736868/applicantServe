<template>
  <div class="resEndDocu">
    <create-docu :alertShow="alertShow" @alertConfirm="alertSave('docuSave')" @alertSee="alertSave('seeSave')" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16">
          <RadioGroup v-model="resData.docuType" @on-change="resChange">
            <Radio :label="1">裁决书</Radio>
            <Radio :label="2">调解书</Radio>
            <Radio :label="13">和解裁决书</Radio>
            <Radio :label="14">调解裁决书</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>结案模版：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="resData.endNewTempCode">
            <Option v-if="item.tempDocumentType === resData.docuType" v-for="item in resData.endNewTempList" :value="item.tempCode" :key="item.tempCode">{{ item.tempName }}</Option>
          </Select>
        </Col>
      </Row>
    </create-docu>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import createDocu from '@/components/common/createDocu'

export default {
  name: 'resEndDocu',
  mixins: [resMess],
  props: ['resCaseId', 'resTempCode'],
  components: { createDocu },
  data () {
    return {
      alertShow: true,
      resData: {
        docuType: 1,
        endNewTempList: [],
        endNewTempCode: ''
      }
    }
  },
  created () {
    this.resData.endNewTempCode = this.resTempCode
    this.resList()
  },
  methods: {
    resChange () {
      this.resData.endNewTempCode = ''
    },
    resList () {
      axios.post('/caseType/findAllTemplate').then(res => {
        this.resData.endNewTempList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave (type) {
      let _url = ''
      if (type === 'docuSave') {
        _url = '/batchCaseDocument/addCaseDocument'
      } else if (type === 'seeSave') {
        _url = '/batchCaseDocument/findPreviewCaseDocument'
      }
      if (this.resData.endNewTempCode === '' || this.resData.endNewTempCode === undefined) {
        this.resMessage('warning', '请选择结案模版')
      } else {
        let _o = {}
        _o[this.resCaseId] = this.resData.endNewTempCode
        axios.post(_url, {
          documentType: this.resData.docuType,
          caseDocumentDataJson: JSON.stringify([_o])
        }).then(res => {
          if (type === 'docuSave') {
            this.resMessage('success', '操作成功')
            this.$emit('alertConfirm')
          } else if (type === 'seeSave') {
            window.open(res.data.data, '_blank')
          }
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
