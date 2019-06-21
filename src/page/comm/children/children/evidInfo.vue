<template>
  <div class="_evidInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <span class="mr10">证据项名称 :</span>
              <span v-text="infoData.name"></span>
            </p>
            <p>
              <span class="mr10">是否有原件 :</span>
              <span v-if="infoData.state === 1">是</span>
              <span v-else-if="infoData.state === 2">否</span>
            </p>
            <p>
              <span class="mr10">证据项描述 :</span>
              <span v-text="infoData.remarks"></span>
            </p>
            <p>
              <span class="mr10">附件名称 :</span>
              <span class="_file" v-for="(item, index) in infoData.fileObjects" :key="index" :title="'点击查看: '+item.fileName" @click="seeFile(item.filePath)">{{item.fileName.length > 15 ? item.fileName.substr(0, 15) + '...' : item.fileName}}</span>
            </p>
            <p>
              <span class="mr10">固化状态 :</span>
              <span v-if="infoData.solidifyHashStatus === '1'" style="color:#19be6b;">证据固化一致</span>
              <span v-else-if="infoData.solidifyHashStatus === '2'" style="color:#ed3f14;">证据固化不一致</span>
              <span v-else-if="infoData.solidifyHashStatus === '3'" style="color:#ff9900;">证据未固化</span>
              <span v-else-if="infoData.solidifyHashStatus === '4'" style="color:#19be6b;">证据未固化 ( 补充证据 )</span>
              <span v-else-if="infoData.solidifyHashStatus === null" style="color:#ff9900;">证据未固化</span>
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
