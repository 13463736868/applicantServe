<template>
  <div class="resDel">
    <alert-btn-info :alertShow="alertShow" alertCancText="再想想" alertSaveText="删除" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>您确认删除目标规则吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'resDel',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {}
    }
  },
  methods: {
    alertSave () {
      axios.post('assignRule/deleteById', {
        id: this.resPropsData.id
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
