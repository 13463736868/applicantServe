<template>
  <div class="depaMana">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="部门名称"></Input>
        </Col>
        <Col span="2" offset="12">
          <Button type="primary" @click="resAddDepa('add')">添加</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
    <alert-btn-info :alertShow="alertShow.addDepa" @alertConfirm="addDepaSave" @alertCancel="alertCanc('addDepa')" :alertTitle="alertShow.typeName">
      <div>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>部门名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.name"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>部门编码：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.code"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>部门状态：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.state">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span"></span><b class="ml5">负责人：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.leader">
              <Option v-for="item in principalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </alert-btn-info>
    <alert-btn-info :alertShow="userObj.stateShow" @alertConfirm="stateSave" @alertCancel="alertCanc('state')" alertTitle="操作">
      <p v-if="userObj.stateCode === 2">确定要停用吗？</p>
      <p v-else-if="userObj.stateCode === 1">确定要启用吗？</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'depa_mana',
  components: { spinComp, alertBtnInfo },
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
            title: '部门编号',
            key: 'code',
            align: 'center'
          },
          {
            title: '部门名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.state === 1 ? '启用' : (params.row.state === 2 ? '停用' : '未知'))
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
          }
        ],
        bodyList: []
      },
      alertShow: {
        addDepa: false,
        type: '',
        typeName: ''
      },
      addData: {
        name: '',
        code: '',
        state: 1,
        leader: null
      },
      stateList: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '停用'
        }
      ],
      userId: null,
      userObj: {
        stateShow: false,
        stateCode: null
      },
      principalList: []
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.state === 1) {
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
                this.resStatusDepa(2, params.index)
              }
            }
          }, '停用'),
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
                this.resEditDepa(params.index)
              }
            }
          }, '修改')
        ])
      } else if (_obj.state === 2) {
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
                this.resStatusDepa(1, params.index)
              }
            }
          }, '启用'),
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
                this.resEditDepa(params.index)
              }
            }
          }, '修改')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.get('/auth/department', {
        params: {
          name: this.search.text
        }
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data === null ? [] : _data
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
      this.resCaseList()
    },
    resStatusDepa (type, index) {
      this.userObj.stateCode = type
      this.userId = this.caseList.bodyList[index].id
      this.userObj.stateShow = true
    },
    stateSave () {
      this.userObj.stateShow = false
      axios.put('/auth/department', {
        id: this.userId,
        state: this.userObj.stateCode
      }, {
        headers: {
          'content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.alertCanc('state')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('state')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resEditDepa (index) {
      let _res = this.caseList.bodyList[index]
      this.userId = _res.id
      this.addData.name = _res.name
      this.addData.state = _res.state
      this.addData.code = _res.code
      this.addData.leader = _res.leader === null ? '' : _res.leader.id
      this.resAddDepa('edit')
    },
    resAddDepa (type) {
      if (type === 'add') {
        this.alertShow.type = 'add'
        this.alertShow.typeName = '添加部门'
      } else if (type === 'edit') {
        this.alertShow.type = 'edit'
        this.alertShow.typeName = '修改部门'
      }
      axios.get('/user', {
        params: {
          pageNum: 1,
          pageSize: 500,
          name: ''
        }
      }).then(res => {
        let _res = res.data.data.list === null ? [] : res.data.data.list
        let select = []
        for (let k in _res) {
          let _o = {}
          _o.value = _res[k].id
          _o.label = _res[k].name + ' (' + _res[k].phone + ')'
          select.push(_o)
        }
        this.principalList = select
        this.alertShow.addDepa = true
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    addDepaSave () {
      if (this.addData.name === '') {
        this.$Message.warning({
          content: '部门名称不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.name, 'name')) {
        this.$Message.warning({
          content: '部门名称只能包含汉字',
          duration: 5
        })
      } else if (this.addData.code === '') {
        this.$Message.warning({
          content: '部门编码不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.code, 'depaCode')) {
        this.$Message.warning({
          content: '部门编码只能包含数字,字母及下划线,长度6~20位',
          duration: 5
        })
      } else {
        this.sendAjax()
      }
    },
    sendAjax () {
      let type = this.alertShow.type
      if (type === 'add') {
        this.alertShow.addDepa = false
        axios.post('/auth/department', {
          name: this.addData.name,
          code: this.addData.code,
          state: this.addData.state,
          leaderId: this.addData.leader
        }).then(res => {
          this.alertCanc('addDepa')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addDepa')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (type === 'edit') {
        this.alertShow.addDepa = false
        axios.put('/auth/department', {
          id: this.userId,
          name: this.addData.name,
          code: this.addData.code,
          state: this.addData.state,
          leader: {id: this.addData.leader}
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('addDepa')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addDepa')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc (type) {
      if (type === 'addDepa') {
        this.alertShow.addDepa = false
        this.addData.name = ''
        this.addData.code = ''
        this.addData.state = 1
        this.addData.leader = null
        this.userId = null
        this.addData.principal = ''
        this.alertShow.type = ''
        this.alertShow.typeName = ''
      } else if (type === 'state') {
        this.userId = null
        this.userObj.stateShow = false
        this.userObj.stateCode = null
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
