<template>
  <div class="_resAssginAlert">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <RadioGroup v-model="userId" vertical>
        <template v-for="item in userList">
          <Radio :label="item.id" :key="item.id">
            <Icon type="social-apple"></Icon>
            <span v-text="item.name"></span>
          </Radio>
        </template>
      </RadioGroup>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'res_assgin_alert',
  props: ['resCaseIdList'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      userId: null,
      userList: []
    }
  },
  created () {
    this.resUserList()
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    resUserList () {
      axios.post('/user/queryCaseAssignUsers').then(res => {
        this.userList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.userId === null) {
        this.resMessage('warning', '请先选择一位分配人员')
      } else {
        axios.post('/caseAssign/assignCase', {
          caseIds: this.resCaseIdList.join(','),
          userId: this.userId
        }).then(res => {
          this.resMessage('success', '操作成功')
          this.$emit('alertConfirm')
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
</style>
