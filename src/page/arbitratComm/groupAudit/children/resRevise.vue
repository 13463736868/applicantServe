<template>
  <div class="resRevise">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <div class="pb10">
        <Row class="mb5">
          <Col span="3" offset="1">
            <label class="lh25 f12 fb fl mr15">搜 索 :</label>
          </Col>
          <Col span="8">
            <Input :maxlength="15" size="small" v-model.trim="searchText" icon="md-search" placeholder=""></Input>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1">
            <span><b>首席仲裁员： </b></span>
            <span v-if="seleArrName[0] !== ''"><span class="ml5" v-text="seleArrName[0]"></span><Icon @click="resSeleDel(0)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
        <Row v-if="seleShow">
          <Col span="20" offset="1">
            <span><b>其他仲裁员：</b></span>
            <span v-if="seleArrName[1] !== ''"><span class="ml5" v-text="seleArrName[1]"></span><Icon @click="resSeleDel(1)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
          <Col span="20" offset="1">
            <span><b>其他仲裁员：</b></span>
            <span v-if="seleArrName[2] !== ''"><span class="ml5" v-text="seleArrName[2]"></span><Icon @click="resSeleDel(2)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
      </div>
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="12" offset="6" class="tc pt10">
          <Page simple :total="selePageObj.total" :current="selePageObj.pageNum" :page-size="selePageObj.pageSize" show-total @on-change="resChanPage"></Page>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess, resTimeOut } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'resRevise',
  mixins: [resMess, resTimeOut],
  props: {
    resPropsData: {
      type: Object,
      default: function () {
        return {
          caseId: null,
          logicState: '',
          arbiNum: null,
          resTribId: ''
        }
      }
    }
  },
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
      },
      seleList: {
        loading: false,
        header: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '擅长领域',
            key: 'sign',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          }
        ],
        bodyList: []
      },
      seleArr: [''],
      seleArrName: [''],
      selePageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 5
      },
      searchText: ''
    }
  },
  created () {
    this.resGetData()
    this.$watch('searchText', this.debounce(this.resSearch, 1000))
  },
  mounted () {
    this.seleArr = this.seleShow === true ? ['', '', ''] : ['']
    this.seleArrName = this.seleShow === true ? ['', '', ''] : ['']
  },
  computed: {
    seleShow () {
      if (this.resPropsData.arbiNum === null) {
        return false
      } else if (this.resPropsData.arbiNum === 1) {
        return false
      } else if (this.resPropsData.arbiNum === 3) {
        return true
      } else {
        return false
      }
    },
    resSaveUrl () {
      if (this.resPropsData.logicState === '20') {
        return '/approve/updateArbitrator'
      } else if (this.resPropsData.logicState === '19') {
        return '/approve/updateGroupApproveToArbitrator'
      } else {
        return ''
      }
    }
  },
  methods: {
    resGetData () {
      axios.post('/clientRequest/findUsersList', {
        pageIndex: (this.selePageObj.pageNum - 1) * this.selePageObj.pageSize,
        pageSize: this.selePageObj.pageSize,
        roleName: 'arbitrator',
        keyword: this.searchText
      }).then(res => {
        this.seleList.bodyList = res.data.data.dataList === null ? [] : res.data.data.dataList
        this.selePageObj.total = res.data.data.totalCount
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSearch () {
      this.selePageObj.pageNum = 1
      this.resGetData()
    },
    resChanPage (page) {
      this.selePageObj.pageNum = page
      this.resGetData()
    },
    renderCheck (h, params) {
      let _id = params.row.id
      if (this.seleArr.indexOf(_id) === -1) {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-square-outline',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.index, true)
              }
            }
          })
        ])
      } else {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-checkbox',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.index, false)
              }
            }
          })
        ])
      }
    },
    seleArrChange (index, bool) {
      let _id = this.seleList.bodyList[index].id
      let _name = this.seleList.bodyList[index].name
      let _userNum = this.seleShow === true ? '三' : '一'
      if (bool) {
        if (this.seleArr.indexOf(_id) === -1) {
          let _t = false
          for (let k in this.seleArr) {
            if (this.seleArr[k] === '') {
              this.seleArr[k] = _id
              this.seleArrName[k] = _name
              this.seleArr.splice(k, 0)
              this.seleArrName.splice(k, 0)
              _t = true
              break
            }
          }
          if (!_t) {
            this.resMessage('error', '仲裁员最多只能选择' + _userNum + '位！')
          }
        }
      } else {
        if (this.seleArr.indexOf(_id) !== -1) {
          this.seleArrName.splice(this.seleArr.indexOf(_id), 1, '')
          this.seleArr.splice(this.seleArr.indexOf(_id), 1, '')
        }
      }
    },
    resSeleDel (num) {
      this.seleArr[num] = ''
      this.seleArrName[num] = ''
      this.resGetData()
    },
    alertSave () {
      for (let k in this.seleArr) {
        if (this.seleArr[k] === '') {
          this.$Message.error({
            content: '请选择第 ' + (k - 0 + 1) + ' 位仲裁员后再点击确定',
            duration: 5
          })
          return false
        }
      }
      axios.post(this.resSaveUrl, {
        caseId: this.resPropsData.caseId,
        tribunalRequestId: this.resPropsData.resTribId,
        arbitratorIds: this.seleArr.join(',')
      }).then(res => {
        this.resMessage('success', '操作成功')
        this.$emit('alertConfirm')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertCanc () {
      this.$emit('alertCancel')
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
}
</style>
