<template>
  <div>
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要{{resPropsData.type === 'batch' ? '批量' : ''}}通过吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'resBatchPass',
  mixins: [resMess],
  components: { alertBtnInfo },
  props: {
    resPropsData: {
      type: Array / Object,
      default: function () {
        return {
          caseId: '',
          costs: '',
          idsList: [],
          state: '',
          type: ''
        }
      }
    }
  },
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    alertCanc () {
      this.$emit('alertCancel')
    },
    alertSave () {
      if (this.resPropsData.type === 'batch') {
        axios.put('/caseBatch/updateCaseStateAnd_batch', {
          items: JSON.stringify(this.resPropsData.idsList),
          state: this.resPropsData.state
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.$emit('alertConfirm')
          this.resMessage('success', '操作成功')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      } else {
        axios.post('/case/updateCaseStateAnd', {
          caseId: this.resPropsData.caseId,
          costs: this.resPropsData.costs
        }).then(res => {
          this.$emit('alertConfirm')
          this.resMessage('success', '操作成功')
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
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
