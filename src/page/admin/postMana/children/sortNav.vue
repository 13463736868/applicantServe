<template>
<div v-if="alertShow">
  <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="500" title="操作">
    <div>
      <Row>
        <Col span="24" v-for="(item, index) in routeList" :key="index">
          <ul>
            <li class="lh32 f16 fc6 mr15 afterIcon">{{item.name}}
              <Icon type="md-arrow-up" class="fr mt8" @click.native="up(item,index)" v-if="index !== 0"/>
              <Icon type="md-arrow-down" class="fr mt8" @click.native="down(item,index)" v-if="index !== arrayLength-1"/>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button size="large" @click="alertCancel">取消</Button>
      <Button type="primary" size="large" @click="alertConfirm()">保存</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['roleId', 'alertShow'],
  data () {
    return {
      routeList: [],
      arrayLength: null
    }
  },
  created () {
    if (this.roleId) {
      this.resRoleList()
    }
  },
  methods: {
    resRoleList () {
      axios.get('/auth/findRoute', {
        params: {
          roleId: this.roleId
        }
      }).then(res => {
        let _data = res.data.data
        this.routeList = _data === null ? [] : _data
        this.routeList.sort(sortList)
        function sortList (obj1, obj2) {
          var val1 = obj1.sort
          var val2 = obj2.sort
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 0
          }
        }
        this.arrayLength = this.routeList.length
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    down (item, index) {
      this.routeList.splice(index, 1)
      this.routeList.splice(index + 1, 0, item)
    },
    up (item, index) {
      this.routeList.splice(index, 1)
      this.routeList.splice(index - 1, 0, item)
    },
    alertCancel () {
      this.$emit('alertCancel')
    },
    sortRouteList () {
      let arr = []
      this.routeList.forEach((item, index) => {
        let obj = {
          sort: null,
          id: null
        }
        obj.sort = index + 1
        obj.id = item.id
        arr.push(obj)
      })
      return arr
    },
    alertConfirm () {
      let query = this.sortRouteList()
      axios.post('/auth/routeSort', {
        jsonData: JSON.stringify(query)
      }).then(res => {
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.$emit('alertConfirm')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.afterIcon:hover{
  background-color: #e8eaec
}
</style>
