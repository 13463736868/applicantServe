<template>
  <div class="_alertBtnInfo" v-if="alertShow">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      @on-cancel="alertCancel"
      class="not_s">
      <div>
      <spin-comp :spinShow="spinShow"></spin-comp>
        <Row class="pl20">
          <Col span="24" class="pr20 pb10" v-for="item in pdfDteailsList" :value="item.id" :key="item.id">
            <Row class="_labelFor">
              <Col span="6" class="pb10">
                <p>
                  <b>抓取文字标识：</b>
                </p>
              </Col>
              <Col span="18" class="pr20 pb10">
                <p>{{item.fieldName}}</p>
              </Col>
              <Col span="6">
                <p>
                  <b>抓取结果：</b>
                </p>
              </Col>
              <Col span="18" class="pr20">
                <p>{{item.fieldValue}}</p>
              </Col>
            </Row>
          </Col>
        </Row>
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
      pdfDteailsList: []
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
        this.pdfDteailsList = _data
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
