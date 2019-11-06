<template>
  <div class="_questionInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <Row>
                <Col class="tr" span="3"><span class="mr10">提交人 :</span></Col>
                <Col span="20">
                  <span v-if="infoData.partyType === '1'">申请人</span>
                  <span v-if="infoData.partyType === '2'">被申请人</span>
                  <span v-if="infoData.partyType === '3'">仲裁委</span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="3"><span class="mr10">问题名称 :</span></Col>
                <Col span="20">
                  <span v-text="infoData.name"></span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="3"><span class="mr10">问题描述 :</span></Col>
                <Col span="20">
                  <span v-text="infoData.remarks"></span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="3"><span class="mr10">附件名称 :</span></Col>
                <Col span="20">
                  <span class="_file" v-text="infoData.fileName" :title="'点击查看: '+infoData.fileName" @click="seeFile(infoData.filePath)"></span>
                </Col>
              </Row>
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'question_info',
  props: ['infoData'],
  data () {
    return {}
  },
  methods: {
    seeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._questionInfo {
  margin-top: 10px;
  ._listL {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    p {
      word-break: break-all;
      padding: 5px 0;
    }
    ._file {
      @include hand;
      color: #337BB5;
      margin-right: 60px;
    }
  }
}
</style>
