<template>
  <div>
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="4" offset="2">
          <div class="_label">案由：</div>
        </Col>
        <Col span="16">
          <Select v-model="caseReson">
            <Option v-for="item in caseTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'resUpdateTypeBatch',
  mixins: [resMess],
  components: { alertBtnInfo },
  props: {
    resPropsData: {
      type: Array / Object,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      alertShow: true,
      caseTypeList: [],
      caseReson: null
    }
  },
  created () {
    this.resTypeList()
  },
  methods: {
    resTypeList () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'caseType'
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.caseTypeList = _select
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertCanc () {
      this.$emit('alertCancel')
    },
    alertSave () {
      if (this.caseReson === null || this.caseReson === 'undefined') {
        this.resMessage('warning', '请先选择案由')
      } else {
        axios.put('/caseBatch/updateCaseType_batch', {
          items: this.resPropsData,
          caseType: this.caseReson
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.resMessage('success', '操作成功')
          this.$emit('alertConfirm')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._labelFor {
  margin-bottom: 10px;
  ._label {
    padding: 7px 0;
  }
}
</style>
