<template>
  <div class="resBillNumber">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>票据单号：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.billNumber"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>再次输入票据单号：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="resData.billNumberTwo"></Input>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'res_billNumber',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        billNumber: '',
        billNumberTwo: ''
      }
    }
  },
  methods: {
    alertSave () {
      if (this.resData.billNumber === '') {
        this.resMessage('error', '请输入票据号码')
        return false
      } else if (this.resData.billNumber !== this.resData.billNumberTwo) {
        this.resMessage('error', '俩次输入票据号码不一致')
        return false
      }
      axios.post('/payMentRequest/updateBillNumber', {
        caseId: this.resPropsData.caseId,
        billNumber: this.resData.billNumber
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
<style lang="scss" scoped>
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
}
</style>
