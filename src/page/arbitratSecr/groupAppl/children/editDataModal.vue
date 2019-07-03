<template>
  <div class="_editDataModal">
    <Modal
      v-model="alertShow"
      title="修改"
      :mask-closable="false"
      :closable="false"
      class="not_s">
      <div v-if="editData !== null">
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>文书类型：</b></p>
          </Col>
          <Col span="16">
            <RadioGroup v-model="docuType">
              <Radio :label="1">仲裁申请书数据：</Radio>
              <Radio :label="2">裁决书数据：</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <div v-if="docuType === 1">
          <div v-for="(item, name) in editData['仲裁申请书数据']" :key="name">
            <Row class="_labelFor">
              <Col span="6" offset="1">
                <p><span class="_span"></span><b>{{name}}</b></p>
              </Col>
              <Col span="16">
                <Input v-model="editData['仲裁申请书数据'][name]" disabled></Input>
              </Col>
            </Row>
          </div>
        </div>
        <div v-else-if="docuType === 2">
          <Row class="_labelFor" v-for="(item, name) in editData['裁决书数据']" :key="name">
            <Col span="6" offset="1">
              <p><span class="_span"></span><b>{{name}}</b></p>
            </Col>
            <Col span="16">
              <Input v-model="editData['裁决书数据'][name]"></Input>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button type="primary" size="large" @click="alertConfirm(0)">保存</Button>
        <Button v-if="conShow" type="primary" size="large" @click="alertConfirm(1)">确认并保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'edit_data_modal',
  props: ['editDataId', 'conShow'],
  data () {
    return {
      alertShow: true,
      docuType: 1,
      editData: null
    }
  },
  created () {
    this.resGetData()
  },
  methods: {
    resGetData () {
      axios.post('/case/findTemplateData', {
        caseId: this.editDataId
      }).then(res => {
        this.editData = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertConfirm (type) {
      axios.post('/case/saveJudgeTemplateData', {
        caseId: this.editDataId,
        judgeJsonData: JSON.stringify(this.editData['裁决书数据']),
        isconfirm: type === 1 ? 1 : null
      }).then(res => {
        this.$Message.success({
          content: res.data.data,
          duration: 2
        })
        this.$emit('alertConfirm')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
