<template>
  <div class="_resAddAppr">
    <alert-btn-info :isSaveBtn="resTitle === '查看'" :alertShow="alertShow" @alertConfirm="alertExp" @alertCancel="alertCanc" :alertTitle="resTitle">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>流程名称：</b></p>
        </Col>
        <Col span="16">
          <Select v-bind:disabled="resTitle === '查看' || resTitle === '修改'" v-model="resData.moduleKey" @on-change="clearResData">
            <Option v-for="item in moduleKeyList" :value="item.oaItemKey" :key="item.id">{{ item.item }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="['0', '1', '2', '3'].indexOf(resModuleKey) !== -1">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>时间：</b></p>
        </Col>
        <Col span="16">
          <DatePicker class="wmax" :value="dateList" format="yyyy-MM-dd HH:mm" @on-change="changeDate" :options="dateDisa" type="datetimerange" placeholder="请指定时间"></DatePicker>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="['0', '1', '2'].indexOf(resModuleKey) !== -1">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>时长：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.dateNum"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '4' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>报销类别：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.costObj" placeholder="如: 采购经费、活动经费"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '4' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>费用明细：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.detailed" placeholder="请输入费用明细描述"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '4' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>小写金额：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.lowercaseAmount" @on-blur="digitUppercase()"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '4' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>大写金额：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.capitalAmount" disabled></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '3' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文件名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.fileName"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '3' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>公司名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.companyName"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resModuleKey === '3' || resModuleKey === '0'">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>印章类型：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="resData.sealType">
            <Option v-for="item in sealTypeList" :value="item.value" :key="item.id">{{ item.value }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>理由：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>备注：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="fileData.length !== 0">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>已上传的文件: </b></p>
        </Col>
        <Col span="16" class="_input">
          <Row>
            <Col span="12" class="_item" v-for="item in fileData" :key="item.id">
              <span class="hand" :title="item.fileName" @click="seeFile(item.filePath)">{{item.fileName.length > 15 ? item.fileName.substr(0, 15) + '...' : item.fileName}}</span><Icon v-if="resTitle !== '查看'" @click="delFile(item.id)" class="_del hand ml10" type="md-close-circle"></Icon>
            </Col>
          </Row>
        </Col>
      </Row>
      <auto-upload-book v-if="resTitle !== '查看'" childName="附件" :fileType="['jpg', 'jpeg', 'png']" :uploadUrl="resUploadUrl" @saveClick="saveDoucId"></auto-upload-book>
      <template v-if="resTitle !== '添加'">
        <Row class="_labelFor" v-if="resData.deptLeaderReason !== null">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>部门领导意见：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.deptLeaderReason" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resData.hrLeaderReason !== null && resModuleKey !== '4'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>HR领导意见：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.hrLeaderReason" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resData.reimburseReason !== null && resModuleKey !== '1' && resModuleKey !== '2'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>财务领导意见：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.reimburseReason" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="resData.ceoReason !== null">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>CEO意见：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="resData.ceoReason" type="textarea" :autosize="{minRows: 3,maxRows: 6}"></Input>
          </Col>
        </Row>
      </template>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import autoUploadBook from '@/components/common/autoUploadBook'
import regi from '@/config/regiType.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'res_add_appr',
  mixins: [resMess],
  props: ['resId', 'resTitle'],
  components: { alertBtnInfo, autoUploadBook },
  data () {
    return {
      dateDisa: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      alertShow: true,
      resData: {
        moduleKey: null,
        userId: null,
        userName: null,
        startUseTime: null,
        endUseTime: null,
        dateNum: null,
        reason: null,
        costObj: null,
        detailed: null,
        lowercaseAmount: null,
        capitalAmount: null,
        remarks: null,
        fileName: null,
        companyName: null,
        sealType: null,
        fileIds: []
      },
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
      dateList: []
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ]),
    resUploadUrl () {
      return regi.api + '/OAReq/upLoadOaFile'
    },
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
  created () {
    this.resTypeList()
    if (this.resId !== null) {
      this.resDataReq()
    }
  },
  methods: {
    clearResData () {
      this.resData.startUseTime = null
      this.resData.endUseTime = null
      this.resData.dateNum = null
      this.resData.costObj = null
      this.resData.detailed = null
      this.resData.lowercaseAmount = null
      this.resData.capitalAmount = null
      this.resData.fileName = null
      this.resData.companyName = null
      this.resData.sealType = null
    },
    resDataReq () {
      axios.post('/OAReq/detailsOa', {
        id: this.resId,
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
    },
    resTypeList () {
      axios.post('/OAReq/processKey').then(res => {
        let _data = res.data.data
        this.moduleKeyList = _data === null ? [] : _data
        if (_data.length !== 0) {
          this.resData.moduleKey = _data[0].oaItemKey
        }
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    changeDate (val) {
      this.resData.startUseTime = val[0]
      this.resData.endUseTime = val[1]
      if (val[0] === '' || val[1] === '') {
        this.resData.dateNum = ''
      } else {
        this.resData.dateNum = this.getHour(this.resData.startUseTime, this.resData.endUseTime)
      }
    },
    getHour (s1, s2) {
      s1 = new Date(s1.replace(/-/g, '/'))
      s2 = new Date(s2.replace(/-/g, '/'))
      var ms = Math.abs(s1.getTime() - s2.getTime())
      return (ms / 1000 / 60 / 60).toFixed(1)
    },
    delFile (id) {
      for (let k in this.fileData) {
        if (this.fileData[k].id === id) {
          this.fileData.splice(k, 1)
          this.resData.fileIds.splice(k, 1)
          this.resMessage('success', '删除成功:')
          return
        }
      }
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    saveDoucId (_obj) {
      if (this.resData.fileIds.indexOf(_obj.id) === -1) {
        this.fileData.push(_obj)
        if (this.resData.fileIds === '') {
          this.resData.fileIds = []
        }
        this.resData.fileIds.push(_obj.id)
      }
    },
    digitUppercase () {
      let price = this.resData.lowercaseAmount
      const fraction = ['角', '分']
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      let num = Math.abs(price)
      let s = ''
      fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '')
      })
      s = s || '整'
      num = Math.floor(num)
      for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = ''
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
          p = digit[num % 10] + unit[1][j] + p
          num = Math.floor(num / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      this.resData.capitalAmount = s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    },
    alertExp () {
      if (this.resData.moduleKey === 'oaLeaveApplyProcess' || this.resData.moduleKey === 'oaUseCarApplyProcess') {
        if (this.resData.startUseTime === null) {
          this.resMessage('warning', '请选择开始时间')
        } else if (this.resData.endUseTime === null) {
          this.resMessage('warning', '请选择结束时间')
        } else if (this.resData.reason === null) {
          this.resMessage('warning', '请填写请假理由')
        } else if (this.resData.remarks === null) {
          this.resMessage('warning', '请填写请假备注说明')
        } else {
          this.alertSave()
        }
      } else if (this.resData.moduleKey === 'oaReimburseProcess') {
        if (this.resData.costObj === null) {
          this.resMessage('warning', '请输入报销类别')
        } else if (this.resData.detailed === null) {
          this.resMessage('warning', '请输入费用明细')
        } else if (this.resData.lowercaseAmount === null) {
          this.resMessage('warning', '请输入小写金额')
        } else if (!setRegExp(this.resData.lowercaseAmount, 'money')) {
          this.resMessage('warning', '请输入正确的小写金额')
        } else if (this.resData.reason === null) {
          this.resMessage('warning', '请填写报销理由')
        } else if (this.resData.remarks === null) {
          this.resMessage('warning', '请填写报销备注说明')
        } else {
          this.alertSave()
        }
      } else if (this.resData.moduleKey === 'oaUseSealProcess') {
        if (this.resData.startUseTime === null) {
          this.resMessage('warning', '请选择开始时间')
        } else if (this.resData.endUseTime === null) {
          this.resMessage('warning', '请选择结束时间')
        } else if (this.resData.fileName === null) {
          this.resMessage('warning', '请输入文件名称')
        } else if (this.resData.companyName === null) {
          this.resMessage('warning', '请输入公司名称')
        } else if (this.resData.sealType === null) {
          this.resMessage('warning', '请选择印章类型')
        } else if (this.resData.reason === null) {
          this.resMessage('warning', '请填写请假理由')
        } else if (this.resData.remarks === null) {
          this.resMessage('warning', '请填写请假备注说明')
        } else {
          this.alertSave()
        }
      } else {
        if (this.resData.reason === null) {
          this.resMessage('warning', '请填写理由')
        } else if (this.resData.remarks === null) {
          this.resMessage('warning', '请填写备注说明')
        } else {
          this.alertSave()
        }
      }
    },
    alertSave () {
      let _data = {}
      if (this.resTitle === '添加') {
        _data = this.resData
        _data.userId = this.usersInfo.id
        _data.userName = this.usersInfo.name
        _data.fileIds = _data.fileIds.length === 0 ? '' : _data.fileIds.join(',')
        axios.post('/OAReq/addOa', _data).then(res => {
          this.resMessage('success', res.data.data)
          this.$emit('alertConfirm')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      } else if (this.resTitle === '修改') {
        _data.id = this.resId
        _data.userId = this.usersInfo.id
        _data.userName = this.usersInfo.name
        _data.moduleKey = this.resData.moduleKey
        _data.startUseTime = this.resData.startUseTime
        _data.endUseTime = this.resData.endUseTime
        _data.dateNum = this.resData.dateNum
        _data.reason = this.resData.reason
        _data.costObj = this.resData.costObj
        _data.detailed = this.resData.detailed
        _data.lowercaseAmount = this.resData.lowercaseAmount
        _data.capitalAmount = this.resData.capitalAmount
        _data.remarks = this.resData.remarks
        _data.fileName = this.resData.fileName
        _data.companyName = this.resData.companyName
        _data.sealType = this.resData.sealType
        _data.fileIds = this.resData.fileIds.length === 0 ? '' : this.resData.fileIds.join(',')
        axios.post('/OAReq/updateOa', _data).then(res => {
          this.resMessage('success', res.data.data)
          this.$emit('alertConfirm')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
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
