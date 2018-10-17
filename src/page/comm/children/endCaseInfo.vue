<template>
  <div class="endCaseInfo">
    <div class="_endCase">
      <div class="_top">结案</div>
      <div v-if="endCaseD !== null" class="_mid">
        <Row>
          <Col span="22" offset="1">
            <p>结案方式：<span v-text="endCaseD.caseDocumentTypeName"></span></p>
            <p>结案日期：<span v-text="endCaseD.endCaseDate"></span></p>
            <p>结案文书：<span class="_file" v-text="endCaseD.filename" @click="seeFile(endCaseD.filepath)"></span></p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'endCaseInfo',
  props: ['caseId', 'caseState'],
  data () {
    return {
      endCaseD: null
    }
  },
  created () {
    if (this.caseId !== null) {
      this.resCase()
    }
  },
  methods: {
    resCase () {
      axios.post('/clientRequest/findEndCaseMessage', {
        caseId: this.caseId
      }).then(res => {
        this.endCaseD = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    seeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.endCaseInfo {
  ._endCase {
    padding-bottom: 60px;
  }
  ._endCase ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._endCase ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    margin-top: 10px;
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
