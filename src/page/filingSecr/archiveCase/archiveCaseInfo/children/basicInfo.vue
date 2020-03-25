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
        <!-- <Row>
          <Col span="4">
            <p class="tr">仲裁员：</p>
          </Col>
          <Col span="18">
            <p v-text="dataBasic.arbitratorName"></p>
          </Col>
        </Row> -->
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
            <p class="tr">总仲裁费：</p>
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
    <div class="_evidence">
      <div class="_top">证据目录</div>
      <div class="_mid">
        <!-- <Row>
          <Col span="23" class="_label tr mt15 mb15">
            <span class="_enDow hand" @click="dowDoc">
              <Icon class="mr5" type="md-download" size="16" color="#ff7a7a"/>证据目录下载
            </span>
          </Col>
        </Row> -->
        <Row>
          <Col span="24">
            <Table ref="table" stripe align="center" :loading="evidenceList.loading" :columns="evidenceList.header" :data="evidenceList.bodyList"></Table>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import regi from '@/config/regiType.js'

export default {
  name: 'basic_info',
  mixins: [resMess],
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
              }, '0' + (params.index + 1))
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
            title: '备注',
            key: 'memo',
            align: 'center'
          }
        ],
        bodyList: []
      },
      evidenceList: {
        loading: false,
        header: [
          {
            type: 'index',
            title: '序号',
            width: 150,
            align: 'center'
          },
          {
            title: '证据名称',
            key: 'name',
            align: 'center',
            tooltip: true
          },
          {
            title: '证据描述',
            key: 'remarks',
            align: 'center',
            tooltip: true
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
      axios.post('/casesUnderLine/getCaseUnderLineDetailsByCaseId', {
        caseId: this.caseId
      }).then(res => {
        this.dataBasic = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
      axios.post('/casesUnderLine/findCaseUnderLineProcess', {
        caseId: this.caseId
      }).then(res => {
        this.progressList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
      axios.post('/casesUnderLine/findUnderLineEvidenceAndFile', {
        caseId: this.caseId,
        evidenceType: 1
      }).then(res => {
        this.evidenceList.bodyList = res.data.data === null ? [] : res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    dowDoc () {
      window.open(regi.api + '/file/templet/dowload/100?caseId=' + this.caseId, '_blank')
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
  ._evidence {
    // padding-top: 60px;
    padding-bottom: 60px;
  }
  ._basic ._top, ._progress ._top, ._evidence ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._basic ._mid, ._progress ._mid, ._evidence ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    margin-top: 10px;
    p {
      padding: 10px 5px;
    }
  }
  ._enDow {
    color: #2D8CF0
  }
}
</style>
