<template>
  <div class="_resDelAppr">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要删除吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'res_del_appr',
  mixins: [resMess],
  props: ['resId'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: null
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    alertSave () {
      axios.post('/OAReq/delOa', {
        id: this.resId,
        userId: this.usersInfo.id,
        userName: this.usersInfo.name
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
}
</style>
