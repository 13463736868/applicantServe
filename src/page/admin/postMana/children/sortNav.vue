<template>
<div>
  <Modal v-model="alertShow" :mask-closable="false" :closable="false" width="500" title="操作">
    <Row>
      <Col span="24" v-for="(item, index) in routeList" :key="index">
        <p class="h32 lh32 f14 fc8 mr15 afterIcon">{{item.name}}
          <Icon type="md-arrow-up" size="16" color="#2d8cf0" class="mt5 fr ml10 hand" @click.native="up(item,index)" v-if="index !== 0"/>
          <Icon type="md-arrow-down" size="16" color="#2d8cf0" class="mt5 fr hand" @click.native="down(item,index)" v-if="index !== arrayLength-1"/>
        </p>
      </Col>
    </Row>
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
  props: ['roleId'],
  data () {
    return {
      alertShow: true,
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
  background-color: #f8f8f9
}
</style>
