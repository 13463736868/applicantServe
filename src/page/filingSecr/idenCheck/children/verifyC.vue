<template>
  <div class="verifyCInfo">
    <div class="_cInfo">
      <div class="_top">资料信息</div>
      <div class="_mid">
        <div v-if="seeShow">
          <Row v-if="userType === 1">
            <Col span="10" offset="1">
              <Row class="_labelFor">
                <Col span="24" class="_label">真实姓名<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.name"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.idcardTypeName"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.idcard"></span></Col>
              </Row>
            </Col>
            <Col span="10" offset="2">
              <Row class="_labelFor">
                <Col span="24" class="_label">性别<b class="_b">*</b></Col>
                <Col span="24" class="_input">
                  <span v-if="userAInfo.sex === 1">男</span>
                  <span v-else-if="userAInfo.sex === 2">女</span>
                </Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">联系邮箱</Col>
                <Col span="24" class="_input"><span v-text="userAInfo.email"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">联系地址</Col>
                <Col span="24" class="_input"><p v-text="userAInfo.address" :title="userAInfo.address"></p></Col>
              </Row>
            </Col>
          </Row>
          <Row v-else-if="userType === 2">
            <Col span="10" offset="1">
              <Row class="_labelFor">
                <Col span="24" class="_label">公司名称<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.name"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">营业执照号码<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.code"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">公司地址<b class="_b">*</b></Col>
                <Col span="24" class="_input"><p v-text="userAInfo.address" :title="userAInfo.address"></p></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">公司行业<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.trade"></span></Col>
              </Row>
            </Col>
            <Col span="10" offset="2">
              <Row class="_labelFor">
                <Col span="24" class="_label">法定代表人姓名<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.legal"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.idcardTypeName"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.idcard"></span></Col>
              </Row>
              <Row class="_labelFor">
                <Col span="24" class="_label">公司人数<b class="_b">*</b></Col>
                <Col span="24" class="_input"><span v-text="userAInfo.scale"></span></Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div v-if="seeShow" class="_cFile">
      <div class="_top">附件信息</div>
      <div class="_mid">
        <Row v-if="userType === 1">
          <Col span="10" offset="1">
            <img class="_imgA" :src="imgUrl.fileA" @click="resSeeImg('fileA')">
          </Col>
          <Col span="10" offset="2">
            <img class="_imgB" :src="imgUrl.fileB" @click="resSeeImg('fileB')">
          </Col>
          <Col class="pt20" span="10" offset="7">
            <img class="_imgC" :src="imgUrl.fileC" @click="resSeeImg('fileC')">
          </Col>
        </Row>
        <Row v-else-if="userType === 2">
          <Col span="10" offset="1">
            <img class="_imgA" :src="imgUrl.fileA" @click="resSeeImg('fileA')">
          </Col>
          <Col span="10" offset="2">
            <img class="_imgB" :src="imgUrl.fileB" @click="resSeeImg('fileB')">
          </Col>
          <Col class="pt20" span="10" offset="7">
            <img class="_imgD" :src="imgUrl.fileD" @click="resSeeImg('fileD')">
          </Col>
        </Row>
      </div>
    </div>
    <div class="_entrDoc" v-if="userType === 2">
      <div class="_top">授权委托书</div>
      <div class="_mid">
        <Row v-if="entrDocData !== null">
          <Col span="22" offset="1">
            <p>
              <span class="mr10 _file" v-text="entrDocData.filename" :title="'点击查看: '+ entrDocData.filename" @click="seeFile(entrDocData.filepath)"></span>
            </p>
          </Col>
        </Row>
      </div>
    </div>
    <Row v-if="idenInfoState === 3" class="pb30">
      <Col class="tc" span="10" offset="1"><button class="_cancelBtn" @click="cancClick">驳 回</button></Col>
      <Col class="tc" span="10" offset="2"><button class="_saveBtn" @click="saveClick">通 过</button></Col>
    </Row>
    <alert-btn-info :alertShow="compObj.alert" @alertConfirm="compSave" @alertCancel="alertCanc('comp')" alertTitle="操作">
      <p v-if="compObj.state === 1">确定通过审核吗？</p>
      <Input v-else-if="compObj.state === 2" v-model="compObj.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入退回原因..." />
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'verify_c_info',
  props: [ 'userType', 'idenInfoId', 'idenInfoState' ],
  components: { alertBtnInfo },
  data () {
    return {
      entrDocData: null,
      seeShow: false,
      userAInfo: {},
      imgUrl: {
        fileA: '',
        fileB: '',
        fileC: '',
        fileD: ''
      },
      compObj: {
        id: null,
        state: null,
        reason: null,
        alert: false
      }
    }
  },
  created () {
    if (this.userType === 1) {
      this.resSee()
    } else if (this.userType === 2) {
      this.resSee()
    }
  },
  computed: {
    resSeeUrl () {
      if (this.userType === 1) {
        return '/clientRequest/findRegisterDetailsMessage'
      } else if (this.userType === 2) {
        return '/enterprise/detail'
      }
    },
    resSeeData () {
      let _data = {}
      if (this.userType === 1) {
        _data.registerId = this.idenInfoId
        return _data
      } else if (this.userType === 2) {
        _data.id = this.idenInfoId
        return _data
      }
    }
  },
  methods: {
    resSee () {
      axios.post(this.resSeeUrl, this.resSeeData).then(res => {
        this.userAInfo = res.data.data
        if (this.userType === 1) {
          this.imgUrl.fileA = res.data.data.filePathList[0]
          this.imgUrl.fileB = res.data.data.filePathList[1]
          this.imgUrl.fileC = res.data.data.filePathList[2]
        } else if (this.userType === 2) {
          if (res.data.data.fileList.length >= 3) {
            this.imgUrl.fileA = res.data.data.fileList[0].filepath
            this.imgUrl.fileB = res.data.data.fileList[1].filepath
            this.imgUrl.fileD = res.data.data.fileList[2].filepath
          } else {
            this.$Message.error({
              content: '获取附件信息出错,请稍后再试',
              duration: 5
            })
          }
          this.entrDocData = this.userAInfo.authorizeBook
        }
        this.seeShow = true
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    cancClick () {
      this.compObj.id = this.idenInfoId
      this.compObj.state = 2
      this.compObj.alert = true
    },
    saveClick () {
      this.compObj.id = this.idenInfoId
      this.compObj.state = 1
      this.compObj.alert = true
    },
    compSave () {
      let _data = {}
      let _url = ''
      if (this.userType === 1) {
        _url = '/clientRequest/updateRegisterPersonal'
      } else if (this.userType === 2) {
        _url = '/enterprise/verify'
      }
      if (this.compObj.state === 1) {
        _data.id = this.compObj.id
        _data.state = this.compObj.state
        this.sendAjax(_url, _data, 'comp')
      } else if (this.compObj.state === 2) {
        _data.id = this.compObj.id
        _data.state = this.compObj.state
        _data.reason = this.compObj.reason === null ? '' : this.compObj.reason
        this.sendAjax(_url, _data, 'comp')
      }
    },
    sendAjax (_url, _data, _type) {
      axios.post(_url, _data).then(res => {
        this.alertCanc(_type)
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.$router.push({
          path: '/idenCheck'
        })
      }).catch(e => {
        this.alertCanc(_type)
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    alertCanc (type) {
      if (type === 'comp') {
        this.compObj.alert = false
        this.compObj.id = null
        this.compObj.state = null
        this.compObj.reason = null
      }
    },
    resSeeImg (type) {
      window.open(this.imgUrl[type], '_blank')
    },
    seeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.verifyCInfo {
  ._cFile {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._entrDoc {
    padding-bottom: 60px;
  }
  ._cInfo ._top, ._cFile ._top, ._entrDoc ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._cInfo ._mid, ._cFile ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
    padding: 20px 10px;
  }
  ._entrDoc ._mid{
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
    padding: 10px;
    ._file {
      @include hand;
      color: #337BB5;
    }
  }
  ._cInfo ._mid {
    ._labelFor {
      ._label {
        height: 20px;
        line-height: 20px;
        ._b {
          color: #ff7a7a;
          margin-left: 5px;
          vertical-align: middle;
        }
      }
      ._type {
        height: 32px;
        line-height: 32px;
        border-bottom:1px solid #ddd;
      }
      ._input {
        margin-bottom: 10px;
        border-bottom:1px solid #ddd;
        p {
          height: 32px;
          line-height: 32px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          width: 100%;
          letter-spacing: 1px;
          font-size: 12px;
          color: #666;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
  ._cFile ._mid {
    text-align: center;
    ._imgA, ._imgB {
      @include hand;
      width: 303px;
      height: 192px;
    }
    ._imgC, ._imgD {
      @include hand;
      width: 303px;
      height: 432px;
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
}
</style>
