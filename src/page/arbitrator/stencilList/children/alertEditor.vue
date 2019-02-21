<template>
  <div class="_alertEditor">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      :closable="false"
      width='960'
      class="not_s">
      <div>
        <Row>
          <Col span="10" offset="1">
            <Row class="_labelFor">
              <Col span="6">
                <p><span class="_span">*</span><b>模版名称：</b></p>
              </Col>
              <Col span="18">
                <Input v-model="tempName"></Input>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <Row class="_labelFor">
              <Col span="6">
                <p><span class="_span">*</span><b>注册名称：</b></p>
              </Col>
              <Col span="18">
                <Select v-model="requestName" filterable @on-change="resChange">
                  <Option v-for="item in requestNameList" :value="item.userToken" :key="item.userToken">{{ item.userName }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="10" offset="2">
            <Row class="_labelFor" v-if="requestName !== ''">
              <Col span="6">
                <p><span class="_span">*</span><b>案件类型：</b></p>
              </Col>
              <Col span="18">
                <Select v-model="caseTypeId">
                  <Option v-for="item in caseTypeList[requestName]" :value="item.id" :key="item.id">{{ item.caseTypeName }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row v-if="btnData !== null">
          <Col class="pb10" span="3" offset="1" v-for="(item, index) in btnData" :key="index">
            <Button type="primary" @click="btnClick(item)" :title="item.fieldPlaceholder">{{item.fieldDescription}}</Button>
          </Col>
        </Row>
      </div>
      <div>
        <div :id="randomId" :key="randomId" style="width:100%;"></div>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button type="primary" size="large" @click="alertConfirm">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.min.js'
import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor/ueditor.parse.min.js'

export default {
  name: 'alert_editor',
  props: ['alertShow', 'alertTitle'],
  data () {
    return {
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      editor: null,
      value: '',
      oldLen: 0,
      requestName: '',
      caseTypeId: '',
      caseTypeList: {},
      requestNameList: [],
      tempName: '',
      btnData: null
    }
  },
  created () {
    this.resDict()
    this.dictionary()
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    resChange () {
      this.caseTypeId = ''
    },
    resDict () {
      axios.post('/batchCaseDocument/findCaseField', {
        pageIndex: 0,
        pageSize: 500
      }).then(res => {
        this.btnData = res.data.data.dataList
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
    btnClick (item) {
      this.editor.execCommand('inserthtml', item.fieldPlaceholder)
    },
    initEditor () {
      this.editor = window.UE.getEditor(this.randomId)
      this.editor.addListener('ready', () => {
        this.editor.setContent('')
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
    alertConfirm () {
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
        this.editor.execCommand('selectall')
        this.editor.execCommand('fontfamily', 'SimSun')
        this.$emit('alertConfirm', this.tempName, this.caseTypeId, this.editor.getContent())
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
.ivu-modal-mask {
  z-index: 999!important;
}
._labelFor {
  z-index: 1000;
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
}
</style>
