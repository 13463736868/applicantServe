<template>
  <div class="userMana">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="姓名"></Input>
        </Col>
        <Col span="2" offset="10">
          <Button type="primary" @click="resAddUpload">批量导入</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resAddUser('add')">添加</Button>
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
    <alert-btn-info :alertShow="alertShow.addUser" @alertConfirm="addUserSave" @alertCancel="alertCanc('addUser')" :alertTitle="alertShow.typeName">
      <div>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>用户名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.name"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>登录名：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.loginname"></Input>
          </Col>
        </Row>
        <Row class="_labelFor" v-if="alertShow.type === 'add'">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>登陆密码：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.password"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>固定号码：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.phone"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>邮箱：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="addData.email"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>用户状态：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.state">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>部门：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.department">
              <Option :disabled="item.state === 2" v-for="item in depaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>职位：</b></p>
          </Col>
          <Col span="16">
            <Select v-model="addData.role">
              <Option :disabled="item.state === 2" v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </alert-btn-info>
    <alert-btn-info :alertShow="userObj.stateShow" @alertConfirm="stateSave" @alertCancel="alertCanc('state')" alertTitle="操作">
      <p v-if="userObj.stateCode === 2">确定要停用吗？</p>
      <p v-else-if="userObj.stateCode === 1">确定要启用吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="userObj.resetShow" @alertConfirm="resetSave" @alertCancel="alertCanc('reset')" alertTitle="操作">
      <p>确定要重置密码吗？</p>
    </alert-btn-info>
    <alert-btn-info :isCancBtn="true" :isSaveBtn="true" :alertShow="userObj.addU" alertTitle="操作">
      <upload-book childName="批量导入用户" :dowShow="true" :fileType="['xls','xlsx']" :uploadUrl="resUploadUrl" @dowDoc="dowDocBook" @saveClick="addUSave" @cancClick="alertCanc('addU')"></upload-book>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import uploadBook from '@/components/common/uploadBook'
import setRegExp from '@/config/regExp.js'
import regi from '@/config/regiType.js'

export default {
  name: 'user_mana',
  components: { spinComp, alertBtnInfo, uploadBook },
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
            title: '姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'loginname',
            align: 'center'
          },
          {
            title: '固定号码',
            key: 'phone',
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'email',
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
            key: 'createtime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            minWidth: 70,
            align: 'center',
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
      },
      alertShow: {
        addUser: false,
        type: '',
        typeName: ''
      },
      addData: {
        name: '',
        loginname: '',
        password: '',
        phone: '',
        email: '',
        state: 1,
        department: '',
        role: ''
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
      depaList: [],
      roleList: [],
      userId: null,
      userObj: {
        stateShow: false,
        stateCode: null,
        resetShow: false,
        addU: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/user/batchaddUser'
    }
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
                this.resStatusUser(2, params.index)
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
                this.resEditUser(params.index)
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
                this.resResetUser(params.index)
              }
            }
          }, '重置密码')
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
                this.resStatusUser(1, params.index)
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
                this.resEditUser(params.index)
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
                this.resResetUser(params.index)
              }
            }
          }, '重置密码')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.get('/user', {
        params: {
          pageNum: this.pageObj.pageNum,
          pageSize: this.pageObj.pageSize,
          name: this.search.text
        }
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.list === null ? [] : _data.list
        this.pageObj.total = _data.total
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
    resResetUser (index) {
      this.userObj.resetShow = true
      this.userId = this.caseList.bodyList[index].id
    },
    resetSave () {
      this.userObj.resetShow = false
      axios.put('/user/password/' + this.userId).then(res => {
        this.alertCanc('reset')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
      }).catch(e => {
        this.alertCanc('reset')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resEditUser (index) {
      let _res = this.caseList.bodyList[index]
      this.userId = _res.id
      this.addData.name = _res.name
      this.addData.loginname = _res.loginname
      this.addData.password = _res.password
      this.addData.phone = _res.phone
      this.addData.email = _res.email
      this.addData.state = _res.state
      this.addData.department = _res.department.id
      this.addData.role = _res.role.id
      this.resAddUser('edit')
    },
    resStatusUser (type, index) {
      this.userObj.stateCode = type
      this.userId = this.caseList.bodyList[index].id
      this.userObj.stateShow = true
    },
    stateSave () {
      this.userObj.stateShow = false
      axios.put('/user', {
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
    resAddUser (type) {
      if (type === 'add') {
        this.alertShow.type = 'add'
        this.alertShow.typeName = '添加用户'
      } else if (type === 'edit') {
        this.alertShow.type = 'edit'
        this.alertShow.typeName = '修改用户'
      }
      axios.all([axios.get('/auth/department'), axios.get('/auth/role')]).then(axios.spread((resO, resT) => {
        let listO = resO.data.data
        let listT = resT.data.data
        let selectO = []
        let selectT = []
        for (let k in listO) {
          let _o = {}
          _o.value = listO[k].id
          _o.label = listO[k].name
          _o.state = listO[k].state
          selectO.push(_o)
        }
        for (let k in listT) {
          let _t = {}
          _t.value = listT[k].id
          _t.label = listT[k].name
          _t.state = listT[k].state
          selectT.push(_t)
        }
        this.depaList = selectO
        this.roleList = selectT
        this.alertShow.addUser = true
      })).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    addUserSave () {
      if (this.addData.name === '') {
        this.$Message.warning({
          content: '用户名称不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.name, 'name')) {
        this.$Message.warning({
          content: '请输入正确用户名只能包含汉字',
          duration: 5
        })
      } else if (this.addData.loginname === '') {
        this.$Message.warning({
          content: '登录名不能为空',
          duration: 5
        })
      } else if (this.addData.password === '') {
        this.$Message.warning({
          content: '登录密码不能为空',
          duration: 5
        })
      } else if (this.alertShow.type === 'add' && !setRegExp(this.addData.password, 'password')) {
        this.$Message.warning({
          content: '密码长度8~30位,必须包含大写字母,小写字母,数字,特殊符号(且不能包含下划线_)',
          duration: 5
        })
      } else if (this.addData.phone === '') {
        this.$Message.warning({
          content: '固定号码不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.phone, 'landline')) {
        this.$Message.warning({
          content: '固定号码格式不正确',
          duration: 5
        })
      } else if (this.addData.email === '') {
        this.$Message.warning({
          content: '邮箱地址不能为空',
          duration: 5
        })
      } else if (!setRegExp(this.addData.email, 'email')) {
        this.$Message.warning({
          content: '邮箱地址格式不正确',
          duration: 5
        })
      } else if (this.addData.state !== 1 && this.addData.state !== 2) {
        this.$Message.warning({
          content: '请选择用户状态',
          duration: 5
        })
      } else if (this.addData.department === '') {
        this.$Message.warning({
          content: '请选择部门',
          duration: 5
        })
      } else if (this.addData.role === '') {
        this.$Message.warning({
          content: '请选择职位',
          duration: 5
        })
      } else {
        this.sendAjax()
      }
    },
    sendAjax () {
      let type = this.alertShow.type
      if (type === 'add') {
        this.alertShow.addUser = false
        axios.post('/user', {
          name: this.addData.name,
          loginname: this.addData.loginname,
          password: this.addData.password,
          phone: this.addData.phone,
          email: this.addData.email,
          state: this.addData.state,
          departmentId: this.addData.department,
          roleId: this.addData.role
        }).then(res => {
          this.alertCanc('addUser')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addUser')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (type === 'edit') {
        this.alertShow.addUser = false
        axios.put('/user', {
          id: this.userId,
          name: this.addData.name,
          loginname: this.addData.loginname,
          password: this.addData.password,
          phone: this.addData.phone,
          email: this.addData.email,
          state: this.addData.state,
          department: {id: this.addData.department},
          role: {id: this.addData.role}
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('addUser')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('addUser')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    resAddUpload () {
      this.userObj.addU = true
    },
    addUSave () {
      this.alertCanc('addU')
      this.resSearch()
      this.$Message.success({
        content: '上传成功',
        duration: 2
      })
    },
    dowDocBook () {
      window.open(regi.api + '/file/templet/dowload/3', '_blank')
    },
    alertCanc (type) {
      if (type === 'addUser') {
        this.alertShow.addUser = false
        this.addData = {
          name: '',
          loginname: '',
          password: '',
          phone: '',
          email: '',
          state: 1,
          department: '',
          role: ''
        }
        this.depaList = []
        this.roleList = []
        this.alertShow.type = ''
        this.alertShow.typeName = ''
        this.userId = null
      } else if (type === 'state') {
        this.userId = null
        this.userObj.stateShow = false
        this.userObj.stateCode = null
      } else if (type === 'dele') {
        this.userId = null
        this.userObj.deleShow = false
      } else if (type === 'reset') {
        this.userId = null
        this.userObj.resetShow = false
      } else if (type === 'addU') {
        this.userObj.addU = false
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
