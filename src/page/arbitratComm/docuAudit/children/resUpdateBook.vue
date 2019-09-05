<template>
  <div class="_resUpdateBook">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor" v-if="resData !== null">
        <Col span="5" class="_label">已上传的文件: </Col>
        <Col span="16" class="_input">
          <span class="hand" :title="resData.filename" @click="seeFile(resData.filepath)">{{resData.filename.length > 18 ? resData.filename.substr(0, 15) + '...' : resData.filename}}</span><Icon @click="delFile" class="_del hand ml10" type="md-close-circle"></Icon>
        </Col>
      </Row>
      <auto-upload-book v-if="resData === null" childName="更新文书" :fileType="['pdf']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
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
  name: 'res_update_book',
  mixins: [resMess],
  props: ['resDocuId'],
  components: { alertBtnInfo, autoUploadBook },
  data () {
    return {
      alertShow: true,
      resData: null
    }
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/file/upload'
    }
  },
  methods: {
    delFile () {
      this.resData = null
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    saveDoucId (_obj) {
      this.resData = _obj
    },
    alertSave () {
      if (this.resData.id === null) {
        this.resMessage('warning', '请先上传文件')
        return false
      } else {
        axios.post('/approve/reload/document', {
          caseDocuemntId: this.resDocuId,
          fileId: this.resData.id
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
    }
  }
}
</script>
<style lang="scss" scoped>
._labelFor {
  ._label {
    padding: 5px 0;
    ._b {
      color: #ff7a7a;
      margin-left: 5px;
      vertical-align: sub;
    }
  }
  ._input {
    padding: 5px 0;
    color: #337BB5;
    ._del {
      font-size: 14px;
      color: #ff7a7a;
      vertical-align: text-bottom;
    }
  }
}
</style>
