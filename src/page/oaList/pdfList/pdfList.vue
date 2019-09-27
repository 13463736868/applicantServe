<template>
  <div class="pdfList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2" class="pb20 tr" offset="22">
          <Button type="primary" @click="resAction('add', null)">添加</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
          <template slot-scope="{ row, index }" slot="action">
            <Button class="mr5" type="primary" size="small" @click="resAction('see', row)">预览</Button>
          </template>
        </Table>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
          </Col>
        </Row>
      </div>
      <pdf-detials v-if="alertShow.addModel" :alertTitle="alertShow.addModelTitle" @alertConfirm="alertSave('add')" @alertCancel="alertCanc('add')"></pdf-detials>
      <see-upload-file v-if="alertShow.seeModel" :alertTitle="alertShow.seeModelTitle" :alertId="alertShow.resId" @alertCancel="alertCanc('see')"></see-upload-file>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import spinComp from '@/components/common/spin'
import pdfDetials from '@/page/oaList/pdfList/children/pdfDetials'
import seeUploadFile from '@/page/oaList/pdfList/children/seeUploadFile'
export default {
  name: 'pdef_List',
  components: { pdfDetials, spinComp, seeUploadFile },
  data () {
    return {
      spinShow: false,
      caseList: {
        loading: false,
        header: [
          {
            title: 'ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '文件名字',
            key: 'fileName',
            align: 'center'
          },
          {
            title: '创建人',
            key: 'userName',
            align: 'center'
          },
          {
            title: '文件链接',
            key: 'filePath',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '添加时间',
            key: 'createTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            width: 100,
            slot: 'action'
          }
        ],
        bodyList: []
      },
      alertShow: {
        addModel: false,
        addModelTitle: '添加',
        seeModel: false,
        seeModelTitle: '预览',
        resId: null
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.resCaseList()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/grapWordList', {
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        pageIndex: this.pageObj.pageNum,
        pageSize: this.pageObj.pageSize
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resAction (type, data) {
      switch (type) {
        case 'see':
          this.alertShow.seeModel = true
          this.alertShow.resId = data.id
          break
        case 'add':
          this.alertShow.addModel = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'seeAppr':
          this.alertObj.see = false
          this.alertObj.resId = null
          this.resSearch()
          break
        case 'add':
          this.alertShow.addModel = false
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'add':
          this.alertShow.addModel = false
          break
        case 'see':
          this.alertShow.seeModel = false
          this.alertShow.resId = null
          break
      }
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
