<template>
  <div class="resAvoid">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p class="pt7 pb7">回避内容：</p>
        </Col>
        <Col span="16">
          <Input v-model.trim="resData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入回避内容..." />
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p class="pt7 pb7">回避附件：</p>
        </Col>
        <Col span="16" v-if="fileObj !== null">
          <p class="_item"><span class="hand" :title="fileObj.filename" @click="seeFile(fileObj.filepath)">{{fileObj.filename.length > 20 ? fileObj.filename.substr(0, 20) + '...' : fileObj.filename}}</span><Icon size="16" @click="delFile(fileObj.id)" class="_del hand" type="md-close-circle"></Icon></p>
        </Col>
        <Col span="16" v-if="fileObj === null">
          <auto-upload-book :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveFile"></auto-upload-book>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import autoUploadBook from '@/components/common/autoUploadBook'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import regi from '@/config/regiType.js'

export default {
  name: 'resAvoid',
  mixins: [resMess],
  props: ['resCaseId'],
  components: { autoUploadBook, alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        reason: ''
      },
      fileObj: null
    }
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/file/upload'
    }
  },
  methods: {
    seeFile (path) {
      window.open(path, '_blank')
    },
    delFile () {
      this.fileObj = null
    },
    saveFile (obj) {
      this.fileObj = obj
    },
    alertSave () {
      if (this.resData.reason === '') {
        this.resMessage('error', '请输入回避内容')
        return false
      }
      if (this.fileObj === null) {
        this.resMessage('error', '请上传回避附件')
        return false
      }
      axios.post('/approve/addAvoidRequestAppoverOfArbitrators', {
        id: this.resCaseId,
        reason: this.resData.reason,
        fileId: this.fileObj.id
      }).then(res => {
        this.$emit('alertConfirm')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
._labelFor {
  margin-bottom: 20px;
  ._del {
    color: #ff7a7a;
    margin-left: 10px;
  }
  ._item {
    color: #126eaf;
    padding: 8px 0;
  }
}
</style>
