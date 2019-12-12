<template>
  <div class="setAssignM">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="24">
          <p class="tc fb f26">分配规则列表</p>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" placeholder="仲裁员名称" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="id">
                <div v-if="addObj.index === index">
                  <span class="mr5" type="text" size="small"></span>
                </div>
                <div v-else>
                  <span class="mr5" type="text" size="small" v-text="index + 1"></span>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="startTime">
                <div v-if="addObj.index === index">
                  <DatePicker transfer v-model="addObj.startTime" class="wmax" :options="dateDisa" @on-change="resAction('addStartTimeChange', ...arguments)" type="date"></DatePicker>
                </div>
                <div v-else-if="editObj.index === index">
                  <DatePicker transfer v-model="editObj.startTime" class="wmax" :options="dateDisa" @on-change="resAction('startTimeChange', ...arguments)" type="date"></DatePicker>
                </div>
                <div v-else>
                  <span class="mr5" type="text" size="small" v-text="row.startTime"></span>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="endTime">
                <div v-if="addObj.index === index">
                  <DatePicker transfer v-model="addObj.endTime" class="wmax" :options="dateDisa" @on-change="resAction('addEndTimeChange', ...arguments)" type="date"></DatePicker>
                </div>
                <div v-else-if="editObj.index === index">
                  <DatePicker transfer v-model="editObj.endTime" class="wmax" :options="dateDisa" @on-change="resAction('endTimeChange', ...arguments)" type="date"></DatePicker>
                </div>
                <div v-else>
                  <span class="mr5" type="text" size="small" v-text="row.endTime"></span>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="arbiSole">
                <div v-if="addObj.index === index">
                  <span class="mr5" type="text" size="small" v-text="addObj.addArbitratorSoleName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('addArbitratorSole', row)"/>
                </div>
                <div v-else-if="editObj.index === index">
                  <span class="mr5" type="text" size="small" v-text="editObj.arbitratorSoleName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('arbitratorSole', row)"/>
                </div>
                <div v-else>
                  <span class="mr5" type="text" size="small" v-text="row.arbitratorSoleName"></span>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="arbiThree">
                <div class="pt5 pb5" v-if="addObj.index === index">
                  <span class="mr5" type="text" size="small" v-text="'主裁：' + addObj.addArbitratorOneName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('addArbitratorOne', row)"/><br>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + addObj.addArbitratorTwoName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('addArbitratorTwo', row)"/><br>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + addObj.addArbitratorThreeName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('addArbitratorThree', row)"/>
                </div>
                <div v-else-if="editObj.index === index">
                  <span class="mr5" type="text" size="small" v-text="'主裁：' + editObj.arbitratorOneName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('arbitratorOne', row)"/><br>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + editObj.arbitratorTwoName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('arbitratorTwo', row)"/><br>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + editObj.arbitratorThreeName"></span>
                  <Icon class="hand vs" type="md-person" size="16" style="color: #3399ff" @click="resAction('arbitratorThree', row)"/>
                </div>
                <div v-else>
                  <span class="mr5" type="text" size="small" v-text="'主裁：' + row.arbitratorOneName"></span>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + row.arbitratorTwoName"></span>
                  <span class="mr5" type="text" size="small" v-text="'边裁：' + row.arbitratorThreeName"></span>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div v-if="addObj.index === index">
                  <Button class="ml10" size="small" type="primary" @click="resAction('addRowBefore', row)">添加</Button>
                  <Button class="ml10" size="small" type="primary" @click="alertCanc('clearAddObj')">清空</Button>
                </div>
                <div v-else-if="editObj.index === index">
                  <Button class="ml10" size="small" type="primary" @click="editObj.index = -1">取消</Button>
                  <Button class="ml10" size="small" type="primary" @click="resAction('saveRow', row)">保存</Button>
                </div>
                <div v-else>
                  <Button class="ml10" size="small" type="primary" @click="resAction('editRow', row)">修改</Button>
                  <Button class="ml10" size="small" type="primary" @click="resAction('resDel', row)">删除</Button>
                </div>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <res-assign v-if="alertObj.assign" :resPropsData="alertObj.assignData" @alertConfirm="alertSave('resAssign', ...arguments)" @alertCancel="alertCanc('resAssign')"></res-assign>
    <res-del v-if="alertObj.del" :resPropsData="alertObj.delData" @alertConfirm="alertSave('resDel')" @alertCancel="alertCanc('resDel')"></res-del>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import { resPage, resMess } from '@/components/common/mixin.js'
import resAssign from '@/page/filingMana/setAssignM/children/resAssign'
import resDel from '@/page/filingMana/setAssignM/children/resDel'

export default {
  name: 'setAssignM',
  mixins: [resPage, resMess],
  components: { spinComp, resAssign, resDel },
  data () {
    return {
      dateDisa: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      spinShow: false,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '规则序号',
            key: 'id',
            align: 'center',
            slot: 'id'
          },
          {
            title: '开始时间',
            key: 'startTime',
            align: 'center',
            tooltip: 'true',
            slot: 'startTime'
          },
          {
            title: '结束时间',
            key: 'endTime',
            tooltip: 'true',
            align: 'center',
            slot: 'endTime'
          },
          {
            title: '1个仲裁员的案件',
            key: 'id',
            tooltip: 'true',
            align: 'center',
            slot: 'arbiSole'
          },
          {
            title: '3个仲裁员的案件',
            key: 'id',
            tooltip: 'true',
            align: 'center',
            minWidth: 120,
            slot: 'arbiThree'
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            tooltip: 'true',
            align: 'center',
            slot: 'action'
          }
        ],
        bodyList: [
          {
            id: 1,
            startTime: '2019-12-10',
            endTime: '2019-12-12',
            createTime: '2019-12-09',
            updateTime: '',
            arbitratorSole: 1,
            arbitratorOne: 2,
            arbitratorTwo: 3,
            arbitratorThree: 4,
            arbitratorSoleName: '一',
            arbitratorOneName: '二',
            arbitratorTwoName: '三',
            arbitratorThreeName: '四'
          }
        ]
      },
      alertObj: {
        assign: false,
        assignData: null,
        del: false,
        delData: null
      },
      objType: '',
      editObj: {
        index: -1,
        startTime: '',
        endTime: '',
        arbitratorSole: -1,
        arbitratorOne: -1,
        arbitratorTwo: -1,
        arbitratorThree: -1,
        arbitratorSoleName: '',
        arbitratorOneName: '',
        arbitratorTwoName: '',
        arbitratorThreeName: ''
      },
      addObj: {
        index: -1,
        startTime: '',
        endTime: '',
        addArbitratorSole: -1,
        addArbitratorOne: -1,
        addArbitratorTwo: -1,
        addArbitratorThree: -1,
        addArbitratorSoleName: '选择仲裁员',
        addArbitratorOneName: '选择仲裁员',
        addArbitratorTwoName: '选择仲裁员',
        addArbitratorThreeName: '选择仲裁员'
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/assignRule/list', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        name: this.search.text
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.addObj.index = this.caseList.bodyList.length
        this.caseList.bodyList.push(this.addObj)
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSearch () {
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resAction (type, data) {
      switch (type) {
        case 'editRow':
          this.editObj.index = data._index
          this.editObj.startTime = data.startTime
          this.editObj.endTime = data.endTime
          this.editObj.arbitratorSole = data.arbitratorSole
          this.editObj.arbitratorOne = data.arbitratorOne
          this.editObj.arbitratorTwo = data.arbitratorTwo
          this.editObj.arbitratorThree = data.arbitratorThree
          this.editObj.arbitratorSoleName = data.arbitratorSoleName
          this.editObj.arbitratorOneName = data.arbitratorOneName
          this.editObj.arbitratorTwoName = data.arbitratorTwoName
          this.editObj.arbitratorThreeName = data.arbitratorThreeName
          break
        case 'addRowBefore':
          if (this.addObj.startTime === '') {
            this.resMessage('warning', '请选择开始时间')
          } else if (this.addObj.endTime === '') {
            this.resMessage('warning', '请选择结束时间')
          } else if ((this.addObj.startTime.split('-').join('') - this.addObj.endTime.split('-').join('')) > 0) {
            this.resMessage('warning', '开始时间不能大于结束时间')
          } else if (this.addObj.addArbitratorSole === -1) {
            this.resMessage('warning', '请选择单个仲裁员')
          } else if (this.addObj.addArbitratorOne === -1) {
            this.resMessage('warning', '请选择主裁')
          } else if (this.addObj.addArbitratorTwo === -1) {
            this.resMessage('warning', '请选择边裁')
          } else if (this.addObj.addArbitratorThree === -1) {
            this.resMessage('warning', '请选择边裁')
          } else {
            this.resAction('addRow', this.addObj)
          }
          break
        case 'addRow':
          axios.post('/assignRule/addOrUpdate/1', {
            startTimeStr: data.startTime,
            endTimeStr: data.endTime,
            arbitratorSole: data.addArbitratorSole,
            arbitratorOne: data.addArbitratorOne,
            arbitratorTwo: data.addArbitratorTwo,
            arbitratorThree: data.addArbitratorThree,
            arbitratorSoleName: data.addArbitratorSoleName === '随机分配' ? null : data.addArbitratorSoleName,
            arbitratorOneName: data.addArbitratorOneName === '随机分配' ? null : data.addArbitratorOneName,
            arbitratorTwoName: data.addArbitratorTwoName === '随机分配' ? null : data.addArbitratorTwoName,
            arbitratorThreeName: data.addArbitratorThreeName === '随机分配' ? null : data.addArbitratorThreeName
          }).then(res => {
            this.alertCanc('clearAddObj')
            this.resCaseList()
            this.resMessage('success', '操作成功')
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'saveRow':
          axios.post('/assignRule/addOrUpdate/2', {
            id: data.id,
            startTimeStr: this.editObj.startTime,
            endTimeStr: this.editObj.endTime,
            arbitratorSole: this.editObj.arbitratorSole,
            arbitratorOne: this.editObj.arbitratorOne,
            arbitratorTwo: this.editObj.arbitratorTwo,
            arbitratorThree: this.editObj.arbitratorThree,
            arbitratorSoleName: this.editObj.arbitratorSoleName === '随机分配' ? null : this.editObj.arbitratorSoleName,
            arbitratorOneName: this.editObj.arbitratorOneName === '随机分配' ? null : this.editObj.arbitratorOneName,
            arbitratorTwoName: this.editObj.arbitratorTwoName === '随机分配' ? null : this.editObj.arbitratorTwoName,
            arbitratorThreeName: this.editObj.arbitratorThreeName === '随机分配' ? null : this.editObj.arbitratorThreeName
          }).then(res => {
            this.resCaseList()
            this.resMessage('success', '操作成功')
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'resDel':
          this.alertObj.delData = {
            id: data.id
          }
          this.alertObj.del = true
          break
        case 'addStartTimeChange':
          this.addObj.startTime = data
          break
        case 'addEndTimeChange':
          this.addObj.endTime = data
          break
        case 'startTimeChange':
          this.editObj.startTime = data
          break
        case 'endTimeChange':
          this.editObj.endTime = data
          break
        case 'addArbitratorSole':
        case 'addArbitratorOne':
        case 'addArbitratorTwo':
        case 'addArbitratorThree':
          this.objType = 'addObj'
          this.alertObj.assignData = {
            type: type,
            resName: type === 'arbitratorSole' || type === 'arbitratorOne' ? '主 裁' : '边 裁',
            arbiNum: 1
          }
          this.alertObj.assign = true
          break
        case 'arbitratorSole':
        case 'arbitratorOne':
        case 'arbitratorTwo':
        case 'arbitratorThree':
          this.objType = 'editObj'
          this.alertObj.assignData = {
            type: type,
            resName: type === 'arbitratorSole' || type === 'arbitratorOne' ? '主 裁' : '边 裁',
            arbiNum: 1
          }
          this.alertObj.assign = true
          break
      }
    },
    alertSave (type, data) {
      switch (type) {
        case 'resAssign':
          let _obj = []
          let _switch = true
          if (this.alertObj.assignData.type !== 'arbitratorSole') {
            _obj = [this[this.objType].arbitratorOne, this[this.objType].arbitratorTwo, this[this.objType].arbitratorThree]
          }
          if (this.alertObj.assignData.type !== 'addArbitratorSole') {
            _obj = [this[this.objType].addArbitratorOne, this[this.objType].addArbitratorTwo, this[this.objType].addArbitratorThree]
          }
          _obj.forEach(i => {
            if (i !== -1 && i !== 0) {
              if (data.arbId === i) {
                this.resMessage('warning', '仲裁员不能重复选择')
                _switch = false
                return false
              }
            }
          })
          if (_switch) {
            this.alertObj.assign = false
            this[this.objType][this.alertObj.assignData.type] = data.arbId
            this[this.objType][this.alertObj.assignData.type + 'Name'] = data.arbIdName
            this.alertObj.assignData = null
          }
          break
        case 'resDel':
          this.alertObj.del = false
          this.alertObj.delData = null
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'resAssign':
          this.alertObj.assign = false
          this.alertObj.assignData = null
          break
        case 'resDel':
          this.alertObj.del = false
          this.alertObj.delData = null
          break
        case 'clearAddObj':
          this.addObj.startTime = ''
          this.addObj.endTime = ''
          this.addObj.addArbitratorSole = -1
          this.addObj.addArbitratorOne = -1
          this.addObj.addArbitratorTwo = -1
          this.addObj.addArbitratorThree = -1
          this.addObj.addArbitratorSoleName = '选择仲裁员'
          this.addObj.addArbitratorOneName = '选择仲裁员'
          this.addObj.addArbitratorTwoName = '选择仲裁员'
          this.addObj.addArbitratorThreeName = '选择仲裁员'
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
  ._search {
    max-width: 450px;
    margin-bottom: 20px;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
