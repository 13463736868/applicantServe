<template>
  <div class="resUploadDoc">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书上传：</b></p>
        </Col>
        <Col span="16">
          <auto-upload-book v-if="fileData === null" :childName="null" :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
          <p v-if="fileData !== null" class="_input">
            <span class="hand" :title="fileData.filename" @click="seeFile(fileData.filepath)">{{fileData.filename.length > 18 ? fileData.filename.substr(0, 15) + '...' : fileData.filename}}</span><Icon @click="delFile" class="_del hand ml10" type="md-close-circle"></Icon>
          </p>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'
import autoUploadBook from '@/components/common/autoUploadBook'
import regi from '@/config/regiType.js'

export default {
  name: 'resUploadDoc',
  mixins: [resMess],
  props: ['resVal'],
  components: { alertBtnInfo, autoUploadBook },
  data () {
    return {
      alertShow: true,
      resData: null,
      fileData: null
    }
  },
  created () {
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
    alertSave () {
      if (this.fileData.id === null) {
        this.resMessage('warning', '请先上传文件')
        return false
      } else {
        axios.post('/approve/updateCaseDocument', {
          fileId: this.fileData.id,
          documentId: this.resData.documentId
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
</style>
