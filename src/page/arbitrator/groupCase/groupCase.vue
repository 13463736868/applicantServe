<template>
  <div class="groupCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">组庭案件</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" placeholder="" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'

export default {
  name: 'group_case',
  components: { headTop, spinComp },
  data () {
    return {
      spinShow: false,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '案号',
            key: 'code',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.goCaseInfo(params.index)
                  }
                }
              }, params.row.code)
            }
          },
          {
            title: '案件编号',
            key: 'id',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'partyName',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            align: 'center'
          },
          {
            title: '案件状态',
            key: 'caseState',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            align: 'center'
          },
          {
            title: '重新生成原因',
            key: 'caseDocumentReason',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 70,
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
          }
        ],
        bodyList: []
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
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.arbitratorRole === 1) {
        if (_obj.state === 4) {
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
                  this.goCourtRoom(params.index)
                }
              }
            }, '进入庭室'),
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
                  this.resCancCase(params.index)
                }
              }
            }, '撤回'),
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
                  this.resEndCase(params.index)
                }
              }
            }, '结案')
          ])
        } else if (_obj.state === 6) {
          if (_obj.caseDocumentState1 === '2') {
            if (_obj.caseDocumentState2 === '4') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(12, params.index)
                    }
                  }
                }, '重新生成决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(24, params.index)
                    }
                  }
                }, '生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '2') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(12, params.index)
                    }
                  }
                }, '重新生成决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(22, params.index)
                    }
                  }
                }, '重新生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '3') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(12, params.index)
                    }
                  }
                }, '重新生成决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '补正书审核中')
              ])
            } else {
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
                      this.resRenderDoc(12, params.index)
                    }
                  }
                }, '重新生成决定/裁决书')
              ])
            }
          } else if (_obj.caseDocumentState1 === '1') {
            if (_obj.caseDocumentState2 === '4') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(11, params.index)
                    }
                  }
                }, '打印决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(24, params.index)
                    }
                  }
                }, '生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '2') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(11, params.index)
                    }
                  }
                }, '打印决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(22, params.index)
                    }
                  }
                }, '重新生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '3') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.resRenderDoc(11, params.index)
                    }
                  }
                }, '打印决定/裁决书'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '补正书审核中')
              ])
            } else {
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
                      this.resRenderDoc(11, params.index)
                    }
                  }
                }, '打印决定/裁决书')
              ])
            }
          } else {
            if (_obj.caseDocumentState2 === '4') {
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
                      this.resRenderDoc(24, params.index)
                    }
                  }
                }, '生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '2') {
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
                      this.resRenderDoc(22, params.index)
                    }
                  }
                }, '重新生成补正书')
              ])
            } else if (_obj.caseDocumentState2 === '3') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '补正书审核中')
              ])
            } else {
              return h('div', [
              ])
            }
          }
        } else {
          return h('div', [
          ])
        }
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findCaseGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text
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
    resSearch () {
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    goCaseInfo (index) {
      console.log(this.caseList.bodyList[index])
    },
    goCourtRoom (index) {
      console.log(this.caseList.bodyList[index])
    },
    resCancCase (index) {
      console.log(this.caseList.bodyList[index])
    },
    resEndCase (index) {
      console.log(this.caseList.bodyList[index])
    },
    resRenderDoc (type, index) {
      // 12 重新生成决定/裁决书;24 生成补正书; 22 重新生成补正书;11 打印决定/裁决书
      console.log(type, this.caseList.bodyList[index])
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
</style>
