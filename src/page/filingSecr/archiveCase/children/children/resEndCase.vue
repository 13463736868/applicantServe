<template>
  <div class="resEndCase">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="16" offset="7" class="_radio">
          <RadioGroup v-model="source">
            <Radio :label="1">上传裁决书</Radio>
            <Radio :label="2">不上传裁决书</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <template v-if="source === 1">
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <div class="_label"><span class="_span">*</span><b>文书类型：</b></div>
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
            <div class="_label"><span class="_span"></span><b>选择仲裁员：</b></div>
          </Col>
          <Col span="13">
            <Select v-model="resData.abriVal">
              <Option v-for="item in resData.abri" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <div class="_label"><span class="_span">*</span><b>文件上传：</b></div>
          </Col>
          <Col span="16">
            <auto-upload-book v-if="fileData === null" :childName="null" :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
            <p v-if="fileData !== null" class="_input">
              <span class="hand" :title="fileData.filename" @click="seeFile(fileData.filepath)">{{fileData.filename.length > 18 ? fileData.filename.substr(0, 15) + '...' : fileData.filename}}</span><Icon @click="delFile" class="_del hand ml10" type="md-close-circle"></Icon>
            </p>
          </Col>
        </Row>
      </template>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import autoUploadBook from '@/components/common/autoUploadBook'
import regi from '@/config/regiType.js'

export default {
  name: 'resEndCase',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo, autoUploadBook },
  data () {
    return {
      alertShow: true,
      docuType: 1,
      source: 1,
      resData: {
        abriVal: null,
        abri: []
      },
      fileData: null
    }
  },
  created () {
    this.resGetData()
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/file/upload'
    }
  },
  methods: {
    resGetData () {
      axios.post('/clientRequest/findUsersList', {
        pageIndex: 0,
        pageSize: 999,
        roleName: 'arbitrator'
      }).then(res => {
        this.resData.abri = res.data.data.dataList === null ? [] : res.data.data.dataList
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.source === 1 && this.fileData === null) {
        this.resMessage('warning', '请先上传文件')
        return false
      } else {
        axios.post('/casesUnderLine/closeCaseUnderLine', {
          caseId: this.resPropsData.id,
          fileFlag: this.source,
          arbitratorId: this.resData.abriVal,
          fileType: this.docuType,
          fileId: this.source === 1 ? this.fileData.id : null
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
  ._label {
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
