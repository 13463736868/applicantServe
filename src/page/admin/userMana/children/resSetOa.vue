<template>
  <div class="_resSetOa">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>是否启用OA：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="resData.flag">
            <Option :value="0">启用</Option>
            <Option :value="1">停用</Option>
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
  name: 'res_set_oa',
  mixins: [resMess],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        flag: null
      }
    }
  },
  created () {
    this.resGetData()
  },
  methods: {
    resGetData () {
      axios.post('/OAReq/findOaConfig').then(res => {
        if (res.data.data !== null) {
          this.resData.flag = res.data.data.flag
        }
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.resData.flag === null) {
        this.resMessage('error', '选择不能为空')
        return false
      }
      axios.post('/OAReq/updateOaConfig', {
        flag: this.resData.flag
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
