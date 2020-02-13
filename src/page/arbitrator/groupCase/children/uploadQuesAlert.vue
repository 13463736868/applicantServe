<template>
  <div>
    <alert-btn-info :isCancBtn="true" :isSaveBtn="true" :alertShow="alertShow" alertTitle="操作">
      <div class="pr _uploadQuesAlert">
        <spin-comp :spinShow="spinShow">
          <div v-if="progressText !== null" v-text="progressText"></div>
        </spin-comp>
        <Row>
          <Col span="24">
            <Row class="_labelFor">
              <Col span="24" class="_label"><span v-text="childName"></span><b class="_b">*</b></Col>
              <Col span="24">
                <Upload
                  ref="upload"
                  name="file"
                  type="drag"
                  :action="uploadUrl"
                  :with-credentials="true"
                  :show-upload-list="false"
                  :format="fileType"
                  :max-size="204800"
                  :data="resData"
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
            </Row>
            <Row class="_labelFor">
              <Col span="24" class="_label"><p>问题描述：</p></Col>
              <Col span="24">
                <Input :autosize="{minRows: 5,maxRows: 7}" v-model="resData.remark" type="textarea" placeholder="输入问题描述..." />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="pt15">
          <Col class="tc" span="10" offset="1"><button class="_cancelBtn" @click="alertCanc">取 消</button></Col>
          <Col class="tc" span="10" offset="2"><button class="_saveBtn" :class="{'_disabled':addFileBtn}" v-bind:disabled="addFileBtn" @click="alertSave">上 传</button></Col>
        </Row>
      </div>
    </alert-btn-info>
  </div>
</template>
<script>
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'
import regi from '@/config/regiType.js'

export default {
  name: 'upload_ques_alert',
  mixins: [resMess],
  components: { spinComp, alertBtnInfo },
  props: ['resCaseId'],
  data () {
    return {
      alertShow: true,
      spinShow: false,
      progressText: '',
      childName: '上传问题清单',
      fileType: ['pdf'],
      resData: {
        remark: ''
      },
      fileObj: null
    }
  },
  computed: {
    uploadUrl () {
      if (this.resCaseId.length === 1) {
        return regi.api + '/caseImport/uploadQuestionList'
      } else {
        return regi.api + '/caseImport/uploadQuestionListBatch'
      }
    },
    addFileBtn () {
      if (this.fileObj === null) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    resFormError (file) {
      this.spinShow = false
      this.fileObj = null
      this.resMessage('error', '文件格式错误只支持 ' + this.fileType)
    },
    resSzieError (file) {
      this.spinShow = false
      this.fileObj = null
      this.resMessage('error', '文件不能超过200MB')
    },
    resBefoUpload (file) {
      this.fileObj = file
      return false
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
      if (res.flag === false) {
        this.resMessage('error', '错误信息:' + res.message + '')
      } else {
        this.$Message.success({
          content: '文件上传成功',
          duration: 1,
          onClose: () => {
            setTimeout(() => {
              this.$emit('alertConfirm')
            })
          }
        })
      }
    },
    resError (error, file) {
      this.spinShow = false
      this.fileObj = null
      this.resMessage('error', '错误信息:' + error.status + ' 稍后再试')
    },
    alertSave () {
      this.spinShow = true
      if (this.resCaseId.length === 1) {
        this.resData.caseId = this.resCaseId
      } else {
        this.resData.caseIds = this.resCaseId.join(',')
      }
      this.$refs.upload.post(this.fileObj)
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
._uploadQuesAlert {
  @include borderRadius(3px);
  padding: 0 15px;
  background: #fff;
  font-size: 12px;
  ._labelFor {
    ._label {
      padding: 5px 0;
      ._b {
        color: #ff7a7a;
        margin-left: 5px;
        vertical-align: sub;
      }
      ._enDow {
        color: #337BB5
      }
    }
    ._text {
      padding: 30px 0;
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
  ._labelFor {
    margin-bottom: 10px;
    p {
      padding: 7px 0;
    }
    ._span {
      color: #ff7a7a;
    }
  }
}
</style>
