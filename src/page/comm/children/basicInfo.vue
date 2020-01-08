<template>
  <div class="basicInfo">
    <div class="_basic">
      <div class="_top">基本信息</div>
      <div class="_mid pt10 pb10" v-if="dataBasic !== null">
        <Row>
          <Col span="4">
            <p class="tr">仲裁机构：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.name"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">案号：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.code"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">申请时间：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.createTime"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">案件进度：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.stateName"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">申请人：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.partyName"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">被申请人：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.defendantName"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">案由：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.typeName"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">使用程序：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.userSoft"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">争议金额(元)：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.money"></p>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <p class="tr">总仲裁费(元)：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.cost"></p>
          </Col>
        </Row>
      </div>
    </div>
    <div class="_progress">
      <div class="_top">案件进度信息</div>
      <div class="_mid">
        <Row>
          <Col span="24" class="">
            <Table ref="table" stripe align="center" :loading="progressList.loading" :columns="progressList.header" :data="progressList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'basicInfo',
  props: ['caseId', 'caseState'],
  data () {
    return {
      dataBasic: null,
      progressList: {
        loading: false,
        header: [
          {
            title: '序号',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, params.index > 8 ? params.index + 1 : '0' + (params.index + 1))
            }
          },
          {
            title: '事件',
            key: 'name',
            align: 'center'
          },
          {
            title: '处理日期',
            key: 'createtime',
            align: 'center'
          },
          {
            title: '处理结果',
            key: 'action',
            align: 'center'
          },
          {
            title: '进度详情',
            key: 'memo',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'operatorName',
            align: 'center'
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resBaseItem()
    }
  },
  methods: {
    resBaseItem () {
      axios.post('/case/findCaseDetailsBaseMessageByCaseid', {
        caseId: this.caseId
      }).then(res => {
        this.dataBasic = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
      axios.post('/case/findCaseDetailsProcessByCaseid', {
        caseId: this.caseId
      }).then(res => {
        this.progressList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.basicInfo {
  ._progress {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._basic ._top, ._progress ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._basic ._mid, ._progress ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
    p {
      padding: 10px 5px;
    }
  }
}
</style>
