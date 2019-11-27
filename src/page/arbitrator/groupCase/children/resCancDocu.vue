<template>
  <div class="resCancDocu">
    <create-docu :alertShow="alertShow" :isSeeBtn="true" @alertConfirm="alertSave('docuSave')" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16" class="lh32">
          <RadioGroup v-model="resData.docuType">
            <Radio :label="6" disabled>撤案决定书(申请人庭审未出庭)</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书来源：</b></p>
        </Col>
        <Col span="16" class="_radio">
          <RadioGroup v-model="resData.source">
            <Radio :label="1">结案模版</Radio>
            <Radio :label="2">文件上传</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resData.source === 1">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>选择模版：</b></p>
        </Col>
        <Col span="12">
          <Select v-model="resData.endNewTempCode">
            <Option v-if="item.tempDocumentType === resData.docuType" v-for="item in resData.endNewTempList" :value="item.tempCode" :key="item.tempCode">{{ item.tempName }}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Button size="default" @click="alertSave('seeSave')">预览</Button>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resData.source === 2">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文件上传：</b></p>
        </Col>
        <Col span="16">
          <auto-upload-book v-if="resData.fileData === null" :childName="null" :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
          <p v-if="resData.fileData !== null" class="_input">
            <span class="hand" :title="resData.fileData.filename" @click="seeFile(resData.fileData.filepath)">{{resData.fileData.filename.length > 18 ? resData.fileData.filename.substr(0, 15) + '...' : resData.fileData.filename}}</span><Icon @click="delFile" class="_del hand ml10" type="md-close-circle"></Icon>
          </p>
        </Col>
      </Row>
    </create-docu>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import autoUploadBook from '@/components/common/autoUploadBook'
import createDocu from '@/components/common/createDocu'
import regi from '@/config/regiType.js'

export default {
  name: 'res_canc_docu',
  mixins: [resMess],
  props: ['resCaseId'],
  components: { createDocu, autoUploadBook },
  data () {
    return {
      alertShow: true,
      resData: {
        source: 1,
        fileData: null,
        docuType: 6,
        endNewTempList: [],
        endNewTempCode: ''
      }
    }
  },
  created () {
    this.resList()
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/file/upload'
    }
  },
  methods: {
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
        _url = '/batchCaseDocument/addCaseDecisionDocument'
      } else if (type === 'seeSave') {
        _url = '/batchCaseDocument/findPreviewCaseDocument'
      }
      if (type === 'docuSave' && this.resData.source === 1 && (this.resData.endNewTempCode === '' || this.resData.endNewTempCode === undefined)) {
        this.resMessage('warning', '请选择模版')
      } else if (this.resData.source === 2 && this.resData.fileData === null) {
        this.resMessage('warning', '请先上传文书')
      } else {
        let _o = {}
        _o[this.resCaseId] = this.resData.source === 1 ? this.resData.endNewTempCode : this.resData.fileData.id + ''
        axios.post(_url, {
          documentSource: this.resData.source,
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
    },
    delFile () {
      this.resData.fileData = null
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    saveDoucId (_obj) {
      this.resData.fileData = _obj
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
