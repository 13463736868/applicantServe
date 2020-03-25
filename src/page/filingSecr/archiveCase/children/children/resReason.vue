<template>
  <div class="resReason">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>{{resPropsData.reason}}</p>
    </alert-btn-info>
  </div>
</template>

<script>
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'resReason',
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    alertSave () {
      this.$emit('alertConfirm')
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
