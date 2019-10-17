<template>
  <div class="_resSetProc">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>审核：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="resData.flag">
            <Option value="通过">通过</Option>
            <Option value="驳回">驳回</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>原因：</b></p>
        </Col>
        <Col span="16">
          <Input v-model.trim="resData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入原因..." />
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'res_set_proc',
  mixins: [resMess],
  props: ['resTaskId'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        id: null,
        flag: null,
        reason: ''
      }
    }
  },
  created () {
    this.resGetData()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resGetData () {
      axios.post('/OAReq/findOaByTaskId', {
        taskId: this.resTaskId,
        userId: this.usersInfo.id,
        userName: this.usersInfo.name
      }).then(res => {
        this.resData.id = res.data.data === null ? null : res.data.data.id
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.resData.flag === null) {
        this.resMessage('error', '审核选择不能为空')
        return false
      }
      axios.post('/OAReq/dealOaTask', {
        id: this.resData.id,
        taskId: this.resTaskId,
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        dealFlag: this.resData.flag,
        reason: this.resData.reason
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
  ._label {
    padding: 7px 0;
  }
}
</style>
