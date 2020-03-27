<template>
  <div class="rightBtn">
    <Row class="_myCaseSub" v-if="resData.show">
      <template v-if="roleCode === 'ROLE_ZCMS'">
        <template v-if="[1, 10].indexOf(caseState) !== -1">
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resArbi', null)">修改仲裁费</button>
          </Col>
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resFiling', null)">确认立案</button>
          </Col>
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resRefu', null)">驳回</button>
          </Col>
        </template>
        <Col class="tc" span="20" offset="2" v-if="[9].indexOf(caseState) !== -1">
          <button class="_saveBtn" @click="resAction('resAgree', null)">同意</button>
        </Col>
        <Col class="tc" span="20" offset="2" v-if="[3, 6].indexOf(caseState) !== -1">
          <button class="_saveBtn" @click="resAction('resEndCase', null)">结案</button>
        </Col>
      </template>
      <template v-if="roleCode === 'ROLE_YWZR'">
        <template v-if="[2].indexOf(caseState) !== -1">
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resPass', null)">通过</button>
          </Col>
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resReje', null)">驳回</button>
          </Col>
        </template>
        <template v-if="[5].indexOf(caseState) !== -1">
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resPass', null)">通过</button>
          </Col>
          <Col class="tc" span="20" offset="2">
            <button class="_saveBtn" @click="resAction('resReje', null)">驳回</button>
          </Col>
        </template>
      </template>
    </Row>
    <res-filing v-if="alertObj.resFiling" :resPropsData="alertObj.resFilingData" @alertConfirm="alertSave('resFiling')" @alertCancel="alertCanc('resFiling')"></res-filing>
    <res-arbi v-if="alertObj.resArbi" :resPropsData="alertObj.resArbiData" @alertConfirm="alertSave('resArbi')" @alertCancel="alertCanc('resArbi')"></res-arbi>
    <res-agree v-if="alertObj.resAgree" :resPropsData="alertObj.resAgreeData" @alertConfirm="alertSave('resAgree')" @alertCancel="alertCanc('resAgree')"></res-agree>
    <res-pass v-if="alertObj.resPass" :resPropsData="alertObj.resPassData" @alertConfirm="alertSave('resPass')" @alertCancel="alertCanc('resPass')"></res-pass>
    <res-end-case v-if="alertObj.resEndCase" :resPropsData="alertObj.resEndCaseData" @alertConfirm="alertSave('resEndCase')" @alertCancel="alertCanc('resEndCase')"></res-end-case>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import {resMess} from '@/components/common/mixin.js'
import resFiling from '@/page/filingSecr/archiveCase/children/children/resFiling'
import resArbi from '@/page/filingSecr/archiveCase/children/children/resArbi'
import resAgree from '@/page/filingSecr/archiveCase/children/children/resAgree'
import resPass from '@/page/filingSecr/archiveCase/children/children/resPass'
import resEndCase from '@/page/filingSecr/archiveCase/children/children/resEndCase'

export default {
  name: 'rightBtn',
  mixins: [resMess],
  props: ['caseId', 'caseState'],
  components: { resFiling, resArbi, resAgree, resPass, resEndCase },
  data () {
    return {
      roleCode: '',
      resData: {
        show: false
      },
      resArbiInfo: null,
      alertObj: {
        resFiling: false,
        resFilingData: null,
        resArbi: false,
        resArbiData: null,
        resAgree: false,
        resAgreeData: null,
        resPass: false,
        resPassData: null,
        resEndCase: false,
        resEndCaseData: null
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resAction('setUserName', null)
      this.resAction('resArbiInfo', null)
      this.resData.show = true
    }
  },
  methods: {
    ...mapActions([
      'setArchCaseObj'
    ]),
    resAction (type, data) {
      let _urlA = '/casesUnderLine/checkWithdrawCaseUnderLine'
      let _urlB = '/casesUnderLine/updateCostByCaseId'
      let _urlC = '/casesUnderLine/confirmCase'
      let _urlD = '/casesUnderLine/checkCloseUnderLine'
      switch (type) {
        case 'resArbiInfo':
          axios.post('/casesUnderLine/getCaseUnderLineDetailsByCaseId', {
            caseId: this.caseId
          }).then(res => {
            this.resArbiInfo = res.data.data
          }).catch(e => {
            this.resMessage('warning', '错误信息:' + e)
          })
          break
        case 'resArbiInfoS':
          axios.post('/casesUnderLine/getCaseUnderLineDetailsByCaseId', {
            caseId: this.caseId
          }).then(res => {
            this.resArbiInfo = res.data.data
            this.setArchCaseObj({caseId: this.caseId, state: this.resArbiInfo.state})
          }).catch(e => {
            this.resMessage('warning', '错误信息:' + e)
          })
          break
        case 'setUserName':
          if (window.localStorage) {
            let loc = window.localStorage
            let _usersInfo = loc.getItem('usersInfo')
            this.roleCode = _usersInfo === null ? null : JSON.parse(_usersInfo).roleCode
          }
          break
        case 'resAgree':
          this.alertObj.resAgreeData = {
            id: this.caseId,
            url: _urlA
          }
          this.alertObj.resAgree = true
          break
        case 'resArbi':
          this.alertObj.resArbiData = {
            id: this.caseId,
            url: _urlB
          }
          this.alertObj.resArbi = true
          break
        case 'resFiling':
          if (this.resArbiInfo.cost === 0) {
            this.resMessage('warning', '请先输入仲裁费')
            this.resAction('resArbi', data)
            return false
          } else {
            this.alertObj.resFilingData = {
              ids: [this.caseId],
              state: 1,
              url: _urlC
            }
            this.alertObj.resFiling = true
          }
          break
        case 'resRefu':
          this.alertObj.resFilingData = {
            ids: [this.caseId],
            state: 2,
            url: _urlC
          }
          this.alertObj.resFiling = true
          break
        case 'resPass':
          this.alertObj.resPassData = {
            ids: [this.caseId],
            state: 1,
            url: this.caseState === 2 ? _urlC : this.caseState === 5 ? _urlD : ''
          }
          this.alertObj.resPass = true
          break
        case 'resReje':
          this.alertObj.resPassData = {
            ids: [this.caseId],
            state: 2,
            url: this.caseState === 2 ? _urlC : this.caseState === 5 ? _urlD : ''
          }
          this.alertObj.resPass = true
          break
        case 'resEndCase':
          this.alertObj.resEndCaseData = {
            id: this.caseId
          }
          this.alertObj.resEndCase = true
          break
      }
    },
    alertSave (type) {
      this.alertObj[type] = false
      this.alertObj[type + 'Data'] = null
      this.resAction('resArbiInfoS', null)
    },
    alertCanc (type) {
      this.alertObj[type] = false
      this.alertObj[type + 'Data'] = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.rightBtn {
  padding-top: 20px;
  padding-left: 6px;
  ._myCaseSub {
    ._saveBtn {
      @include btn(#126eaf, 140px, 13px, 40px);
      @include boxShadow(0 1px 6px -1px #bbb);
      @include borderRadius(4px);
      margin-bottom: 20px;
    }
    ._saveBtn._disabled {
      @include btn(#ccc, 140px, 13px, 40px);
    }
    ._saveBtn:focus {
      outline: 0px;
    }
  }
}
</style>
