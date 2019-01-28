<template>
  <div class="pr _uploadApplBook">
    <spin-comp :spinShow="spinShow">
      <div v-if="progressText !== null" v-text="progressText"></div>
    </spin-comp>
    <Row>
      <Col span="22" offset="1">
        <Row class="_labelFor">
          <Col span="12" class="_label">批量导入用户<b class="_b">*</b></Col>
          <Col span="12" class="_label tr"><span class="_enDow hand" @click="dowDoc"><Icon class="mr5" type="md-download" size="16" color="#ff7a7a"/>批量导入用户模版下载</span></Col>
          <Col span="24">
            <Upload
              ref="upload"
              name="file"
              type="drag"
              :action="uploadUrl"
              :with-credentials="true"
              :show-upload-list="false"
              :format="fileType"
              :max-size="10240"
              :data="data"
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
      <Col class="tc" span="10" offset="2"><button class="_saveBtn" :class="{'_disabled':addFileBtn}" v-bind:disabled="addFileBtn" @click="saveClick">上 传</button></Col>
    </Row>
  </div>
</template>

<script>
import spinComp from '@/components/common/spin'

export default {
  name: 'upload_appl_book',
  components: { spinComp },
  props: ['uploadUrl', 'fileType'],
  data () {
    return {
      spinShow: false,
      progressText: null,
      emInfo: {
        status: 0,
        text: ''
      },
      data: {},
      fileObj: null
    }
  },
  computed: {
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
      this.$Message.error({
        content: '文件格式错误只支持 ' + this.fileType,
        duration: 5
      })
    },
    resSzieError (file) {
      this.spinShow = false
      this.$Message.error({
        content: '文件不能超过10MB',
        duration: 5
      })
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
        this.$Message.error({
          content: '错误信息:' + res.message + '',
          duration: 5
        })
      } else {
        this.$Message.success({
          content: '文件上传成功',
          duration: 1,
          onClose: () => {
            setTimeout(() => {
              this.$emit('saveClick', file.response.data)
            })
          }
        })
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
      this.spinShow = true
      this.$refs.upload.post(this.fileObj)
    },
    cancClick () {
      this.$emit('cancClick')
    },
    dowDoc () {
      this.$emit('dowDoc')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._uploadApplBook {
  @include borderRadius(3px);
  @include boxShadow(0 1px 6px -1px #bbb);
  margin-top: 10px;
  padding: 15px;
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
}
</style>
