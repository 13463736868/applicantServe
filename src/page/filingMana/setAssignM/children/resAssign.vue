<template>
  <div class="resAssign">
    <Modal
      v-model="alertShow"
      title="操作"
      :mask-closable="false"
      @on-cancel="alertCanc"
      class="not_s">
      <div class="pb10">
        <Row class="mb5">
          <Col span="3" offset="1">
            <label class="lh25 f12 fb fl mr15">搜 索 :</label>
          </Col>
          <Col span="8">
            <Input :maxlength="15" size="small" clearable v-model.trim="searchText" icon="md-search" placeholder=""></Input>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
            <span class="lh24"><b>{{resPropsData.resName}}： </b></span>
            <!-- <span v-if="seleArrName[0] !== ''"><span class="ml5 lh24" v-text="seleArrName[0]"></span></span> -->
            <Button class="fr" size="small" type="primary" @click="alertSave({id: 0, name: '随机分配'})">随机分配</Button>
          </Col>
        </Row>
      </div>
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList">
            <template slot-scope="{ row, index }" slot="action">
              <Button class="ml10" size="small" type="primary" @click="alertSave(row)">选择</Button>
            </template>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col span="12" offset="6" class="tc pt10">
          <Page simple :total="selePageObj.total" :current="selePageObj.pageNum" :page-size="selePageObj.pageSize" show-total @on-change="resChanPage"></Page>
        </Col>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess, resTimeOut } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'resAssign',
  mixins: [resMess, resTimeOut],
  props: {
    resPropsData: {
      type: Object,
      default: function () {
        return {
          type: '',
          resName: '',
          arbiNum: 1
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
            slot: 'action'
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
    alertSave (obj) {
      let _data = {}
      _data.arbId = obj.id
      _data.arbIdName = obj.name
      this.$emit('alertConfirm', _data)
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
