<template>
  <div class="resBatchEdit">
    <alert-btn-info :alertShow="alertShow" alertSaveText="下载" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">批次号：</p>
        </Col>
        <Col span="12">
          <Select v-model="resData.batchNo" filterable>
            <Option v-for="item in resData.batchNoList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
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
  name: 'resBatchEdit',
  mixins: [resMess],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        batchNo: null,
        batchNoList: []
      }
    }
  },
  created () {
    this.resBatchEdit()
  },
  methods: {
    resBatchEdit () {
      axios.get('/case/findAllBatchNo').then(res => {
        let _res = res.data.data
        _res.forEach(a => {
          let _o = {}
          _o.id = a
          _o.name = a
          this.resData.batchNoList.push(_o)
        })
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.resData.batchNo === null) {
        this.$Message.error({
          content: '请先选择一个批次号',
          duration: 5
        })
        return false
      }
      axios.post('/file/addJudgeTemplate', {
        batchNo: this.resData.batchNo,
        dataType: 2
      }).then(res => {
        res.data.data.split(',').forEach(b => {
          window.open(b, '_blank')
        })
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
@import '@/style/mixin';
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
  ._search {
    max-width: 450px;
    margin-bottom: 20px;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
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
