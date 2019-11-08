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
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'res-update-pendcase',
  components: { alertBtnInfo },
  props: [ 'caseId', 'resCaseType' ],
  data () {
    return {
      alertShow: true,
      caseTypeList: [],
      caseReson: null
    }
  },
  created () {
    this.resTypeList()
    if (this.resCaseType) {
      this.caseReson = this.resCaseType
    }
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
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
        axios.post('/case/updateCasesType', {
          caseId: this.caseId,
          type: this.caseReson
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
