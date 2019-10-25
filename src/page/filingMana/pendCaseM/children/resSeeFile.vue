<template>
  <div class="_resSeeFile">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="fileList.loading" :columns="fileList.header" :data="fileList.bodyList"></Table>
        </Col>
      </Row>
      <Row class="pt15">
        <Col span="16" class="tr">
          <Page simple :total="fileList.page.total" :current="fileList.page.pageNum" :page-size="fileList.page.pageSize" show-elevator show-total @on-change="reschangePageF"></Page>
        </Col>
        <Col span="8" class="tc">
          <Button type="primary" size="small" @click="dowZip">一键下载</Button>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import regi from '@/config/regiType.js'

export default {
  name: 'res_see_file',
  mixins: [resMess],
  props: ['resCaseId'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        fileIdArr: []
      },
      fileList: {
        header: [
          {
            title: '角色',
            key: 'peopleType',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.peopleType === '1' ? '申请人' : (params.row.peopleType === '2' ? '被申请人' : ''))
            }
          },
          {
            title: '文件名',
            key: 'filename',
            align: 'center'
          },
          {
            title: '操作',
            key: 'fileId',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.seeDoc(params.row.filepath)
                    }
                  }
                }, '预览'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.dowDoc(params.index)
                    }
                  }
                }, '下载')
              ])
            }
          }
        ],
        bodyList: [],
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 5
        }
      }
    }
  },
  created () {
    this.resFileList('once')
  },
  methods: {
    reschangePageF (page) {
      this.fileList.page.pageNum = page
      this.resFileList('more')
    },
    resFileList (type) {
      if (type === 'once') {
        axios.post('/case/findCaseFileList', {
          pageIndex: 0,
          pageSize: 999,
          caseId: this.resCaseId,
          caseState: 1
        }).then(res => {
          let _data = res.data.data
          for (let k in _data.dataList) {
            if (_data.dataList[k].fileId !== null) {
              this.resData.fileIdArr.push(_data.dataList[k].fileId)
            }
          }
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
      axios.post('/case/findCaseFileList', {
        pageIndex: (this.fileList.page.pageNum - 1) * this.fileList.page.pageSize,
        pageSize: this.fileList.page.pageSize,
        caseId: this.resCaseId,
        caseState: 1
      }).then(res => {
        let _data = res.data.data
        this.fileList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.fileList.page.total = _data.totalCount
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    seeDoc (path) {
      window.open(path, '_blank')
    },
    dowDoc (index) {
      window.open(regi.api + '/file/download/?fileName=' + this.fileList.bodyList[index].filename + '&filePath=' + this.fileList.bodyList[index].filepath, '_blank')
    },
    dowZip () {
      let _fileIds = this.resData.fileIdArr.join(',')
      if (_fileIds === '') {
        this.resMessage('warning', '暂无可下载文件')
      } else {
        window.open(regi.api + '/file/documentZip/download?fileIds=' + _fileIds, '_blank')
      }
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
