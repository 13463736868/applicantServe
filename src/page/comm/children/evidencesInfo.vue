<template>
  <div class="evidencesInfo">
    <div class="_evidences">
      <div class="_top">申请人证据</div>
      <div v-if="evidObj.list">
        <div v-if="evidData !== null" v-for="(item, index) in evidData" :key="index">
          <evid-info :infoData="item"></evid-info>
        </div>
      </div>
      <div v-if="showAddBtn">
        <add-icon v-if="evidObj.addBtn" :imgStatus="2" addText="添加申请人证据" @addClick="changeView('evidObj')"></add-icon>
      </div>
      <div v-if="evidObj.add">
        <add-evid-info :caseId="caseId" :partieType="1" :fileType="['jpg','jpeg','png','pdf']" :uploadUrl="uploadUrl" :uploadFileUrl="uploadFileUrl" @saveClick="actionSave('addEvidSave')" @cancClick="changeView('listEvid')"></add-evid-info>
      </div>
    </div>
    <div class="_revEvidences">
      <div class="_top">被申请人证据</div>
      <div v-if="revEvidObj.list">
        <div v-if="revEvidData !== null" v-for="(item, index) in revEvidData" :key="index">
          <evid-info :infoData="item"></evid-info>
        </div>
      </div>
      <div v-if="showAddBtn">
        <add-icon v-if="revEvidObj.addBtn" :imgStatus="2" addText="添加被申请人证据" @addClick="changeView('revEvidObj')"></add-icon>
      </div>
      <div v-if="revEvidObj.add">
        <add-evid-info :caseId="caseId" :partieType="2" :fileType="['jpg','jpeg','png','pdf']" :uploadUrl="uploadUrl" :uploadFileUrl="uploadFileUrl" @saveClick="actionSave('addRevEvidSave')" @cancClick="changeView('listRevEvid')"></add-evid-info>
      </div>
    </div>
    <div v-if="questionObj.list" class="_question">
      <div class="_top">问题清单</div>
      <div v-if="questionObj.list">
        <div v-for="(item, index) in questionData" :key="index">
          <question-info :infoData="item"></question-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import regi from '@/config/regiType.js'
import {resMess} from '@/components/common/mixin.js'
import addIcon from '@/components/common/addIcon'
import evidInfo from '@/page/comm/children/children/evidInfo'
import addEvidInfo from '@/page/comm/children/children/addEvidInfo'
import questionInfo from '@/page/comm/children/children/questionInfo'

export default {
  name: 'evidencesInfo',
  mixins: [resMess],
  props: ['caseId', 'caseState'],
  components: { evidInfo, questionInfo, addIcon, addEvidInfo },
  data () {
    return {
      evidObj: {
        list: false,
        addBtn: true,
        add: false
      },
      revEvidObj: {
        list: false,
        addBtn: true,
        add: false
      },
      questionObj: {
        list: false
      },
      evidData: null,
      revEvidData: null,
      questionData: null
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ]),
    uploadUrl () {
      return '/case/addEvidenceByBAMS'
    },
    uploadFileUrl () {
      return regi.api + '/file/upload'
    },
    showAddBtn () {
      if (this.usersInfo.roleCode === 'ROLE_BAMSLEADER' && (['3', '4', 3, 4].indexOf(this.caseState) !== -1)) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resEvid()
      this.resRevEvid()
      this.resQuestion()
    }
  },
  methods: {
    resEvid () {
      axios.post('/case/findCaseDetailsEvidenceApplicantByCaseid', {
        caseId: this.caseId,
        evidenceType: 1
      }).then(res => {
        this.evidData = res.data.data
        if (this.evidData !== null) {
          if (this.evidData.length === 0) {
            this.evidObj.list = false
          } else {
            this.evidObj.list = true
          }
        } else {
          this.evidObj.list = false
        }
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resRevEvid () {
      axios.post('/case/findCaseDetailsEvidenceApplicantByCaseid', {
        caseId: this.caseId,
        evidenceType: 2
      }).then(res => {
        this.revEvidData = res.data.data
        if (this.revEvidData !== null) {
          if (this.revEvidData.length === 0) {
            this.revEvidObj.list = false
          } else {
            this.revEvidObj.list = true
          }
        } else {
          this.revEvidObj.list = false
        }
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resQuestion () {
      axios.post('/case/findCaseQusetionList', {
        caseId: this.caseId
      }).then(res => {
        this.questionData = res.data.data
        if (this.questionData !== null) {
          if (this.questionData.length === 0) {
            this.questionObj.list = false
          } else {
            this.questionObj.list = true
          }
        } else {
          this.questionObj.list = false
        }
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    actionSave (type) {
      switch (type) {
        case 'addEvidSave':
          this.resEvid()
          this.changeView('listEvid')
          this.resMessage('success', '添加成功')
          break
        case 'addRevEvidSave':
          this.resRevEvid()
          this.changeView('listRevEvid')
          this.resMessage('success', '添加成功')
          break
      }
    },
    changeView (type) {
      switch (type) {
        case 'evidObj':
          this.evidObj.list = false
          this.evidObj.add = true
          this.evidObj.addBtn = false
          break
        case 'revEvidObj':
          this.evidObj.list = false
          this.revEvidObj.add = true
          this.revEvidObj.addBtn = false
          break
        case 'listRevEvid':
          this.evidObj.list = true
          this.revEvidObj.add = false
          this.revEvidObj.addBtn = true
          break
        case 'listEvid':
          this.evidObj.list = true
          this.evidObj.add = false
          this.evidObj.addBtn = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.evidencesInfo {
  ._evidences {
    padding-bottom: 60px;
  }
  ._revEvidences {
    padding-bottom: 60px;
  }
  ._question {
    padding-bottom: 60px;
  }
  ._evidences ._top, ._revEvidences ._top, ._question ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
}
</style>
