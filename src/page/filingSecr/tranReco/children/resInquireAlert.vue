<template>
  <div class="_resAssginAlert">
    <alert-btn-info :isSaveBtn="true" :resWidth="760" :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Table ref="table" stripe align="center" :loading="progressList.loading" :columns="progressList.header" :data="progressList.bodyList"></Table>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'res_assgin_alert',
  props: ['resCaseId'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      progressList: {
        loading: false,
        header: [
          {
            title: '序号',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, params.index > 8 ? params.index + 1 : '0' + (params.index + 1))
            }
          },
          {
            title: '事件',
            key: 'name',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '处理日期',
            key: 'createtime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '处理结果',
            key: 'action',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '进度详情',
            key: 'memo',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'operatorName',
            tooltip: 'true',
            align: 'center'
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    resCaseList () {
      axios.post('/case/findCaseDetailsProcessByCaseid', {
        caseId: this.resCaseId
      }).then(res => {
        this.progressList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    alertSave () {
      this.$emit('alertConfirm')
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
