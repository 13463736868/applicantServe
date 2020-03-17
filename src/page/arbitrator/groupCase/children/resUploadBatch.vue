<template>
  <div class="resReason">
    <alert-btn-info :isCancBtn="true" :isSaveBtn="true" :alertShow="alertShow" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="24">
          <upload-book :docuType="0" childName="上传zip压缩文件" :fileType="['zip']" :uploadUrl="resUploadUrl" @saveClick="alertSave" @cancClick="alertCanc('alertShow')"></upload-book>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :isSaveBtn="true" :alertShow="seleListShow" @alertCancel="alertCanc('seleListShow')" alertTitle="批量导入状态">
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList"></Table>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import alertBtnInfo from '@/components/common/alertBtnInfo'
import uploadBook from '@/page/arbitrator/groupCase/children/uploadBook'
import regi from '@/config/regiType.js'
export default {
  name: 'resReason',
  props: ['resPropsData'],
  components: { alertBtnInfo, uploadBook },
  data () {
    return {
      alertShow: true,
      resData: 1,
      seleListShow: false,
      seleList: {
        loading: false,
        header: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: '文件名称',
            key: 'fileName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'message',
            align: 'center'
          }
        ],
        bodyList: []
      }
    }
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/batchUpload/uploadZip'
    }
  },
  methods: {
    alertSave (obj) {
      if (obj.length !== 0) {
        this.alertShow = false
        this.seleList.bodyList = obj
        this.seleListShow = true
      } else {
        this.$emit('alertConfirm')
      }
    },
    alertCanc (type) {
      if (type === 'seleListShow') {
        this.$emit('alertConfirm')
      } else {
        this.$emit('alertCancel')
      }
      this[type] = false
    }
  }
}
</script>
