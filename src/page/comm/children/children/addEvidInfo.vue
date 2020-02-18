<template>
  <div class="pr _addEvidInfo">
    <spin-comp :spinShow="spinShow">
      <div v-if="progressText !== null" v-text="progressText"></div>
    </spin-comp>
    <Row>
      <Col span="22" offset="1">
        <Row class="_labelFor">
          <Col span="4" class="_label">证据项名称<b class="_b">*</b></Col>
          <Col span="16" class="_input"><input type="text" v-model="data.name"></Col>
          <Col span="16" offset="4" class="_em"><span v-show="emInfo.status===1" v-text="emInfo.text"></span></Col>
        </Row>
        <Row class="_labelFor">
          <Col span="4" class="_label">有无原件<b class="_b">*</b></Col>
          <Col span="16" class="_radio">
            <RadioGroup v-model="data.state">
              <Radio :label="1">有</Radio>
              <Radio :label="2">无</Radio>
            </RadioGroup>
          </Col>
          <Col span="16" offset="4" class="_em"><span v-show="emInfo.status===2" v-text="emInfo.text"></span></Col>
        </Row>
        <Row class="_labelFor">
          <Col span="4" class="_label">证据项描述<b class="_b">*</b></Col>
          <Col span="16" class="_input"><input type="text" v-model="data.memo"></Col>
          <Col span="16" offset="4" class="_em"><span v-show="emInfo.status===3" v-text="emInfo.text"></span></Col>
        </Row>
        <Row class="_labelFor" v-if="fileList.length !== 0">
          <Col span="4" class="_label">已上传的文件<b class="_b">*</b></Col>
          <Col span="16" class="_input">
            <p span="12" class="_item" v-for="item in fileList" :key="item.id"><span class="hand" :title="item.filename" @click="seeFile(item.filepath)">{{item.filename.length > 50 ? item.filename.substr(0, 50) + '...' : item.filename}}</span><Icon @click="delFile(item.id)" class="_del hand" type="close-circled"></Icon></p>
          </Col>
          <Col span="16" offset="4" class="_em"><span v-show="emInfo.status===4" v-text="emInfo.text"></span></Col>
        </Row>
        <Row class="_labelFor">
          <Col span="24" class="_label">证据上传<b class="_b">*</b></Col>
          <Col span="24">
            <Upload
              multiple
              ref="upload"
              name="file"
              type="drag"
              :action="uploadFileUrl"
              :with-credentials="true"
              :show-upload-list="false"
              :format="fileType"
              :max-size="10240"
              :on-format-error="resFormError"
              :on-exceeded-size="resSzieError"
              :before-upload="resBefoUpload"
              :on-progress="resProgress"
              :on-success="resSuccess"
              :on-error="resError"
            >
              <div class="_text">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p v-if="fileObj === null" v-text="'上传类型只支持 '+fileType"></p>
                  <div v-if="fileObj !== null" v-text="fileObj.name"></div>
              </div>
            </Upload>
          </Col>
          <Col span="24" class="_em"><span v-show="emInfo.status===2" v-text="emInfo.text"></span></Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col class="tc" span="10" offset="1"><button class="_cancelBtn" @click="cancClick">取 消</button></Col>
      <Col class="tc" span="10" offset="2"><button class="_saveBtn" :class="{'_disabled':addFileBtn}" v-bind:disabled="addFileBtn" @click="saveClick">保 存</button></Col>
    </Row>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'

export default {
  name: 'add_evid_info',
  components: { spinComp },
  props: ['caseId', 'partieType', 'uploadUrl', 'uploadFileUrl', 'fileType'],
  data () {
    return {
      spinShow: false,
      progressText: null,
      emInfo: {
        status: 0,
        text: ''
      },
      data: {
        partyType: this.partieType,
        id: this.caseId,
        name: '',
        state: null,
        memo: ''
      },
      addBtnSwt: false,
      fileList: [],
      fileIdList: [],
      fileObj: null
    }
  },
  computed: {
    addFileBtn () {
      if (this.fileList.length === 0 || this.data.name === '' || this.data.state === null || this.data.state === 2 || this.data.memo === '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    delFile (id) {
      for (let k in this.fileList) {
        if (this.fileList[k].id === id) {
          this.fileList.splice(k, 1)
          this.$Message.success({
            content: '删除成功',
            duration: 2
          })
          return
        }
      }
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    resFormError (file) {
      this.spinShow = false
      this.$Message.error({
        content: '文件格式错误只支持 ' + this.fileType,
        duration: 5
      })
      this.fileObj = null
    },
    resSzieError (file) {
      this.spinShow = false
      this.$Message.error({
        content: '文件不能超过10MB',
        duration: 5
      })
      this.fileObj = null
    },
    resBefoUpload (file) {
      this.fileObj = file
      this.spinShow = true
    },
    resProgress (event, file) {
      let _percent = event.percent
      if (_percent === 100) {
        this.progressText = 99 + '%'
      } else {
        this.progressText = Math.floor(event.percent) + '%'
      }
    },
    resSuccess (res, file) {
      this.progressText = '100%'
      this.fileObj = null
      this.spinShow = false
      if (this.fileIdList.indexOf(file.response.data.id) === -1) {
        this.fileList.push(file.response.data)
        this.fileIdList.push(file.response.data.id)
      }
    },
    resError (error, file) {
      this.spinShow = false
      this.$Message.error({
        content: '错误信息:' + error.status + ' 稍后再试',
        duration: 5
      })
    },
    saveClick () {
      if (this.addBtnSwt) {
        return false
      }
      this.addBtnSwt = true
      axios.post(this.uploadUrl, {
        partyType: this.partieType,
        // id: this.caseId,
        caseid: this.caseId,
        name: this.data.name,
        state: this.data.state,
        memo: this.data.memo,
        fileIds: this.fileIdList.join(',')
      }).then(res => {
        this.$Message.success({
          content: '文件上传成功',
          duration: 1,
          onClose: () => {
            this.addBtnSwt = false
            setTimeout(() => {
              this.$emit('saveClick')
            })
          }
        })
      }).catch(e => {
        this.addBtnSwt = false
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    cancClick () {
      this.$emit('cancClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._addEvidInfo {
  @include borderRadius(3px);
  @include boxShadow(0 1px 6px -1px #bbb);
  margin-top: 10px;
  padding: 15px;
  background: #fff;
  font-size: 12px;
  ._labelFor {
    ._del {
      color: #ff7a7a;
      margin-left: 10px;
    }
    ._item {
      color: #126eaf;
      height: 29px;
      line-height: 29px;
    }
    ._label {
      padding: 5px 0;
      ._b {
        color: #ff7a7a;
        margin-left: 5px;
        vertical-align: middle;
      }
    }
    ._text {
      padding: 30px 0;
    }
    ._input {
      border-bottom:1px solid #ddd;
      input {
        width: 100%;
        border: none;
        letter-spacing: 1px;
        font-size: 12px;
        color: #666;
        height: 29px;
        line-height: 29px;
        background: transparent;
      }
      input:focus {
        box-shadow: none;
        outline: 0px;
      }
    }
    ._radio {
      height: 29px;
      line-height: 29px;
    }
    ._em {
      height: 16px;
      line-height: 16px;
      color: #ff7a7a;
      font-size: 8px;
      span {
        float: right;
      }
    }
  }
  ._cancelBtn {
    @include btn(#fff, 90px, 14px, 32px);
    @include boxShadow(0 1px 6px -1px #bbb);
    @include borderRadius(4px);
    color: #126eaf;
  }
  ._saveBtn {
    @include btn(#126eaf, 90px, 14px, 32px);
    @include boxShadow(0 1px 6px -1px #bbb);
    @include borderRadius(4px);
  }
  ._saveBtn._disabled {
    @include btn(#ccc, 90px, 14px, 32px);
  }
  ._cancelBtn:focus,._saveBtn:focus {
    outline: 0px;
  }
}
</style>
