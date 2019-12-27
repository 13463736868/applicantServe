<template>
  <div class="resSubmit">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要提交吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'resSubmit',
  mixins: [resMess],
  props: ['resVal'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: null
    }
  },
  created () {
    if (this.resVal !== null) {
      this.resData = JSON.parse(JSON.stringify(this.resVal))
    }
  },
  methods: {
    alertSave () {
      axios.post('/approve/updateCaseDocument', {
        documentId: this.resData.documentId
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
  ._input {
    padding: 7px 0;
    color: #337BB5;
    ._del {
      font-size: 14px;
      color: #ff7a7a;
      vertical-align: text-bottom;
    }
  }
}
._radio {
  padding: 7px 0;
}
</style>
