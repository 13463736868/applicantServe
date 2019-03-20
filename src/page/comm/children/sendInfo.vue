<template>
  <div class="sendInfo">
    <div class="_emailWarn">
      <div class="_top">电子邮件送达</div>
      <div class="_mid">
        <Row>
          <Col span="24" class="">
            <Table ref="table" stripe align="center" :loading="emailWarnList.loading" :columns="emailWarnList.header" :data="emailWarnList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
    <div class="_smsWarn">
      <div class="_top">短信提醒</div>
      <div class="_mid">
        <Row>
          <Col span="24" class="">
            <Table ref="table" stripe align="center" :loading="smsWarnList.loading" :columns="smsWarnList.header" :data="smsWarnList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
    <alert-see-info :alertShow="alertShowSub" @alertConfirm="seeInfoSave" alertTitle="查看">
      <div v-if="alertShowSub">
        <Row>
          <Col span="6">
            <p class="p5 tr"><b>主题：</b></p>
          </Col>
          <Col span="16">
            <p class="p5" v-text="alertObj.title"></p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <p class="p5 tr"><b>接收者姓名：</b></p>
          </Col>
          <Col span="16">
            <p class="p5" v-text="alertObj.name"></p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <p class="p5 tr"><b v-text="alertObj.type"></b></p>
          </Col>
          <Col span="16">
            <p class="p5" v-text="alertObj.eOrS"></p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <p class="p5 tr"><b>发送时间：</b></p>
          </Col>
          <Col span="16">
            <p class="p5" v-text="alertObj.time"></p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <p class="p5 tr"><b>发送内容：</b></p>
          </Col>
          <Col span="16">
            <p class="p5" v-text="alertObj.content"></p>
          </Col>
        </Row>
        <Row v-if="alertObj.fileShow">
          <Col span="6">
            <p class="p5 tr"><b>附件：</b></p>
          </Col>
          <Col span="16">
            <template v-for="item in alertObj.fileList" :key="item.id">
              <p class="p5 alert_file"><span class="hand" style="color:#126eaf" title="点击查看" v-text="item.filename" @click="resSeeFile(item.filepath)"></span></p>
            </template>
          </Col>
        </Row>
      </div>
    </alert-see-info>
  </div>
</template>

<script>
import axios from 'axios'
import alertSeeInfo from '@/page/comm/children/children/alertSeeInfo'

export default {
  name: 'sendInfo',
  props: ['caseId', 'caseState'],
  components: { alertSeeInfo },
  data () {
    return {
      alertShowSub: false,
      alertObj: {
        type: null,
        title: null,
        name: null,
        eOrS: null,
        time: null,
        content: null,
        fileShow: false
      },
      emailWarnList: {
        loading: false,
        header: [
          {
            title: '当事人 (申请人)',
            key: 'toName',
            align: 'center'
          },
          {
            title: '送达名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '送达时间',
            key: 'sendTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.resSeeEInfo('email', params.index)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        bodyList: []
      },
      smsWarnList: {
        loading: false,
        header: [
          {
            title: '当事人 (申请人)',
            key: 'toName',
            align: 'center'
          },
          {
            title: '送达名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '送达时间',
            key: 'sendTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.resSeeEInfo('sms', params.index)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resSendInfo()
    }
  },
  methods: {
    resSendInfo () {
      axios.post('/case/findNoticeList', {
        caseId: this.caseId,
        messageType: 'email'
      }).then(res => {
        this.emailWarnList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
      axios.post('/case/findNoticeList', {
        caseId: this.caseId,
        messageType: 'sms'
      }).then(res => {
        this.smsWarnList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    resSeeEInfo (type, index) {
      let _res = null
      if (type === 'email') {
        _res = this.emailWarnList.bodyList[index]
      } else if (type === 'sms') {
        _res = this.smsWarnList.bodyList[index]
      }
      if (type === 'email') {
        this.alertObj.type = '接收者邮箱：'
        this.alertObj.title = _res.title
        this.alertObj.name = _res.toName
        this.alertObj.eOrS = _res.sendTo
        this.alertObj.time = _res.sendTime
        this.alertObj.content = _res.content
        if (_res.fileList !== null && _res.fileList.length !== 0) {
          this.alertObj.fileShow = true
          this.alertObj.fileList = _res.fileList
        } else {
          this.alertObj.fileShow = false
        }
      } else if (type === 'sms') {
        this.alertObj.type = '接收者手机：'
        this.alertObj.title = _res.title
        this.alertObj.name = _res.toName
        this.alertObj.eOrS = _res.receiver
        this.alertObj.time = _res.sendTime
        this.alertObj.content = _res.content
        this.alertObj.fileShow = false
      }
      this.alertShowSub = true
    },
    seeInfoSave () {
      this.alertShowSub = false
    },
    resSeeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.sendInfo {
  ._smsWarn {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._emailWarn ._top, ._smsWarn ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._emailWarn ._mid, ._smsWarn ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
  }
}
</style>
