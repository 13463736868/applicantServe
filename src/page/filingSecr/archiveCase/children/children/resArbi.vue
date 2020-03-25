<template>
  <div class="resArbi">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="4" offset="2">
          <div class="_label">仲裁费：</div>
        </Col>
        <Col span="16">
          <Input v-model.trim="resData.cost" clearable placeholder="请输入仲裁费"/>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'resArbi',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        cost: ''
      }
    }
  },
  methods: {
    alertSave () {
      if (this.resData.cost === '' || this.resData.cost === 0) {
        this.resMessage('error', '请输入仲裁费,且仲裁费不能为零')
      } else if (!setRegExp(this.resData.cost, 'money')) {
        this.resMessage('error', '请正确填写仲裁费格式')
      } else {
        axios.post(this.resPropsData.url, {
          caseId: this.resPropsData.id,
          cost: this.resData.cost
        }).then(res => {
          this.$emit('alertConfirm')
          this.resMessage('success', '操作成功')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
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
