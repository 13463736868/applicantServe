<template>
  <div class="_alertEditor">
    <Modal v-model="alertShow"
           :mask-closable="false"
           :closable="false"
           width='960'
           class="not_s dialog">
      <div>
        <div style="border-bottom:1px solid #e8eaec;margin-bottom:10px">
          <Row>
            <Col span="15">
            <div style="width:100%;height:30px;border-right:1px solid #e8eaec">
              <h3>{{alertTitle}}</h3>
            </div>
            </Col>
            <Col span="9">
            <h3 style="text-indent: 2em">所有元素</h3>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span="15">
          <div class="left">
            <Row>
              <Col span="10"
                   offset="1">
              <Row class="_labelFor">
                <Col span="8">
                <p><span class="_span">*</span><b>模版名称：</b></p>
                </Col>
                <Col span="16">
                <Input v-model="tempName"></Input>
                </Col>
              </Row>
              </Col>
              <Col span="10"
                   offset="2">
              <Row class="_labelFor">
                <Col span="8">
                <p><span class="_span">*</span><b>注册名称：</b></p>
                </Col>
                <Col span="16">
                <Select v-model="requestName"
                        transfer
                        filterable
                        :disabled="alertDisType"
                        @on-change="resChange">
                  <Option v-for="item in requestNameList"
                          :value="item.userToken"
                          :key="item.userToken">{{ item.userName }}</Option>
                </Select>
                </Col>
              </Row>
              </Col>
            </Row>
            <Row>
              <Col span="10"
                   offset="1">
              <Row class="_labelFor"
                   v-if="requestName !== ''">
                <Col span="8">
                <p><span class="_span">*</span><b>案件类型：</b></p>
                </Col>
                <Col span="16">
                <Select v-model="caseTypeId"
                        transfer
                        :disabled="alertDisType"
                        @on-change="getCaseFieldList">
                  <Option v-for="item in caseTypeList[requestName]"
                          :value="item.id"
                          :key="item.id">{{ item.caseTypeName }}</Option>
                </Select>
                </Col>
              </Row>
              </Col>
              <Col span="10"
                   offset="2">
              <Row class="_labelFor"
                   v-if="requestName !== ''">
                <Col span="8">
                <p><span class="_span">*</span><b>文书类型：</b></p>
                </Col>
                <Col span="16">
                <Select v-model="batchDocumentType"
                        transfer
                        :disabled="alertDisType"
                        @on-change="getCaseFieldList">
                  <Option v-for="item in batchDocumentTypeList"
                          :value="item.itemValue"
                          :key="item.id">{{ item.item }}</Option>
                </Select>
                </Col>
              </Row>
              </Col>

            </Row>
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="3">
                <p><b>必有元素：</b></p>
                </Col>
                <Col span="20">
                <Row>
                  <Col class="pb10"
                       span="7"
                       offset="1"
                       v-for="(item, index) in fieldBtnList.must"
                       v-if="item.status===2"
                       :key="index">
                  <Tag closable
                       class="tagBox"
                       @click.native.stop="worldClick(item)"
                       @on-close="handleClose(item)">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}</Tag>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="3">
                <p><b>或有元素：</b></p>
                </Col>
                <Col span="20">
                <Row>
                  <Col class="pb10"
                       span="7"
                       offset="1"
                       v-for="(item, index) in fieldBtnList.orHave"
                       v-if="item.status===2"
                       :key="index">
                  <Tag closable
                       class="tagBox"
                       @click.native.stop="worldClick(item)"
                       @on-close="handleClose(item)">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}</Tag>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="3">
                <p><b>特有元素：</b></p>
                </Col>

                <Col span="20">
                <Row>
                  <Col class="pb10"
                       span="7"
                       offset="1"
                       v-for="(item, index) in fieldBtnList.specific"
                       v-if="item.status===2"
                       :key="index">
                  <Tag closable
                       class="tagBox"
                       @click.native.stop="worldClick(item)"
                       @on-close="handleClose(item)">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}</Tag>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
            <div>
              <div :id="randomId"
                   :key="randomId"
                   style="width:100%;"></div>
            </div>
          </div>
          </Col>
          <Col span="9">
          <div class="right">
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="18">
                <p><b>必有元素：</b></p>
                </Col>
                <Col span="6">
                <p><b class="addButton"
                     @click="addNews('1')">添加更多</b></p>
                </Col>
                <Col span="24"
                     class="right-button">
                <Row v-if="fieldBtnList.must !== null">
                  <Col class="pb10"
                       span="10"
                       :offset="index % 2 === 0 ? 0 : 2"
                       v-for="(item, index) in fieldBtnList.must"
                       :key="index">
                  <Button type="primary"
                          class="rightButton"
                          :disabled="item.status===2"
                          @click.stop="btnClick(item)"
                          :title="item.fieldName.length > 7 ? item.fieldName : item.fieldPlaceholder">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}
                    <Icon class="vtt"
                          size="14"
                          @click.stop="deleteButton(item)"
                          v-if="item.isDefault ===1"
                          type="ios-close-circle-outline" />
                    <Icon class="vtt"
                          size="14"
                          @click.stop="editTag(item)"
                          type="md-create" />
                  </Button>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="18">
                <p><b>或有元素：</b></p>
                </Col>
                <Col span="6">
                <p><b class="addButton"
                     @click="addNews('2')">添加更多</b></p>
                </Col>
                <Col span="24"
                     class="right-button">
                <Row v-if="fieldBtnList.orHave !== null">
                  <Col class="pb10"
                       span="10"
                       :offset="index % 2 === 0 ? 0 : 2"
                       v-for="(item, index) in fieldBtnList.orHave"
                       :key="index">
                  <Button type="primary"
                          class="rightButton"
                          :disabled="item.status===2"
                          @click.stop="btnClick(item)"
                          :title="item.fieldName.length > 7 ? item.fieldName : item.fieldPlaceholder">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}
                    <Icon class="vtt"
                          size="14"
                          v-if="item.isDefault ===1"
                          @click.stop="deleteButton(item)"
                          type="ios-close-circle-outline" />
                    <Icon class="vtt"
                          size="14"
                          @click.stop="editTag(item)"
                          type="md-create" />
                  </Button>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
            <Row>
              <Col span="23"
                   offset="1">
              <Row class="_labelFor">
                <Col span="18">
                <p><b>特有元素：</b></p>
                </Col>
                <Col span="6">
                <p><b class="addButton"
                     @click="addNews('3')">添加更多</b></p>
                </Col>
                <Col span="24"
                     class="right-button">
                <Row v-if="fieldBtnList.specific !== null">
                  <Col class="pb10"
                       span="10"
                       :offset="index % 2 === 0 ? 0 : 2"
                       v-for="(item, index) in fieldBtnList.specific"
                       :key="index">
                  <Button type="primary"
                          class="rightButton"
                          :disabled="item.status===2"
                          @click.stop="btnClick(item)"
                          :title="item.fieldName.length > 7 ? item.fieldName : item.fieldPlaceholder">{{item.fieldName.length > 7 ? item.fieldName.substr(0, 6) + '...' : item.fieldName}}
                    <Icon class="vtt"
                          size="14"
                          v-if="item.isDefault ===1"
                          @click.stop="deleteButton(item)"
                          type="ios-close-circle-outline" />
                    <Icon class="vtt"
                          size="14"
                          @click.stop="
                          editTag(item)"
                          type="md-create" />
                  </Button>
                  </Col>
                </Row>
                </Col>
              </Row>
              </Col>
            </Row>
          </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large"
                @click="alertCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="alertConfirm('add')">保存</Button>
        <Button type="primary"
                size="large"
                @click="alertConfirm('see')">预览</Button>
      </div>
    </Modal>
    <div>
      <alert-btn-info :alertShow="dialogShow.addNewButton"
                      :isSaveBtn="false"
                      :isCancBtn="false"
                      @alertConfirm="editorSave('add')"
                      @alertCancel="alertCanc('add')"
                      :alertTitle="addAlertTitle">
        <div>
          <Row class="_labelFor">
            <Col span="6"
                 offset="1">
            <p><span class="_span">*</span><b>元素名称：</b></p>
            </Col>
            <Col span="14">
            <Input v-model="fieldName"></Input>
            </Col>
          </Row>
          <Row class="_labelFor">
            <Col span="6"
                 offset="1">
            <p><span class="_span">*</span><b>元素描述：</b></p>
            </Col>
            <Col span="14">
            <Input v-model="fieldDescription"
                   type="textarea"></Input>
            </Col>
          </Row>
        </div>
      </alert-btn-info>
      <alert-btn-info :alertShow="dialogShow.delete"
                      :isSaveBtn="false"
                      :isCancBtn="false"
                      @alertConfirm="editorSave('delete')"
                      @alertCancel="alertCanc('delete')"
                      alertTitle="删除元素">
        <p class="t2">确定要删除该元素?</p>
      </alert-btn-info>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.min.js'
import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor/ueditor.parse.min.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'ceshi_editor',
  components: { alertBtnInfo },
  props: ['alertShow', 'alertTitle', 'alertContent', 'alertName', 'alertToken', 'alertTypeId', 'alertDocument', 'alertDisType'],
  data () {
    return {
      editId: null, // 修改元素的id
      fieldDeleteId: null,
      fieldDescription: null, // 元素描述
      fieldType: null,
      fieldName: null,
      addAlertTitle: null,
      fieldTypeList: [
        {
          id: 1,
          item: '必有',
          value: 1
        },
        {
          id: 2,
          item: '或有',
          value: 2
        },
        {
          id: 3,
          item: '特有',
          value: 3
        }
      ],
      batchDocumentTypeList: [],
      batchDocumentType: null, // 文书类型
      dialogShow: {// 模态框
        addType: null,
        addNewButton: false,
        editor: false,
        delete: false
      },
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      editor: null,
      value: '',
      oldLen: 0,
      requestName: '',
      caseTypeId: '',
      caseTypeList: {},
      requestNameList: [],
      tempName: '',
      btnData: null,
      fieldBtnList: {}
    }
  },
  created () {
    if (this.alertContent !== null) {
      this.tempName = this.alertName
      this.requestName = this.alertToken
      this.caseTypeId = this.alertTypeId
      this.batchDocumentType = this.alertDocument
    }
    this.dictionary()
    this.getCaseFieldList()
    this.batchDocuTypeList()
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    batchDocuTypeList () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'batchDocumentType'
      })
        .then(res => {
          this.batchDocumentTypeList = res.data.data
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
    },
    getSelected (item) {
      var selectedId = []
      item.forEach(a => a.status === 2 ? selectedId.push(a.id) : false)
      return selectedId
    },
    getCaseFieldList () {
      axios.post('/caseField/list', {
        caseTypeId: this.caseTypeId,
        documentType: this.batchDocumentType
      }).then(res => {
        this.fieldBtnList = res.data.data
        if (typeof this.fieldBtnList.tempName === 'string') {
          this.tempName = this.fieldBtnList.tempName
        }
        if (typeof this.fieldBtnList.tempContent === 'string') {
          this.editor.setContent(this.fieldBtnList.tempContent)
        }
      }).catch(e => {
        // this.$Message.error({
        //   content: '错误信息:' + e + ' 稍后再试',
        //   duration: 5
        // })
      })
    },
    // 取消添加
    alertCanc (type) {
      switch (type) {
        case 'add':
          this.fieldName = null
          this.fieldDescription = null
          this.editId = null
          this.dialogShow.addNewButton = false
          break
        case 'delete':
          this.fieldDeleteId = null
          this.dialogShow.delete = false
          break
      }
    },
    editFieldList (item, operateType) {
      let _type = item.type === 1 ? 'must' : item.type === 2 ? 'orHave' : item.type === 3 ? 'specific' : null
      if (_type === null) {
        return false
      }
      if (operateType === 'delete') {
        this.fieldBtnList[_type].forEach((arrItem, index) => {
          if (item.id === arrItem.id) {
            this.fieldBtnList[_type].splice(index, 1)
          }
        })
      } else if (operateType === 'edit') {
        this.fieldBtnList[_type].forEach((arrItem, index) => {
          if (item.id === arrItem.id) {
            this.fieldBtnList[_type][index] = item
            this.fieldBtnList[_type].splice(0, 0)
          }
        })
      } else if (operateType === 'add') {
        this.fieldBtnList[_type].push(item)
      }
    },
    editorSave (type) {
      if (type === 'delete') {
        var deleteId = {
          id: this.fieldDeleteId
        }
        axios.post('/caseField/delete', deleteId).then(res => {
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.alertCanc('delete')
          this.editFieldList(res.data.data, 'delete')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else {
        if (this.editId === null) {
          this.addField()
        } else {
          this.updateField()
        }
      }
    },
    // 添加元素请求
    addField () {
      if (this.fieldName === null) {
        this.$Message.error({
          content: '元素名称不能为空',
          duration: 5
        })
      } else if (this.fieldDescription === null) {
        this.$Message.error({
          content: '元素描述不能为空',
          duration: 5
        })
      } else {
        var data = {
          fieldName: this.fieldName.replace(/\s+/g, ''),
          fieldDescription: this.fieldDescription.replace(/\s+/g, ''),
          type: this.dialogShow.addType,
          caseTypeId: this.caseTypeId,
          documentType: this.batchDocumentType
        }
        axios.post('/caseField/add', data).then(res => {
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.alertCanc('add')
          this.editFieldList(res.data.data, 'add')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    // 修改元素得请求
    updateField () {
      if (this.fieldName === null) {
        this.$Message.error({
          content: '元素名称不能为空',
          duration: 5
        })
      } else if (this.fieldDescription === null) {
        this.$Message.error({
          content: '元素描述不能为空',
          duration: 5
        })
      } else {
        var data = {
          id: this.editId,
          fieldName: this.fieldName.replace(/\s+/g, ''),
          fieldDescription: this.fieldDescription.replace(/\s+/g, ''),
          type: this.dialogShow.addType,
          caseTypeId: this.caseTypeId,
          documentType: this.batchDocumentType
        }
        axios.post('/caseField/update', data).then(res => {
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.alertCanc('add')
          this.editFieldList(res.data.data, 'edit')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    deleteButton (item) {
      this.dialogShow.delete = true
      this.fieldDeleteId = item.id
    },
    // 添加新元素
    addNews (item) {
      if (this.caseTypeId === '') {
        this.$Message.error({
          content: '案件类型不能为空',
          duration: 5
        })
      } else if (this.batchDocumentType === null) {
        this.$Message.error({
          content: '文书类型不能为空',
          duration: 5
        })
      } else {
        this.dialogShow.addNewButton = true
        this.addAlertTitle = '添加元素'
        this.dialogShow.addType = parseInt(item)
      }
    },
    editTag (item) {
      this.addAlertTitle = '编辑元素'
      this.dialogShow.addNewButton = true
      // this.fieldType = item.type
      // this.batchDocumentType =
      this.dialogShow.addType = item.type
      this.editId = item.id
      this.fieldName = item.fieldName
      this.fieldDescription = item.fieldDescription
    },
    // 删除所选元素// 删除所选元素
    handleClose (item) {
      let _type = item.type === 1 ? 'must' : item.type === 2 ? 'orHave' : item.type === 3 ? 'specific' : null
      this.fieldBtnList[_type].forEach((arrItem, index) => {
        if (item.id === arrItem.id) {
          arrItem.status = 1
          this.fieldBtnList[_type].splice(0, 0)
        }
      })
      var historyEdit = this.editor.getContent().replace(new RegExp(item.fieldNameShow, 'g'), '')
      this.editor.setContent(historyEdit)
    },
    resChange () {
      this.caseTypeId = ''
    },
    resDict () {
      axios.post('/batchCaseDocument/findCaseField', {
        pageIndex: 0,
        pageSize: 999
      }).then(res => {
        let btnData = res.data.data.dataList
        btnData.forEach((item, index) => {
          item.disabled = false
        })
        this.btnData = btnData
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    dictionary () {
      axios.post('/batchCaseDocument/findCaseType').then(res => {
        let _obj = res.data.data
        this.requestNameList = _obj
        this.requestNameList.map((a) => {
          this.caseTypeList[a.userToken] = a.caseTypeList
        })
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    worldClick (item) {
      this.editor.execCommand('inserthtml', item.fieldNameShow)
    },
    btnClick (item) {
      let _type = item.type === 1 ? 'must' : item.type === 2 ? 'orHave' : item.type === 3 ? 'specific' : null
      item.status = 2
      this.fieldBtnList[_type].splice(0, 0)
    },
    initEditor () {
      this.editor = window.UE.getEditor(this.randomId)
      this.editor.addListener('ready', () => {
        if (this.alertContent === null) {
          this.editor.setContent('')
        } else {
          this.editor.setContent(this.alertContent)
        }
      })
    },
    stringToByte (str) {
      if (str === '') {
        return []
      }
      let bytes = []
      let len, c
      len = str.length
      for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0)
          bytes.push(((c >> 12) & 0x3F) | 0x80)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0)
          bytes.push((c & 0x3F) | 0x80)
        } else {
          bytes.push(c & 0xFF)
        }
      }
      return bytes
    },
    alertConfirm (type) {
      if (this.tempName === '') {
        this.$Message.error({
          content: '模版名称不能为空',
          duration: 5
        })
      } else if (this.caseTypeId === '') {
        this.$Message.error({
          content: '请选择注册名称和案件类型',
          duration: 5
        })
      } else if (this.editor.getContent().length === 0) {
        this.$Message.error({
          content: '模版内容不为空',
          duration: 5
        })
      } else {
        var mustId = this.getSelected(this.fieldBtnList.must)
        var orHaveId = this.getSelected(this.fieldBtnList.orHave)
        var specificId = this.getSelected(this.fieldBtnList.specific)
        var allIdArr = mustId.concat(orHaveId, specificId)
        this.editor.execCommand('selectall')
        this.editor.execCommand('fontfamily', 'SimSun')
        this.$emit('alertConfirm', this.fieldBtnList.tempId, type, this.tempName, this.caseTypeId, this.editor.getContent(), this.batchDocumentType, allIdArr.join(','))
      }
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
.addButton {
  color: #2f54eb;
  cursor: pointer;
}
.right-button {
  max-height: 240px;
  overflow-y: auto;
}
.right {
  padding-top: 10px;
}
.left {
  box-sizing: border-box;
  border-right: 1px dashed #a9a9a9;
  padding-top: 10px;
}
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
}

.tagBox {
  height: 31px;
  line-height: 31px;
}
</style>
<style>
.dialog .ivu-modal {
padding-bottom: 100px;
}
.dialog .ivu-modal-mask {
z-index: 10 !important;
}
.dialog .ivu-modal-wrap {
z-index: 10 !important;
}
</style>
