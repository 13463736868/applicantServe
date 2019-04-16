<template>
  <div class="postMana">
    <head-top :isRegister="true">
      <span class="f36 fcf">角色管理</span>
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
        <Col span="2" offset="12">
          <Button type="primary" @click="resAddPost('add')">添加</Button>
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
    <alert-btn-info :alertShow="userObj.stateShow" @alertConfirm="stateSave" @alertCancel="alertCanc('state')" alertTitle="操作">
      <p v-if="userObj.stateCode === 2">确定要停用吗？</p>
      <p v-else-if="userObj.stateCode === 1">确定要启用吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.addPost" @alertConfirm="addPostSave" @alertCancel="alertCanc('addPost')" :alertTitle="alertShow.typeName">
      <div>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>角色名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.name"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>角色状态：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.state">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </alert-btn-info>
    <alert-btn-info :alertShow="userObj.restShow" @alertConfirm="restSave" @alertCancel="alertCanc('rest')" alertTitle="操作">
      <div v-for="(item, index) in restList" :key="index">
        <Checkbox class="pb5 ml10" v-model="item.check">{{item.name}}</Checkbox>
      </div>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'post_mana',
  components: { headTop, spinComp, alertBtnInfo },
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
            title: '职位名称',
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
        addPost: false,
        type: '',
        typeName: ''
      },
      addData: {
        name: '',
        state: 1
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
        stateCode: null,
        restShow: false
      },
      restList: []
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
                this.resStatusPost(2, params.index)
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
                this.resEditPost(params.index)
              }
            }
          }, '修改'),
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
                this.resRestPost(params.index)
              }
            }
          }, '配置')
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
                this.resStatusPost(1, params.index)
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
                this.resEditPost(params.index)
              }
            }
          }, '修改'),
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
                this.resRestPost(params.index)
              }
            }
          }, '配置')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.get('/auth/role', {
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
    resStatusPost (type, index) {
      this.userObj.stateCode = type
      this.userId = this.caseList.bodyList[index].id
      this.userObj.stateShow = true
    },
    stateSave () {
      this.userObj.stateShow = false
      axios.put('/auth/role', {
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
    resEditPost (index) {
      let _res = this.caseList.bodyList[index]
      this.userId = _res.id
      this.addData.name = _res.name
      this.addData.state = _res.state
      this.resAddPost('edit')
    },
    resRestPost (index) {
      let _res = this.caseList.bodyList[index]
      this.userId = _res.id
      axios.get('/auth/function/' + _res.id).then(res => {
        let _res = res.data.data
        let _list = []
        for (let k in _res) {
          let _o = {}
          _o.check = _res[k].checked
          _o.name = _res[k].name
          _o.id = _res[k].id
          _list.push(_o)
        }
        this.restList = _list
        this.userObj.restShow = true
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    restSave () {
      let list = this.restList
      let arr = []
      for (let k in list) {
        if (list[k].check) {
          arr.push({id: list[k].id})
        }
      }
      this.userObj.restShow = false
      axios.put('/auth/function/' + this.userId, arr, {
        headers: {
          'content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.alertCanc('rest')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('rest')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resAddPost (type) {
      if (type === 'add') {
        this.alertShow.type = 'add'
        this.alertShow.typeName = '添加角色'
      } else if (type === 'edit') {
        this.alertShow.type = 'edit'
        this.alertShow.typeName = '修改角色'
      }
      this.alertShow.addPost = true
    },
    addPostSave () {
      if (this.addData.name === '') {
        this.$Message.warning({
          content: '角色名称不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.name, 'name')) {
        this.$Message.warning({
          content: '角色名称只能包含汉字',
          duration: 5
        })
      } else {
        this.sendAjax()
      }
    },
    sendAjax () {
      let type = this.alertShow.type
      if (type === 'add') {
        this.alertShow.addPost = false
        axios.post('/auth/role', {
          name: this.addData.name,
          state: this.addData.state
        }).then(res => {
          this.alertCanc('addPost')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addPost')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (type === 'edit') {
        this.alertShow.addPost = false
        axios.put('/auth/role', {
          id: this.userId,
          name: this.addData.name,
          state: this.addData.state
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('addPost')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addPost')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc (type) {
      if (type === 'addPost') {
        this.alertShow.addPost = false
        this.addData.name = ''
        this.addData.state = 1
        this.userId = null
        this.alertShow.type = ''
        this.alertShow.typeName = ''
      } else if (type === 'state') {
        this.userId = null
        this.userObj.stateShow = false
        this.userObj.stateCode = null
      } else if (type === 'rest') {
        this.userObj.restShow = false
        this.restList = []
        this.userId = null
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
