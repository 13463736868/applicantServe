<template>
  <div class="_seeAgenApplBook">
    <Row>
      <Col span="22" offset="1">
        <Row class="_labelFor" v-if="fileList.length !== 0">
          <Col span="4" class="_label">授权委托书<b class="_b">*</b></Col>
          <Col span="16" class="_input">
            <Row>
              <Col span="12" class="_item" v-for="item in fileList" :key="item.id"><span class="hand" :title="item.filename" @click="seeFile(item.filepath)">{{item.filename.length > 25 ? item.filename.substr(0, 20) + '...' : item.filename}}</span></Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'see_agen_appl_book',
  props: ['seeApplBookData'],
  data () {
    return {
      fileList: [],
      fileIdList: []
    }
  },
  created () {
    if (this.seeApplBookData !== null) {
      this.fileList.push(JSON.parse(JSON.stringify(this.seeApplBookData)))
      this.fileIdList.push(this.seeApplBookData.id)
    }
  },
  methods: {
    seeFile (path) {
      window.open(path, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
._seeAgenApplBook {
  ._item {
    color: #126eaf;
    height: 29px;
    line-height: 29px;
  }
  ._label {
    padding: 5px 0;
    ._b {
      color: #ff7a7a;
      margin-left: 5px;
      vertical-align: middle;
    }
  }
  ._text {
    padding: 20px 0;
  }
  ._input {
    border-bottom:1px solid #ddd;
  }
  padding-bottom: 10px;
}
</style>
