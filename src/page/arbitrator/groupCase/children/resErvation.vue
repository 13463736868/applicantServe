<template>
  <div class="resErvation">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="beginSave" @alertCancel="alertCanc('begin')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">指定开庭时间：</p>
        </Col>
        <Col span="12">
          <DatePicker @on-change="changeDate" type="datetime" placeholder="请指定开庭时间"></DatePicker>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'res_ervation',
  mixins: [resMess],
  props: ['resErvationData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      alertObj: {
        time: ''
      }
    }
  },
  methods: {
    changeDate (val) {
      this.alertObj.time = val
    },
    beginSave () {
      if (!this.alertObj.time) {
        this.resMessage('warning', '开庭时间不能为空')
      } else {
        axios.post('/getDateSection').then(res => {
          let _res = res.data.data
          try {
            let _time = this.alertObj.time.substr(0, 10).split('-').join('')
            let _sTime = res.data.data.startDate.split('-').join('')
            let _eTime = res.data.data.endDate.split('-').join('')
            if (_time - _sTime < 0 || _time - _eTime > 0) {
              this.resMessage('warning', '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间')
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.resMessage('error', '调取时间范围出错,稍后再试')
          }
        }).catch(e => {
          this.resMessage('error', '调取时间范围出错,稍后再试')
        })
      }
    },
    alertCanc () {
      this.$emit('alertCancel')
    },
    upTimeSave () {
      axios.post('/approve/updateBeginTime', {
        caseId: this.resErvationData.id,
        beginTime: this.alertObj.time,
        updateType: 2
      }).then(res => {
        this.$emit('alertConfirm')
        this.resMessage('success', '操作成功')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    }
  }
}
</script>
