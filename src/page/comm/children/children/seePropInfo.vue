<template>
  <div class="_seePropInfo">
    <Row>
      <Col span="23" offset="1" class="_type">
        <span class="mr10">当事人属性：</span>
        <span v-if="propData.type === 1">自然人</span>
        <span v-else-if="propData.type === 2">企业</span>
        <span v-else-if="propData.type === 3">个体户</span>
        <span v-else-if="propData.type === 4">其他组织</span>
      </Col>
      <Row v-if="propData.type === 1">
        <Col span="10" offset="1">
          <Row class="_labelFor">
            <Col span="24" class="_label">姓名<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.name"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">民族<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.nationName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcardTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcard"></span></Col>
          </Row>
        </Col>
        <Col span="10" offset="2">
          <Row class="_labelFor">
            <Col span="24" class="_label">性别<b class="_b">*</b></Col>
            <Col span="24" class="_input">
              <span v-if="propData.sex === null">未知</span>
              <span v-else-if="propData.sex === 1">男</span>
              <span v-else-if="propData.sex === 2">女</span>
            </Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达手机<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.phone"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达邮箱</Col>
            <Col span="24" class="_input"><span v-text="propData.email"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系地址</Col>
            <Col span="24" class="_input"><p v-text="propData.address" :title="propData.address"></p></Col>
          </Row>
        </Col>
      </Row>
      <Row v-else-if="propData.type === 2">
        <Col span="10" offset="1">
          <Row class="_labelFor">
            <Col span="24" class="_label">企业名称<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseIdcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系人</Col>
            <Col span="24" class="_input"><span v-text="propData.linkMan"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达手机</Col>
            <Col span="24" class="_input"><span v-text="propData.phone"></span></Col>
          </Row>
        </Col>
        <Col span="10" offset="2">
          <Row class="_labelFor">
            <Col span="24" class="_label">法定代表人<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.name"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcardTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达邮箱</Col>
            <Col span="24" class="_input"><span v-text="propData.email"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系地址</Col>
            <Col span="24" class="_input"><p v-text="propData.address" :title="propData.address"></p></Col>
          </Row>
        </Col>
      </Row>
      <Row v-else-if="propData.type === 3">
        <Col span="10" offset="1">
          <Row class="_labelFor">
            <Col span="24" class="_label">名称<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseIdcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系人</Col>
            <Col span="24" class="_input"><span v-text="propData.linkMan"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达手机</Col>
            <Col span="24" class="_input"><span v-text="propData.phone"></span></Col>
          </Row>
        </Col>
        <Col span="10" offset="2">
          <Row class="_labelFor">
            <Col span="24" class="_label">经营者<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.name"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcardTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达邮箱</Col>
            <Col span="24" class="_input"><span v-text="propData.email"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系地址</Col>
            <Col span="24" class="_input"><p v-text="propData.address" :title="propData.address"></p></Col>
          </Row>
        </Col>
      </Row>
      <Row v-else-if="propData.type === 4">
        <Col span="10" offset="1">
          <Row class="_labelFor">
            <Col span="24" class="_label">组织名称<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证照号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.enterpriseIdcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系人</Col>
            <Col span="24" class="_input"><span v-text="propData.linkMan"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达手机</Col>
            <Col span="24" class="_input"><span v-text="propData.phone"></span></Col>
          </Row>
        </Col>
        <Col span="10" offset="2">
          <Row class="_labelFor">
            <Col span="24" class="_label">负责人<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.name"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件类型<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcardTypeName"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">证件号码<b class="_b">*</b></Col>
            <Col span="24" class="_input"><span v-text="propData.idcard"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">送达邮箱</Col>
            <Col span="24" class="_input"><span v-text="propData.email"></span></Col>
          </Row>
          <Row class="_labelFor">
            <Col span="24" class="_label">联系地址</Col>
            <Col span="24" class="_input"><p v-text="propData.address" :title="propData.address"></p></Col>
          </Row>
        </Col>
      </Row>
    </Row>
    <Row>
      <Col class="tc mt10" span="20" offset="2"><button class="_saveBtn" :class="{'_disabled':seePropBtn}" v-bind:disabled="seePropBtn" @click="saveClick">确 定</button></Col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'see_prop_info',
  props: ['seePropData'],
  data () {
    return {
      seePropBtn: false,
      propData: JSON.parse(JSON.stringify(this.seePropData))
    }
  },
  methods: {
    saveClick () {
      this.$emit('saveClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._seePropInfo {
  @include borderRadius(3px);
  @include boxShadow(0 1px 6px -1px #bbb);
  margin-top: 10px;
  padding: 15px;
  background: #fff;
  font-size: 12px;
  ._type {
    margin-bottom: 10px;
    height: 24px;
    line-height: 24px;
  }
  ._labelFor {
    ._label {
      height: 20px;
      line-height: 20px;
      ._b {
        color: #ff7a7a;
        margin-left: 5px;
        vertical-align: middle;
      }
    }
    ._input {
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      height: 32px;
      p {
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        display: inline-block;
        width: 100%;
        letter-spacing: 1px;
        font-size: 12px;
        color: #666;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  ._saveBtn {
    @include btn(#126eaf, 90px, 14px, 32px);
    @include boxShadow(0 1px 6px -1px #bbb);
    @include borderRadius(4px);
  }
  ._saveBtn._disabled {
    @include btn(#ccc, 90px, 14px, 32px);
  }
  ._saveBtn:focus {
    outline: 0px;
  }
}
</style>
