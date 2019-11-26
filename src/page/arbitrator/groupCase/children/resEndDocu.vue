<template>
  <div class="resEndCase">
    <create-docu :alertShow="alertShow" :isSeeBtn="true" @alertConfirm="resAction('docuSave')" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16" class="_radio">
          <RadioGroup v-model="docuType" @on-change="resAction('docuType')">
            <Radio :label="1">裁决书</Radio>
            <Radio :label="2">调解书</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书来源：</b></p>
        </Col>
        <Col span="16" class="_radio">
          <RadioGroup v-model="source" @on-change="resAction('source')">
            <Radio :label="1">结案模版</Radio>
            <Radio :label="2">文件上传</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="source === 1">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>结案模版：</b></p>
        </Col>
        <Col span="13">
          <Select v-model="resData.endNewTempCode">
            <Option v-if="item.tempDocumentType === docuType" v-for="item in tempList" :value="item.tempCode" :key="item.tempCode">{{ item.tempName }}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Button size="default" @click="resAction('seeDocu')">预览</Button>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="source === 2">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文件上传：</b></p>
        </Col>
        <Col span="16">
          <auto-upload-book v-if="fileData === null" :childName="null" :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
          <p v-if="fileData !== null" class="_input">
            <span class="hand" :title="fileData.filename" @click="seeFile(fileData.filepath)">{{fileData.filename.length > 18 ? fileData.filename.substr(0, 15) + '...' : fileData.filename}}</span><Icon @click="delFile" class="_del hand ml10" type="md-close-circle"></Icon>
          </p>
        </Col>
      </Row>
    </create-docu>
  </div>
</template>
<script>
import axios from 'axios'
import createDocu from '@/components/common/createDocu'
import { resMess } from '@/components/common/mixin.js'
import autoUploadBook from '@/components/common/autoUploadBook'
import regi from '@/config/regiType.js'

export default {
  name: 'res_end_case',
  mixins: [resMess],
  props: ['resVal'],
  components: { createDocu, autoUploadBook },
  data () {
    return {
      alertShow: true,
      docuType: 1,
      source: 1,
      tempList: null,
      resData: null,
      fileData: null
    }
  },
  created () {
    this.resTmepList()
    if (this.resVal !== null) {
      this.resData = JSON.parse(JSON.stringify(this.resVal))
    }
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/file/upload'
    }
  },
  methods: {
    resTmepList () {
      axios.post('/caseType/findAllTemplate').then(res => {
        this.tempList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resAction (type) {
      switch (type) {
        case 'docuType':
          this.resData.endNewTempCode = ''
          break
        case 'docuSave':
          if (this.source === 1 && (this.resData.endNewTempCode === '' || this.resData.endNewTempCode === undefined || this.resData.endNewTempCode === null)) {
            this.resMessage('warning', '请选择结案模版')
          } else if (this.source === 2 && this.fileData === null) {
            this.resMessage('warning', '请先上传文书')
          } else {
            let _o = {}
            _o[this.resData.id] = this.source === 1 ? this.resData.endNewTempCode : this.fileData.id + ''
            axios.post('/batchCaseDocument/addCaseDocument', {
              documentType: this.docuType,
              documentSource: this.source,
              caseDocumentDataJson: JSON.stringify([_o])
            }).then(res => {
              this.resMessage('success', '操作成功')
              this.$emit('alertConfirm')
            }).catch(e => {
              this.resMessage('error', '错误信息:' + e + ' 稍后再试')
            })
          }
          break
        case 'seeDocu':
          if (this.resData.endNewTempCode === '' || this.resData.endNewTempCode === undefined || this.resData.endNewTempCode === null) {
            this.resMessage('warning', '请选择结案模版')
          } else {
            let _o = {}
            _o[this.resData.id] = this.resData.endNewTempCode
            axios.post('/batchCaseDocument/findPreviewCaseDocument', {
              documentType: this.docuType,
              caseDocumentDataJson: JSON.stringify([_o])
            }).then(res => {
              window.open(res.data.data, '_blank')
            }).catch(e => {
              this.resMessage('error', '错误信息:' + e + ' 稍后再试')
            })
          }
          break
      }
    },
    alertSave () {
      if (this.fileData.id === null) {
        this.resMessage('warning', '请先上传文件')
        return false
      } else {
        axios.post('/approve/reload/document', {
          caseDocuemntId: this.resDocuId,
          fileId: this.fileData.id
        }).then(res => {
          this.resMessage('success', '操作成功')
          this.$emit('alertConfirm')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    alertCanc () {
      this.$emit('alertCancel')
    },
    delFile () {
      this.fileData = null
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    saveDoucId (_obj) {
      this.fileData = _obj
    }
  }
}
</script>
<style lang="scss" scoped>
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
  ._input {
    padding: 7px 0;
    color: #337BB5;
    ._del {
      font-size: 14px;
      color: #ff7a7a;
      vertical-align: text-bottom;
    }
  }
}
._radio {
  padding: 7px 0;
}
</style>
