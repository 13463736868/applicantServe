<template>
  <div class="onesInfo">
    <head-top :isRegister="true">
      <span class="f36 fcf">个人信息</span>
    </head-top>
    <div class="_center pr">
      <Row>
        <Col span="14" offset="5">
          <div class="_ones">
            <div class="_top">基本信息</div>
            <div v-if="dataObj !== null" class="_mid">
              <Row>
                <Col span="22" offset="1">
                  <Row>
                    <Col class="_label" span="11">
                      <p>登录名：</p>
                      <p v-text="dataObj.loginname"></p>
                    </Col>
                    <Col class="_label" span="11" offset="2">
                      <p>邮箱：</p>
                      <p v-text="dataObj.email"></p>
                    </Col>
                  </Row>
                  <Row class="pt10">
                    <Col class="_label" span="11">
                      <p>真实姓名：</p>
                      <p v-text="dataObj.name"></p>
                    </Col>
                    <Col class="_label" span="11" offset="2">
                      <p>手机号：</p>
                      <p v-text="dataObj.phone"></p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row class="pt20">
                <Col span="11" offset="1" class="tc"><button class="_editInfoBtn" @click="resEditInfo">修改信息</button></Col>
                <Col span="11" offset="1" class="tc"><button class="_editPassBtn" @click="resEditPass">修改密码</button></Col>
              </Row>
            </div>
          </div>
          <div class="_file" v-if="fileObjShow">
            <div class="_top">签名信息</div>
            <div class="_mid">
              <Row>
                <form ref="_formA">
                  <Col span="10" offset="1">
                    <img class="_imgA" :src="imgUrl" ref="fileA">
                    <input type="file" class="_fileA" @change="fileAChange" accept="image/*">
                  </Col>
                </form>
              </Row>
              <div class="_mask pr">
                <span class="_back"></span>
                <Upload
                  class="pa"
                  ref="upload"
                  name="file"
                  type="drag"
                  :action="uploadUrl"
                  :with-credentials="true"
                  :show-upload-list="false"
                  :format="fileType"
                  :on-format-error="resFormError"
                  :on-success="resSuccess"
                  :on-error="resError"
                ></Upload>
              </div>
              <Row>
                <Col class="tc" span="10" offset="1"><button class="_cancelBtn" @click="cancClick">重 置</button></Col>
                <Col class="tc" span="10" offset="2"><button class="_saveBtn" :class="{'_disabled':addInfoBtn}" v-bind:disabled="addInfoBtn" @click="saveClick">保 存</button></Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <alert-btn-info :alertShow="alertObj.info" @alertConfirm="infoSave" @alertCancel="alertCanc('info')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">邮箱：</p>
        </Col>
        <Col span="12">
           <Input v-model="alertData.email" placeholder="请输入邮箱..."/>
        </Col>
      </Row>
      <Row class="pt10">
        <Col span="6" offset="1">
          <p class="pt7 pb7">手机号：</p>
        </Col>
        <Col span="12">
           <Input v-model="alertData.phone" placeholder="请输入手机号..."/>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.pass" @alertConfirm="passSave" @alertCancel="alertCanc('pass')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">新密码：</p>
        </Col>
        <Col span="12">
           <Input type="password" v-model="alertData.pass" placeholder="请输入新密码..."/>
        </Col>
      </Row>
      <Row class="pt10">
        <Col span="6" offset="1">
          <p class="pt7 pb7">确认新密码：</p>
        </Col>
        <Col span="12">
           <Input type="password" v-model="alertData.passT" placeholder="请输入新密码..."/>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import headTop from '@/components/header/head'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import setRegExp from '@/config/regExp.js'
import regi from '@/config/regiType.js'

export default {
  name: 'ones_info',
  components: { headTop, alertBtnInfo },
  data () {
    return {
      addInfoBtn: false,
      uploadUrl: regi.api + '/user/uploadSignature',
      dataObj: null,
      fileObjShow: false,
      fileObj: null,
      fileType: ['jpg', 'jpeg', 'png'],
      imgUrl: require('../../../static/images/sign.png'),
      alertObj: {
        info: false,
        pass: false
      },
      alertData: {
        email: null,
        phone: null,
        pass: null,
        passT: null
      }
    }
  },
  created () {
    if (this.usersInfo !== null) {
      if (this.usersInfo.id !== null) {
        this.resGetInfo(this.usersInfo.id, true)
      }
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resGetInfo (id, type) {
      axios.get('/user/' + id).then(res => {
        let _data = res.data.data
        this.dataObj = _data
        if (type) {
          if (_data.role.name === '仲裁员') {
            this.fileObjShow = true
            if (_data.fileId !== null) {
              this.resGetFile(_data.fileId)
            }
          }
        }
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    readerF (type) {
      if (window.FileReader) {
        let _this = this
        let _reader = new FileReader()
        _reader.readAsDataURL(this.fileObj)
        _reader.onload = () => {
          _this.imgUrl = _reader.result
        }
      } else {
        this.$Message.error({
          content: '浏览器不支持FileReader,请使用chrome浏览器',
          duration: 2
        })
      }
    },
    fileAChange (e) {
      let _file = e.target.files[0]
      if (e.target.files.length <= 0) {
      } else if (_file.type.indexOf('image/') === -1) {
        this.$Message.error({
          content: '请重新选择,文件类型必须是图片',
          duration: 2
        })
      } else if (_file.size > 204800) {
        this.$Message.error({
          content: '请修改文件大小,文件不能超过200KB',
          duration: 2
        })
      } else {
        this.fileObj = _file
        this.readerF('fileA')
      }
    },
    resSuccess (res, file) {
      this.fileObj = null
      this.addInfoBtn = false
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
    resFormError (file) {
      this.addInfoBtn = false
      this.$Message.error({
        content: '文件格式错误只支持 ' + this.fileType,
        duration: 2
      })
    },
    resError (error, file) {
      this.addInfoBtn = false
      this.$Message.error({
        content: '错误信息:' + error.status + ' 稍后再试',
        duration: 5
      })
    },
    saveClick () {
      if (this.fileObj === null) {
        this.$Message.warning({
          content: '请先选择需要上传的签名信息',
          duration: 5
        })
        return false
      } else {
        this.addInfoBtn = true
        this.$refs.upload.post(this.fileObj)
      }
    },
    cancClick () {
      this.fileObj = null
      this.$refs._formA.reset()
      this.imgUrl = require('../../../static/images/sign.png')
      this.addInfoBtn = false
    },
    resGetFile (fileId) {
      axios.get('/user/findSignatureById', {
        params: {
          fileId: fileId
        }
      }).then(res => {
        this.imgUrl = res.data.data.filepath
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resEditInfo () {
      this.alertData.email = this.dataObj.email
      this.alertData.phone = this.dataObj.phone
      this.alertObj.info = true
    },
    resEditPass () {
      this.alertObj.pass = true
    },
    infoSave () {
      if (this.alertData.email === null || this.alertData.email === '') {
        this.$Message.warning({
          content: '邮箱地址不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.alertData.email, 'email')) {
        this.$Message.warning({
          content: '请填写正确邮箱地址格式',
          duration: 5
        })
      } else if (this.alertData.phone === null || this.alertData.phone === '') {
        this.$Message.warning({
          content: '手机号码不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.alertData.phone, 'phone')) {
        this.$Message.warning({
          content: '请填写正确手机号码格式',
          duration: 5
        })
      } else {
        axios.put('/user', {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          },
          id: this.dataObj.id,
          phone: this.alertData.phone,
          email: this.alertData.email
        }).then(res => {
          this.alertCanc('info')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resGetInfo(this.usersInfo.id, false)
        }).catch(e => {
          this.alertCanc('info')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    passSave () {
      if (this.alertData.pass === null || this.alertData.pass === '') {
        this.$Message.warning({
          content: '密码不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.alertData.pass, 'password')) {
        this.$Message.warning({
          content: '密码长度6~20位,只能包含数字,字母,下划线',
          duration: 5
        })
      } else if (this.alertData.passT === null || this.alertData.passT === '') {
        this.$Message.warning({
          content: '请再次输入密码',
          duration: 5
        })
      } else if (this.alertData.pass !== this.alertData.passT) {
        this.$Message.warning({
          content: '俩次输入密码不一致',
          duration: 5
        })
      } else {
        axios.get('/user/updateUserPass', {
          params: {
            userId: this.dataObj.id,
            pass: this.alertData.pass
          }
        }).then(res => {
          this.alertCanc('pass')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
        }).catch(e => {
          this.alertCanc('pass')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc (type) {
      if (type === 'info') {
        this.alertObj.info = false
        this.alertData.email = null
        this.alertData.phone = null
      } else if (type === 'pass') {
        this.alertObj.pass = false
        this.alertData.pass = null
        this.alertData.passT = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
  ._ones {
    padding-bottom: 60px;
  }
  ._file {
    padding-bottom: 60px;
  }
  ._ones ._top, ._file ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._ones ._mid, ._file ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
    padding: 10px 0 20px;
  }
  ._ones ._mid {
    ._label {
      border-bottom: 1px solid #eee;
      p {
        padding: 10px 0 5px;
        font-size: 12px;
      }
      p:first-child {
        font-weight: 700;
      }
    }
  }
  ._file ._mid {
    text-align: center;
    ._imgA {
      width: 303px;
      height: 192px;
    }
    ._fileA {
      @include center;
      @include hand;
      width: 303px;
      height: 96%;
      opacity: 0;
    }
    ._mask {
      padding: 5px 0;
      ._back {
        position: absolute;
        width: 5px;
        height: 5px;
        left: 0;
        z-index: 2;
        background: #fff;
      }
    }
  }
  ._editInfoBtn, ._cancelBtn {
    @include btn(#fff, 100px, 14px, 38px);
    @include boxShadow(0 1px 6px -1px #bbb);
    @include borderRadius(4px);
    color: #126eaf;
  }
  ._editPassBtn, ._saveBtn {
    @include btn(#126eaf, 100px, 14px, 38px);
    @include boxShadow(0 1px 6px -1px #bbb);
    @include borderRadius(4px);
  }
  ._saveBtn._disabled {
    @include btn(#ccc, 100px, 14px, 38px);
  }
  ._editInfoBtn:focus, ._editPassBtn:focus, ._cancelBtn:focus,._saveBtn:focus {
    outline: 0px;
  }
}
</style>
