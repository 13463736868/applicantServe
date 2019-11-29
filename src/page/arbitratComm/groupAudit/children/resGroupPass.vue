<template>
  <div class="resGroupPass">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要同意吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'res_group_pass',
  mixins: [resMess],
  props: ['resGroupPassData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: null
    }
  },
  computed: {
    resSaveUrl () {
      if (this.resGroupPassData.logicState === '19') {
        return '/approve/updateGroupApproveToArbitrator'
      } else if (this.resGroupPassData.logicState === '20') {
        return '/approve/updateArbitrator'
      } else {
        return ''
      }
    }
  },
  methods: {
    alertSave () {
      axios.post(this.resSaveUrl, {
        caseId: this.resGroupPassData.resCaseId,
        arbitratorIds: this.resGroupPassData.resArbiId,
        tribunalRequestId: this.resGroupPassData.resTribId
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
