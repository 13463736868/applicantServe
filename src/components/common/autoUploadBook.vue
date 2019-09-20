<template>
  <div class="pr _autoUploadBook">
    <spin-comp :spinShow="spinShow">
      <div v-if="progressText !== null" v-text="progressText"></div>
    </spin-comp>
    <Row class="_labelFor">
      <Col span="12" class="_label" v-if="childName !== null"><span v-text="childName"></span><b class="_b">*</b></Col>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import spinComp from '@/components/common/spin'

export default {
  name: 'auto_upload_book',
  components: { spinComp },
  props: ['uploadUrl', 'fileType', 'childName'],
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
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
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
      this.data.userId = this.usersInfo.id
      this.data.userName = this.usersInfo.name
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
      if (res.flag === false) {
        this.$Message.error({
          content: '错误信息:' + res.message + '',
          duration: 5
        })
      } else {
        setTimeout(() => {
          this.$emit('saveClick', file.response.data)
        })
      }
    },
    resError (error, file) {
      this.spinShow = false
      this.$Message.error({
        content: '错误信息:' + error.status + ' 稍后再试',
        duration: 5
      })
      this.fileObj = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._autoUploadBook {
  @include borderRadius(3px);
  // @include boxShadow(0 1px 6px -1px #bbb);
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
}
</style>
