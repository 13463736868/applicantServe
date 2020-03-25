<template>
  <div class="resFiling">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor" v-if="resPropsData.state === 1">
        <Col span="4" offset="2">
          <div class="_label">纠纷类型：</div>
        </Col>
        <Col span="16">
          <Select v-model="resData.caseType">
            <Option v-for="item in resData.caseTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="resPropsData.state === 2">
        <div class="mb10">驳回原因：</div>
        <Input :autosize="{minRows: 5,maxRows: 7}" type="textarea" v-model="resData.reason" placeholder="输入驳回原因..." />
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'resFiling',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        caseType: '',
        caseTypeList: {},
        reason: ''
      }
    }
  },
  created () {
    this.resConfCase('caseType')
  },
  methods: {
    resConfCase (_type) {
      axios.post('/dictionary/findDictionaryList', {
        type: _type
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.resData.caseTypeList = _select
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      switch (this.resPropsData.state) {
        case 1:
          if (this.resData.caseType === '') {
            this.resMessage('error', '请选择纠纷类型')
          } else {
            axios.post(this.resPropsData.url, {
              caseIds: this.resPropsData.ids.join(','),
              confirmType: this.resPropsData.state,
              caseType: this.resData.caseType
            }).then(res => {
              this.$emit('alertConfirm')
              this.resMessage('success', '操作成功')
            }).catch(e => {
              this.resMessage('error', '错误信息:' + e + ' 稍后再试')
            })
          }
          break
        case 2:
          if (this.resData.reason.length === 0) {
            this.resMessage('error', '请输入驳回原因')
          } else {
            axios.post(this.resPropsData.url, {
              caseIds: this.resPropsData.ids.join(','),
              confirmType: this.resPropsData.state,
              reason: this.resData.reason
            }).then(res => {
              this.$emit('alertConfirm')
              this.resMessage('success', '操作成功')
            }).catch(e => {
              this.resMessage('error', '错误信息:' + e + ' 稍后再试')
            })
          }
          break
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
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
  ._label {
    padding: 7px 0;
  }
}
</style>
