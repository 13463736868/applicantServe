<template>
  <div class="_addModelAlert">
    <alert-btn-info :alertShow="addData.show" @alertConfirm="alertSave()" @alertCancel="alertCanc()" alertTitle="添加">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>模型名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="addData.name"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>描述：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="addData.description" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>模型类型：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="addData.key">
            <Option v-for="item in modelList" :disabled="item.state === 2" :value="item.itemValue" :key="item.id">{{ item.item }}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'add_model_list',
  mixins: [resMess],
  components: { alertBtnInfo },
  data () {
    return {
      addData: {
        show: true,
        name: '',
        description: '',
        key: null
      },
      modelList: []
    }
  },
  created () {
    this.resDictionary('caseFlowModelType')
  },
  methods: {
    resDictionary (_type) {
      axios.post('/dictionary/findDictionaryList', {
        type: _type
      }).then(res => {
        this.modelList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    alertSave () {
      if (this.addData.name === '') {
        this.resMessage('warning', '请填写模型名称')
      } else if (this.addData.description === '') {
        this.resMessage('warning', '请填写描述信息')
      } else if (this.addData.key === null) {
        this.resMessage('warning', '请选择一个模型类型')
      } else {
        axios.post('/activiti/create', {
          name: this.addData.name,
          description: this.addData.description,
          key: this.addData.key
        }).then(res => {
          this.$emit('alertConfirm', res.data.data)
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
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
}
</style>
