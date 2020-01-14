<template>
  <div class="resBatchSaveForm">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要批量保存{{resIdsList[0]['formType'] === 21 ? '立案' : resIdsList[0]['formType'] === 22 ? '组庭' : ''}}审批表吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'resBatchSaveForm',
  mixins: [resMess],
  props: {
    resIdsList: {
      type: Array / Object,
      default: function () {
        return [
          {
            formType: ''
          }
        ]
      }
    }
  },
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {}
    }
  },
  created () {
    console.log(this.resIdsList)
  },
  methods: {
    alertSave () {
      axios.put('/caseBatch/saveForm_batch', {
        items: JSON.stringify(this.resIdsList)
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
