<template>
  <div class="_evidInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <Row>
                <Col class="tr" span="6"><span class="mr10">证据项名称 :</span></Col>
                <Col span="17">
                  <span v-text="infoData.name"></span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="6"><span class="mr10">证明事项 :</span></Col>
                <Col span="17">
                  <span v-text="infoData.remarks"></span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="6"><span class="mr10">该证据是否为证据原件 :</span></Col>
                <Col span="17">
                  <span v-if="infoData.state === 1">是</span>
                  <span v-else-if="infoData.state === 2">否</span>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="6"><span class="mr10">附件名称 :</span></Col>
                <Col span="17">
                  <p class="_file p0" v-for="(item, index) in infoData.fileObjects" :key="index" :title="'点击查看: '+item.fileName" @click="seeFile(item.filePath)">{{item.fileName.length > 30 ? item.fileName.substr(0, 30) + '...' : item.fileName}}<b v-if="infoData.state === 2" class="ml10" style="color:#ed3f14;">（请注意：该证据非证据原件）</b></p>
                </Col>
              </Row>
            </p>
            <p>
              <Row>
                <Col class="tr" span="6"><span class="mr10">固化状态 :</span></Col>
                <Col span="17">
                  <span v-if="infoData.solidifyHashStatus === '1'" style="color:#19be6b;">证据固化一致</span>
                  <span v-else-if="infoData.solidifyHashStatus === '2'" style="color:#ed3f14;">证据固化不一致</span>
                  <span v-else-if="infoData.solidifyHashStatus === '3'" style="color:#ff9900;">证据未固化</span>
                  <span v-else-if="infoData.solidifyHashStatus === '4'" style="color:#19be6b;">证据未固化 ( 补充证据 )</span>
                  <span v-else-if="infoData.solidifyHashStatus === null" style="color:#ff9900;">证据未固化</span>
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
  name: 'evid_info',
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
._evidInfo {
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
