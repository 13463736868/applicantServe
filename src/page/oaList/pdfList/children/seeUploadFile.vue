<template>
  <div class="_alertBtnInfo" v-if="alertShow">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      @on-cancel="alertCancel"
      class="not_s"
      width="800">
      <div>
      <spin-comp :spinShow="spinShow"></spin-comp>
        <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
        </Table>
      </div>
      <div slot="footer">
        <Button v-if="isSaveBtn === true" size="large" @click="alertCancel">取消</Button>
        <Button v-if="isSaveBtn === true" type="primary" size="large" @click="alertConfirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import spinComp from '@/components/common/spin'
export default {
  name: 'alert_btn_info',
  props: ['alertTitle', 'alertId'],
  components: { spinComp },
  data () {
    return {
      spinShow: false,
      isSaveBtn: false,
      alertShow: true,
      caseList: {
        loading: false,
        header: [
          {
            title: '抓取内容',
            key: 'interceptName',
            align: 'center'
          },
          {
            title: '起始位置',
            key: 'interceptStart',
            align: 'center'
          },
          {
            title: '结束为止',
            key: 'interceptEnd',
            align: 'center'
          },
          {
            title: '抓取结果',
            key: 'interceptValue',
            width: 300
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    this.resCaseDetails()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resCaseDetails () {
      this.spinShow = true
      axios.post('/findPdfWord', {
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        pdfId: this.alertId
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertConfirm () {
      this.$emit('alertConfirm')
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
