<template>
  <div class="_resSeeAppr">
    <alert-btn-info :isSaveBtn="resTabState === 'task'" :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <div v-if="resData !== null">
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>流程类别：</b></p>
          </Col>
          <Col span="16">
            <Select disabled v-model="resData.moduleKey" class="disableBox">
              <Option v-for="item in moduleKeyList" :value="item.oaItemKey" :key="item.id">{{ item.item }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="['1', '2', '3'].indexOf(resModuleKey) !== -1">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>时间：</b></p>
          </Col>
          <Col span="16">
            <DatePicker :value="dateList" format="yyyy-MM-dd HH:mm" disabled class="wmax disableBox" :options="dateDisa" type="datetimerange" placeholder="请指定时间"></DatePicker>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="['1', '2'].indexOf(resModuleKey) !== -1">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>时长：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.dateNum" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '4'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>报销类别：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.costObj" placeholder="如: 采购经费、活动经费" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '4'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>费用明细：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.detailed" placeholder="请输入费用明细描述" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '4'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>小写金额：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.lowercaseAmount" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '4'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>大写金额：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.capitalAmount" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '3'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>用印文件名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.fileName" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '3'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>用印公司名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.companyName" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resModuleKey === '3'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>印章类型：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="resData.sealType" disabled class="disableBox">
              <Option disabled v-for="item in sealTypeList" :value="item.value" :key="item.id">{{ item.value }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>理由：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 6}" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>备注：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 6}" disabled class="disableBox"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="fileData.length !== 0">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>已上传的文件: </b></p>
          </Col>
          <Col span="16" class="_input">
            <Row>
              <Col span="12" class="_item" v-for="item in fileData" :key="item.id">
                <span class="hand" :title="item.fileName" @click="seeFile(item.filePath)">{{item.fileName.length > 15 ? item.fileName.substr(0, 15) + '...' : item.fileName}}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resTabState === 'notDeal'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>审核：</b></p>
          </Col>
          <Col span="16">
            <RadioGroup v-model="passData.dealFlag" type="button">
              <Radio label="通过">通过</Radio>
              <Radio label="驳回">驳回</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resTabState === 'notDeal'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>原因：</b></p>
          </Col>
          <Col span="16">
            <Input v-model.trim="passData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入原因..." />
          </Col>
        </Row>
      </div>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'res_see_appr',
  mixins: [resMess],
  props: ['resId', 'resTabState'],
  components: { alertBtnInfo },
  data () {
    return {
      dateDisa: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      alertShow: true,
      resData: null,
      moduleKeyList: [],
      sealTypeList: [
        {
          id: '1',
          value: '公章'
        },
        {
          id: '2',
          value: '合同章'
        },
        {
          id: '3',
          value: '法人章'
        },
        {
          id: '4',
          value: '财务章'
        },
        {
          id: '5',
          value: '发票专用章'
        }
      ],
      fileData: [],
      dateList: [],
      passData: {
        dealFlag: '通过',
        reason: ''
      }
    }
  },
  created () {
    this.resTypeList()
    if (this.resId !== null) {
      this.resInfoData()
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ]),
    resModuleKey () {
      if (this.resData.moduleKey === 'oaLeaveApplyProcess') {
        return '1'
      } else if (this.resData.moduleKey === 'oaUseCarApplyProcess') {
        return '2'
      } else if (this.resData.moduleKey === 'oaReimburseProcess') {
        return '4'
      } else if (this.resData.moduleKey === 'oaUseSealProcess') {
        return '3'
      } else {
        return '0'
      }
    }
  },
  methods: {
    resTypeList () {
      axios.post('/OAReq/processKey').then(res => {
        let _data = res.data.data
        this.moduleKeyList = _data === null ? [] : _data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resInfoData () {
      if (this.resTabState === 'notDeal') {
        axios.post('/OAReq/findOaByTaskId', {
          taskId: this.resId,
          userId: this.usersInfo.id,
          userName: this.usersInfo.name
        }).then(res => {
          this.resData = res.data.data
          this.resData.fileIds = []
          this.dateList = [this.resData.startUseTime, this.resData.endUseTime]
          this.fileData = this.resData.oaFilesList === null ? [] : this.resData.oaFilesList
          for (let k in this.fileData) {
            this.resData.fileIds.push(this.fileData[k].id)
          }
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      } else if (this.resTabState === 'task') {
        axios.post('/OAReq/findOaByHisProcInstId', {
          procInstId: this.resId,
          userId: this.usersInfo.id,
          userName: this.usersInfo.name
        }).then(res => {
          this.resData = res.data.data
          this.resData.fileIds = []
          this.dateList = [this.resData.startUseTime, this.resData.endUseTime]
          this.fileData = this.resData.oaFilesList === null ? [] : this.resData.oaFilesList
          for (let k in this.fileData) {
            this.resData.fileIds.push(this.fileData[k].id)
          }
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    alertSave () {
      axios.post('/OAReq/dealOaTask', {
        id: this.resData.id,
        taskId: this.resId,
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        dealFlag: this.passData.dealFlag,
        reason: this.passData.reason
      }).then(res => {
        this.resMessage('success', '操作成功')
        this.$emit('alertConfirm')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertCanc () {
      this.$emit('alertCancel')
    },
    seeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss">
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
  ._label {
    padding: 7px 0;
  }
  ._input {
    color: #337BB5;
    ._item {
      padding: 5px 0;
    }
    ._del {
      font-size: 14px;
      color: #ff7a7a;
      vertical-align: text-bottom;
    }
  }
}
</style>
<style lang="scss">
.disableBox .ivu-select-selection,.disableBox .ivu-input-disabled {
  background-color: #fff;
  color: #515a6e
}
</style>
