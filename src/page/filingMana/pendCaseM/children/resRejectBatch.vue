<template>
  <div>
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="4" offset="1">
          <p><span class="_span">*</span><b>退回原因：</b></p>
        </Col>
        <Col span="16" class="lh32">
          <Input v-model.trim="rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入退回原因..." />
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'resRejectBatch',
  mixins: [resMess],
  components: { alertBtnInfo },
  props: {
    resPropsData: {
      type: Array / Object,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      alertShow: true,
      rejeReason: ''
    }
  },
  methods: {
    alertCanc () {
      this.$emit('alertCancel')
    },
    alertSave () {
      if (this.rejeReason === '') {
        this.resMessage('warning', '请填写退回原因')
      } else {
        axios.put('/caseBatch/auditReject_batch', {
          items: JSON.stringify(this.resPropsData),
          reason: this.rejeReason
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
