<template>
  <div class="_reasInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <span class="mr10">事实与理由 :</span>
            </p>
            <textarea readonly class="_textarea" v-model="infoData.content" rows="8"></textarea>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'reas_info',
  props: ['infoData'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._reasInfo {
  margin-top: 10px;
  ._listL {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    p {
      padding: 5px 0;
    }
    ._textarea {
      @include borderRadius(4px);
      width: 100%;
      padding: 5px 8px;
      resize: none;
      border: 1px solid #dddee1;
      outline: none;
      transition: all .2s ease-in-out;
    }
    ._textarea:hover {
      @include boxShadow(0 0 0 1px rgba(45,140,240,.2));
      border-color: #57a3f3;
      outline: 0;
    }
  }
}
</style>
