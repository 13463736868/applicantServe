<template>
  <div class="resSystMark">
    <Modal v-model="alertShow" width="500" :title="resTitle" :mask-closable="false" :closable="false">
      <div>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>规则名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="formData.watermarkName"></Input>
          </Col>
        </Row>
        <Row class="_labelFor lh30">
          <Col span="22" offset="1">
            <Checkbox v-model="formData.sysTime">系统当前时间</Checkbox>
          </Col>
        </Row>
        <Row class="_labelFor lh30">
          <Col span="6" offset="1">
            <Checkbox v-model="formData.randomNum" @on-change="selectBox('nub')">随机数字</Checkbox>
          </Col>
          <Col span="16">
            <Select v-model="formData.number" style="width:200px" v-if="formData.randomNum">
              <Option v-for="item in selectData.numberData" :value="item.value" :key="item.value">{{ item.lable }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor lh30">
          <Col span="6" offset="1">
            <Checkbox v-model="formData.randomStr" @on-change="selectBox('str')">随机字母</Checkbox>
          </Col>
          <Col span="16">
            <Select v-model="formData.string" style="width:200px" v-if="formData.randomStr">
              <Option v-for="item in selectData.numberData" :value="item.value" :key="item.value">{{ item.lable }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="_labelFor lh30">
          <Col span="22" offset="1">
            <Checkbox v-model="formData.userName">系统当前登录名</Checkbox>
          </Col>
        </Row>
        <Row class="_labelFor lh30">
          <Col span="22" offset="1">
            <Checkbox v-model="formData.sysFlag">系统当前标识码</Checkbox>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button v-if="isSaveBtn === true" type="primary" size="large" @click="alertConfirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
export default {
  name: 'res_syst_mark',
  components: { spinComp },
  props: ['resTitle', 'resId'],
  data () {
    return {
      agree: null,
      alertShow: true,
      isSaveBtn: true,
      formData: {
        watermarkName: null,
        sysTime: null,
        randomNum: null,
        number: null,
        randomStr: null,
        string: null,
        userName: null,
        sysFlag: null
      },
      selectData: {
        numberData: [
          {
            value: 1,
            lable: '1位'
          },
          {
            value: 2,
            lable: '2位'
          },
          {
            value: 3,
            lable: '3位'
          },
          {
            value: 4,
            lable: '4位'
          },
          {
            value: 5,
            lable: '5位'
          },
          {
            value: 6,
            lable: '6位'
          },
          {
            value: 7,
            lable: '7位'
          },
          {
            value: 8,
            lable: '8位'
          }
        ]
      }
    }
  },
  mounted () {
    if (this.resId) {
      if (this.resTitle === '查看') {
        this.isSaveBtn = false
      }
      this.resDetails()
    }
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    selectBox (type) {
      if (type === 'str') {
        this.formData.string = 0
      } else if (type === 'nub') {
        this.formData.number = 0
      }
    },
    resDetails () {
      axios.post('/watermarkReq/findSysWatermarkById', {
        id: this.resId
      }).then(res => {
        let _data = res.data.data
        this.formData.watermarkName = _data.watermarkName
        this.formData.sysTime = _data.sysTime === 0
        this.formData.sysFlag = _data.sysFlag !== null
        this.formData.userName = _data.userName === 0
        this.formData.randomNum = _data.randomNumber !== 0
        this.formData.randomStr = _data.randomLetter !== 0
        this.formData.number = _data.randomNumber
        this.formData.string = _data.randomLetter
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resEdit () {
      let query = {
        watermarkName: this.formData.watermarkName,
        sysTime: this.formData.sysTime === true ? 0 : 1,
        randomNumber: this.formData.number === null ? 0 : this.formData.number,
        randomLetter: this.formData.string === null ? 0 : this.formData.string,
        userName: this.formData.userName === true ? 0 : 1,
        sysFlag: this.formData.sysFlag === true ? '04' : 0,
        id: this.resId
      }
      axios.post('/watermarkReq/updateSysWatermark', query)
        .then(res => {
          this.resMessage('success', res.data.data)
          this.$emit('alertConfirm')
        }).catch(e => {
          this.spinShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
    },
    resAdd () {
      let query = {
        watermarkName: this.formData.watermarkName,
        sysTime: this.formData.sysTime === true ? 0 : 1,
        randomNumber: this.formData.number === null ? 0 : this.formData.number,
        randomLetter: this.formData.string === null ? 0 : this.formData.string,
        userName: this.formData.userName === true ? 0 : 1,
        sysFlag: this.formData.sysFlag === true ? 0 : '04'
      }
      axios.post('/watermarkReq/addSysWatermark', query).then(res => {
        this.resMessage('success', res.data.data)
        this.$emit('alertConfirm')
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertConfirm () {
      if (this.formData.watermarkName === null) {
        this.resMessage('warning', '请填写规则名称')
      } else if (this.formData.randomNum === true && this.formData.number === 0) {
        this.resMessage('warning', '请选择随机数字')
      } else if (this.formData.randomStr === true && this.formData.string === 0) {
        this.resMessage('warning', '请选择随机字母')
      } else {
        if (this.resId) {
          this.resEdit()
        } else {
          this.resAdd()
        }
      }
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss">
._labelFor {
  margin-bottom: 10px;
  // line-height: 30px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
  }
}
</style>
