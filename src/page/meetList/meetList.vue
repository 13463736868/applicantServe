<template>
  <div class="meetList">
    <head-top :isRegister="true">
      <span class="f36 fcf">视频会议</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">状态</label>
        </Col>
        <Col span="4">
          <Select v-model="meetStatus" @on-change="resChangeStatus()">
            <Option v-for="item in meetStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="2" offset="16">
          <Button type="primary" @click="sendAjax('addBefore')">创建</Button>
        </Col>
      </Row>
      <div class="_meetList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="meetList.loading" :columns="meetList.header" :data="meetList.bodyList"></Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
          </Col>
        </Row>
      </div>
    </div>
    <alert-btn-info :alertShow="alertObj.meetAdd" @alertConfirm="meetAddSave" @alertCancel="alertCanc('meetAdd')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>会议主题：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertData.subject"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>开始时间：</b></p>
        </Col>
        <Col span="16">
          <DatePicker class="wmax" @on-change="changeDate" :options="alertData.options" type="datetime" placeholder="请指定开始时间"></DatePicker>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>预计时长：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="alertData.predictLen">
            <Option v-for="item in alertData.predictLenList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>邀请人员：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="alertData.userIds" multiple>
            <OptionGroup v-for="itemP in alertData.userList" v-if="itemP.name !== '管理员'" :label="itemP.name" :key="itemP.id">
              <Option v-for="item in itemP.userList" v-if="item.id !== usersInfo.id" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </OptionGroup>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.userList" :isSaveBtn="true" @alertCancel="alertCanc('userList')" alertTitle="参与人员">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="userList.loading" :columns="userList.header" :data="userList.bodyList"></Table>
        </Col>
      </Row>
      <Row class="pt15">
        <Col span="24" class="tc">
          <Page simple :total="userList.page.total" :current="userList.page.pageNum" :page-size="userList.page.pageSize" show-elevator show-total @on-change="reschangePageU"></Page>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.meetCanc" @alertConfirm="sendAjax('cancMeet')" @alertCancel="alertCanc('meetCanc')" alertTitle="操作">
      <p>确定要取消吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'meet_list',
  components: { headTop, spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: false,
      meetStatusList: [],
      meetStatus: 1,
      meetList: {
        loading: false,
        header: [
          {
            title: '发起人姓名',
            key: 'createName',
            align: 'center'
          },
          {
            title: '会议主题',
            key: 'subject',
            align: 'center'
          },
          {
            title: '开始时间',
            key: 'beginTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '结束时间',
            key: 'endTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '参与人员',
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
                      this.resSeeUser(params.index)
                    }
                  }
                }, '查看')
              ])
            }
          },
          {
            title: '操作',
            key: 'id',
            minWidth: 26,
            align: 'center',
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
          }
        ],
        bodyList: []
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      userList: {
        loading: false,
        header: [
          {
            title: '姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'phone',
            align: 'center'
          }
        ],
        bodyList: [],
        dataList: [],
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 5
        }
      },
      alertObj: {
        userList: false,
        meetAdd: false,
        meetCanc: false,
        meetId: null
      },
      alertData: {
        options: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        subject: '',
        beginTimeStr: '',
        predictLen: null,
        userIds: [],
        predictLenList: [
          {
            value: 1,
            label: '30分钟'
          },
          {
            value: 2,
            label: '1个小时'
          },
          {
            value: 3,
            label: '1个半小时'
          },
          {
            value: 4,
            label: '2个小时'
          }
        ],
        userList: []
      }
    }
  },
  created () {
    this.dictionary()
    this.resMeetList()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    dictionary () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'meetingStatus'
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.meetStatusList = _select
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.delFlag) {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            }
          }, '会议已结束/取消')
        ])
      } else {
        if (_obj.master) {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.resToMeet(params.index)
                }
              }
            }, '进入会议'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resMeetCanc(params.index)
                }
              }
            }, '取消')
          ])
        } else {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resToMeet(params.index)
                }
              }
            }, '进入会议')
          ])
        }
      }
    },
    resMeetList () {
      this.spinShow = true
      axios.post('/meeting/selectList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        meetingStatus: this.meetStatus
      }).then(res => {
        let _data = res.data.data
        this.meetList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resChangeStatus () {
      this.pageObj.pageNum = 1
      this.resMeetList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resMineList()
    },
    resSeeUser (index) {
      this.userList.dataList = this.meetList.bodyList[index].userList
      this.userList.page.total = this.userList.dataList.length
      this.userList.page.pageNum = 1
      this.resUserList('once')
    },
    resUserList (type) {
      let _min = (this.userList.page.pageNum - 1) * this.userList.page.pageSize
      let _max = _min + this.userList.page.pageSize
      this.userList.bodyList = this.userList.dataList.slice(_min, _max)
      if (type === 'once') {
        setTimeout(() => {
          this.alertObj.userList = true
        })
      }
    },
    reschangePageU (page) {
      this.userList.page.pageNum = page
      this.resUserList('more')
    },
    resMeetCanc (index) {
      this.alertObj.meetId = this.meetList.bodyList[index].id
      this.alertObj.meetCanc = true
    },
    changeDate (val) {
      this.alertData.beginTimeStr = val
    },
    meetAddSave () {
      if (this.alertData.subject === '') {
        this.$Message.warning({
          content: '请填写会议主题',
          duration: 5
        })
      } else if (this.alertData.beginTimeStr === '') {
        this.$Message.warning({
          content: '请填写会议开始时间',
          duration: 5
        })
      } else if (this.alertData.predictLen === null) {
        this.$Message.warning({
          content: '请选择预计时长',
          duration: 5
        })
      } else if (this.alertData.userIds.length === 0) {
        this.$Message.warning({
          content: '邀请人员不能为空',
          duration: 5
        })
      } else {
        let newTime = this.getFormatDate()
        let newD = newTime.substr(0, 10).split('-').join('')
        let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
        let beginTime = this.alertData.beginTimeStr
        let beginD = beginTime.substr(0, 10).split('-').join('')
        let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
        if (newD === beginD) {
          if (beginT - newT < 0) {
            this.$Message.warning({
              content: '会议开始时间不能小于当前时间',
              duration: 5
            })
          } else {
            this.sendAjax('addMeet')
          }
        } else if (beginD - newD < 0) {
          this.$Message.warning({
            content: '会议开始时间不能小于当前时间',
            duration: 5
          })
        } else {
          this.sendAjax('addMeet')
        }
      }
    },
    getFormatDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strD = date.getDate()
      let hour = date.getHours()
      let minu = date.getMinutes()
      let sec = date.getSeconds()
      let time = ''
      if (month < 10) {
        month = '0' + month
      }
      if (strD < 10) {
        strD = '0' + strD
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minu < 10) {
        minu = '0' + minu
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      time = year + '-' + month + '-' + strD + ' ' + hour + ':' + minu + ':' + sec
      return time
    },
    resToMeet (index) {
      let _info = this.meetList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
      let beginTime = _info.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
      let endTime = _info.endTime
      let endT = (endTime.substr(11, 2) - 0) * 60 + (endTime.substr(14, 2) - 0)
      if (newD !== beginD) {
        this.$Message.warning({
          content: '只能在会议开始前十分钟或会议结束前进入',
          duration: 5
        })
      } else if (beginT - newT > 10 || endT - newT < 0) {
        this.$Message.warning({
          content: '只能在会议开始前十分钟或会议结束前进入',
          duration: 5
        })
      } else {
        axios.post('/encryption', {
          params: _info.id + '$' + _info.num + '$' + _info.inTotal
        }).then(res => {
          let _s = res.data.data.replace('index', 'meetting')
          window.open('' + _s, '_blank')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    sendAjax (type) {
      switch (type) {
        case 'addMeet':
          axios.post('/meeting/saveOrUpdate', {
            subject: this.alertData.subject,
            beginTimeStr: this.alertData.beginTimeStr,
            predictLen: this.alertData.predictLen,
            userIds: this.alertData.userIds.join(',')
          }).then(res => {
            this.alertCanc('meetAdd')
            this.meetStatus = 1
            this.resChangeStatus()
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
        case 'addBefore':
          axios.post('/meeting/selectRoleVo').then(res => {
            this.alertData.userList = res.data.data
            this.alertObj.meetAdd = true
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
        case 'cancMeet':
          axios.post('/meeting/cancel', {
            meetingId: this.alertObj.meetId
          }).then(res => {
            this.alertCanc('meetCanc')
            this.meetStatus = 1
            this.resChangeStatus()
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'userList':
          this.alertObj.userList = false
          this.userList.bodyList = []
          this.userList.dataList = []
          this.userList.page.pageNum = 1
          break
        case 'meetAdd':
          this.alertObj.meetAdd = false
          this.alertData.subject = ''
          this.alertData.beginTimeStr = ''
          this.alertData.predictLen = null
          this.alertData.userIds = []
          this.alertData.userList = []
          break
        case 'meetCanc':
          this.alertObj.meetCanc = false
          this.alertObj.meetId = null
          break
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
  ._meetList {
    margin-bottom: 20px;
  }
}
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
  ._label {
    padding: 7px 0;
  }
}
._em {
  padding-top: 5px;
  height: 16px;
  line-height: 16px;
  color: #ff7a7a;
  font-size: 8px;
  span {
    float: right;
  }
}
</style>
