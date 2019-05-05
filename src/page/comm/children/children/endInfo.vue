<template>
  <div class="_endInfo">
    <Row class="_listL">
      <Col span="22" offset="1">
        <p>结案方式：<span v-text="infoData.caseDocumentTypeName"></span></p>
        <p>结案日期：<span v-text="infoData.endCaseDate"></span></p>
        <p>结案文书：<span class="_file" v-text="infoData.filename" @click="seeFile(infoData.filepath)"></span><Icon v-if="isIcon" @click="dowInfo" class="_dowFile" type="md-arrow-round-down"></Icon></p>
      </Col>
    </Row>
  </div>
</template>

<script>
import regi from '@/config/regiType.js'

export default {
  name: 'end_info',
  props: ['infoData'],
  data () {
    return {}
  },
  computed: {
    isIcon () {
      if (this.infoData.filename === null || this.infoData.filepath === null) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    seeFile (path) {
      window.open(path, '_blank')
    },
    dowInfo () {
      window.open(regi.api + '/file/download/?fileName=' + this.infoData.filename + '&filePath=' + this.infoData.filepath, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._endInfo {
  margin-top: 10px;
  ._listL {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    p {
      padding: 5px 0;
    }
    ._file {
      @include hand;
      color: #126eaf;
    }
    ._dowFile {
      @include hand;
      vertical-align: top;
      margin-left: 10px;
      font-size: 16px;
      color: #126eaf;
    }
  }
}
</style>
