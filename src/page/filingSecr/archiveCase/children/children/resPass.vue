<template>
  <div class="resPass">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p v-if="resPropsData.state === 1">确定要通过吗？</p>
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
  name: 'resPass',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        reason: ''
      }
    }
  },
  methods: {
    alertSave () {
      switch (this.resPropsData.state) {
        case 1:
          axios.post(this.resPropsData.url, {
            caseIds: this.resPropsData.ids.join(','),
            confirmType: this.resPropsData.state
          }).then(res => {
            this.$emit('alertConfirm')
            this.resMessage('success', '操作成功')
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
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
