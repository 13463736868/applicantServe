<template>
  <div class="resReveDocu">
    <create-docu :alertShow="alertShow" @alertConfirm="alertSave('docuSave')" @alertSee="alertSave('seeSave')" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.contractName"></Input>
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
  name: 'resReveDocu',
  mixins: [resMess],
  props: ['resCaseId'],
  components: { createDocu },
  data () {
    return {
      alertShow: true,
      resData: {
        docuType: 4,
        contractName: ''
      }
    }
  },
  methods: {
    alertSave (type) {
      let _url = ''
      if (type === 'docuSave') {
        _url = '/case/addDocumentFile'
      } else if (type === 'seeSave') {
        _url = '/case/previewDocumentFile'
      }
      if (this.resData.contractName === '') {
        this.resMessage('error', '请填写合同名称')
      } else {
        axios.post(_url, {
          caseId: this.resCaseId,
          documentType: this.resData.docuType,
          jsonData: JSON.stringify({contractName: this.resData.contractName})
        }).then(res => {
          if (type === 'docuSave') {
            this.resMessage('success', '操作成功')
            this.$emit('alertConfirm')
          } else if (type === 'seeSave') {
            window.open(res.data.data.filepath, '_blank')
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
