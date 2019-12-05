<template>
  <div class="resBatchFiling">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p v-if="resPropsData.type === 'resBatchFiling'" class="mb10">确定要批量立案吗？</p>
      <p v-if="resPropsData.type === 'resResubmitBatch'" class="mb10">确定要批量重新提交吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'res_batchFiling',
  mixins: [resMess],
  props: {
    resPropsData: {
      type: Object,
      default: function () {
        return {
          caseIds: [],
          type: ''
        }
      }
    }
  },
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: null
    }
  },
  methods: {
    alertSave () {
      axios.put('/caseBatch/updateCaseStateAndType_batch', {
        items: JSON.stringify(this.resPropsData.caseIds)
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
