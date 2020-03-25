<template>
  <div class="pdfDetials">
    <Modal v-model="alertShow" width="800" title="操作" :mask-closable="false" :closable="false">
    <spin-comp :spinShow="spinShow">
      <div v-if="progressText !== null" v-text="progressText"></div>
    </spin-comp>
      <Row class="pl20">
        <Col span="2" offset="20" class="pb10">
          <Button type="primary" @click="addRow">添加</Button>
        </Col>
        <Col span="24" class="pr20 pb10" v-for="(item, index) in inputList" :value="index" :key="index">
          <Row class="_labelFor">
            <Col span="2" class="">
              <p>
                <b>抓取名称：</b>
              </p>
            </Col>
            <Col span="6" class="pr20">
              <Input class="inputOf" v-model="inputList[index].firstParam"></Input>
            </Col>
            <Col span="2" class="">
              <p>
                <b>起始位置：</b>
              </p>
            </Col>
            <Col span="6" class="pr20">
              <Input class="inputOf" v-model="inputList[index].secondParam"></Input>
            </Col>
            <Col span="2" class="">
              <p>
                <b>结束位置：</b>
              </p>
            </Col>
            <Col span="6" class="pr20">
              <Input class="inputOf" v-model="inputList[index].thirdParam"></Input>
            </Col>
          </Row>
        </Col>
        <Col span="22" offset="1" class="_uploadApplBook">
          <Row class="_labelFor">
            <Col span="12" class="_label pb20"><span v-text="childName"></span><b class="_b">*</b></Col>
            <Col span="24">
              <Upload
                ref="upload"
                name="file"
                type="drag"
                :action="uploadUrl"
                :with-credentials="true"
                :show-upload-list="false"
                :format="fileType"
                :max-size="102400"
                :data="upData"
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
            <Col class="tc pt20" span="10" offset="1"><button class="_cancelBtn" @click="cancClick">取 消</button></Col>
            <Col class="tc pt20" span="10" offset="2"><button class="_saveBtn" :class="{'_disabled':addFileBtn}" v-bind:disabled="addFileBtn" @click="saveClick">保 存</button></Col>
          </Row>
        </Col>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import spinComp from '@/components/common/spin'
export default {
  name: 'pdf_detials',
  components: { spinComp },
  data () {
    return {
      progressText: null,
      spinShow: false,
      alertShow: true,
      inputList: [
        {
          firstParam: null,
          secondParam: null,
          thirdParam: null
        }
      ],
      modal_loading: true,
      resUploadUrl: '',
      uploadUrl: '/api/verdict',
      fileType: ['pdf', 'jpg', 'png', 'jpeg'],
      childName: '上传附件',
      upData: {
        userId: null,
        userName: null,
        paramList: ''
      },
      fileObj: null
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ]),
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
          content: '添加成功',
          duration: 1,
          onClose: () => {
            setTimeout(() => {
              this.$emit('alertConfirm', file.response.data)
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
      let item = this.inputList[this.inputList.length - 1]
      if (item.firstParam === null) {
        this.$Message.error({
          content: '抓取名称不能为空',
          duration: 5
        })
      } else if (item.secondParam === null) {
        this.$Message.error({
          content: '起始位置不能为空',
          duration: 5
        })
      } else if (item.thirdParam === null) {
        this.$Message.error({
          content: '结束为止不能为空',
          duration: 5
        })
      } else {
        this.spinShow = true
        this.upData.userId = this.usersInfo.id
        this.upData.userName = this.usersInfo.name
        this.upData.paramList = JSON.stringify(this.inputList)
        this.$refs.upload.post(this.fileObj)
      }
    },
    cancClick () {
      this.$emit('alertCancel')
    },
    dowDoc () {
      this.$emit('dowDoc')
    },
    addRow () {
      let row = {
        firstParam: null,
        secondParam: null,
        thirdParam: null
      }
      let item = this.inputList[this.inputList.length - 1]
      if (item.firstParam === null) {
        this.$Message.error({
          content: '抓取名称不能为空',
          duration: 5
        })
      } else if (item.secondParam === null) {
        this.$Message.error({
          content: '起始位置不能为空',
          duration: 5
        })
      } else if (item.thirdParam === null) {
        this.$Message.error({
          content: '结束为止不能为空',
          duration: 5
        })
      } else {
        this.inputList.push(row)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
._uploadApplBook {
  @include borderRadius(3px);
  // @include boxShadow(0 1px 6px -1px #bbb);
  margin-top: 10px;
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
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
  ._file {
    @include hand;
    color: #337BB5;
    // margin-right: 10px;
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
